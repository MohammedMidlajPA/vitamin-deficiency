
import { useState, useEffect } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { PlantChat } from "@/components/PlantChat";
import { Results } from "@/components/Results";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";

const PlantImages = [
  "/images/plant-bg-1.jpg",
  "/images/plant-bg-2.jpg",
];

const Index = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("detect");
  const [currentDiseaseInfo, setCurrentDiseaseInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set current disease info for the chat when results change
    if (results.length > 0) {
      setCurrentDiseaseInfo(results[0]);
      // Automatically switch to chat tab if a disease is detected
      setActiveTab("chat");
    } else {
      setCurrentDiseaseInfo(null);
    }
  }, [results]);

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
      
      if (highConfidenceDiseases.length > 0) {
        toast({
          title: "Disease Detected",
          description: `We've identified ${highConfidenceDiseases[0].name}. Chat with our assistant for treatment options.`,
        });
      } else {
        toast({
          title: "Analysis Complete",
          description: "Good news! No high-confidence plant diseases detected.",
        });
      }
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
    <div className="min-h-screen relative">
      {/* Background Images */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/95 to-violet-900/95" />
        {PlantImages.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 opacity-30 bg-no-repeat bg-cover mix-blend-overlay transition-opacity duration-1000 ease-in-out ${index === 0 ? 'animate-fade-in' : ''}`}
            style={{ backgroundImage: `url(${img})`, animationDelay: `${index * 0.5}s` }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen p-6 space-y-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-violet-500/20 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-violet-300" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-purple-100">
            Plant Disease Detection
          </h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Upload a photo of your plant and let our AI identify potential diseases. Get expert advice on treatment options.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 bg-black/20 backdrop-blur-md">
            <TabsTrigger value="detect" className="data-[state=active]:bg-violet-600/30">
              Detect Disease
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="data-[state=active]:bg-violet-600/30"
              disabled={!currentDiseaseInfo}
            >
              Treatment Assistant
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="detect" className="space-y-8 mt-6">
            <div className="glass-panel p-6 rounded-lg max-w-xl mx-auto bg-black/20 backdrop-blur-md border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-300" />
                <span>Upload Plant Image</span>
              </h2>
              <ImageUpload onImageSelect={handleImageSelect} />
            </div>
            
            {(analyzing || results.length > 0) && (
              <Results diseases={results} isLoading={analyzing} />
            )}
          </TabsContent>
          
          <TabsContent value="chat" className="mt-6">
            <PlantChat diseaseInfo={currentDiseaseInfo} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
