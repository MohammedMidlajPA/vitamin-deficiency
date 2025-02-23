
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { PlantChat } from "@/components/PlantChat";
import { Results } from "@/components/Results";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleImageSelect = async (file: File) => {
    setAnalyzing(true);
    
    try {
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Prepare data for Plant.id API
      const data = {
        api_key: "7E2TkZqU0bWsLwRv0D0p3gwK2KIavIonujj0q6g6TaryXmDAwz",
        images: [base64Image.split(',')[1]],
        modifiers: ["health_all"],
        disease_details: ["description", "treatment"],
      };

      // Make API call to Plant.id
      const response = await fetch('https://api.plant.id/v2/health_assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      // Filter for high confidence results only (>0.8 probability)
      const highConfidenceDiseases = result.health_assessment.diseases
        .filter((disease: any) => disease.probability > 0.8)
        .map((disease: any) => ({
          name: disease.name,
          probability: disease.probability,
          description: disease.description,
        }))
        .slice(0, 1); // Take only the top result

      setResults(highConfidenceDiseases);
      toast({
        title: "Analysis Complete",
        description: "We've analyzed your plant image and found the most likely issue.",
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze the image. Please try again.",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Plant Disease Detection</h1>
        <p className="text-lg text-muted-foreground">
          Upload a photo of your plant and let our AI help identify any potential diseases
        </p>
      </div>

      <Tabs defaultValue="detect" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="detect">Detect Disease</TabsTrigger>
          <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="detect" className="space-y-8 mt-6">
          <ImageUpload onImageSelect={handleImageSelect} />
          {(analyzing || results.length > 0) && (
            <Results diseases={results} isLoading={analyzing} />
          )}
        </TabsContent>
        
        <TabsContent value="chat" className="mt-6">
          <PlantChat />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
