
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
    // Mock API call - replace with actual PlantID API integration
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setResults([
        {
          name: "Leaf Spot Disease",
          probability: 0.85,
          description: "A fungal disease affecting plant leaves, causing brown or black spots.",
        },
        {
          name: "Powdery Mildew",
          probability: 0.45,
          description: "A fungal disease that appears as a white powdery substance on leaves.",
        },
      ]);
      toast({
        title: "Analysis Complete",
        description: "We've analyzed your plant image and found potential issues.",
      });
    } catch (error) {
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
