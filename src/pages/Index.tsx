
import { useState, useEffect } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { PlantChat } from "@/components/PlantChat";
import { AnimatedResults } from "@/components/AnimatedResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Leaf, Sparkles, ImageIcon, MessageSquare, AlertTriangle, InfoIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
  const [uploadCount, setUploadCount] = useState(0);

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

      // Increment upload count
      setUploadCount(prev => prev + 1);

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

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Images */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/95 to-violet-900/95" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        {PlantImages.map((img, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1.5, delay: index * 0.5 }}
            className="absolute inset-0 bg-no-repeat bg-cover mix-blend-overlay"
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>

      {/* Top Navigation */}
      <header className="relative z-10 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div 
                className="h-8 w-8 rounded-full bg-violet-500/20 flex items-center justify-center"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Leaf className="h-4 w-4 text-violet-300" />
              </motion.div>
              <span className="text-xl font-semibold text-white">PlantGuard AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                className="text-white border-white/20 hover:bg-white/10"
                onClick={() => window.location.href = "/"}
              >
                <motion.span 
                  whileHover={{ x: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Home
                </motion.span>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 min-h-[calc(100vh-80px)] p-6 pt-8 space-y-8"
      >
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute -inset-4 rounded-full bg-violet-500/10 blur-md"
              />
              <motion.div
                className="h-12 w-12 rounded-full bg-violet-500/20 flex items-center justify-center"
                animate={{
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Sparkles className="h-6 w-6 text-violet-300" />
              </motion.div>
            </div>
          </div>
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight gradient-text"
          >
            Plant Disease Detection
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-purple-100 max-w-2xl mx-auto"
          >
            Upload a photo of your plant and let our AI identify potential diseases. Get expert advice on treatment options.
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        {uploadCount > 0 && (
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(139, 92, 246, 0.3)" }}
              className="flex bg-black/20 backdrop-blur-sm border border-violet-500/10 rounded-lg p-4 items-center gap-4 transition-all"
            >
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <ImageIcon className="h-5 w-5 text-green-400" />
                </motion.div>
              </div>
              <div>
                <p className="text-sm text-violet-200">Images Analyzed</p>
                <p className="text-2xl font-semibold text-white">{uploadCount}</p>
              </div>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(139, 92, 246, 0.3)" }}
              className="flex bg-black/20 backdrop-blur-sm border border-violet-500/10 rounded-lg p-4 items-center gap-4 transition-all"
            >
              <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.2 }}
                >
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </motion.div>
              </div>
              <div>
                <p className="text-sm text-violet-200">Diseases Detected</p>
                <motion.p 
                  key={results.length}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-semibold text-white"
                >
                  {results.length}
                </motion.p>
              </div>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(139, 92, 246, 0.3)" }}
              className="flex bg-black/20 backdrop-blur-sm border border-violet-500/10 rounded-lg p-4 items-center gap-4 transition-all"
            >
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.4 }}
                >
                  <InfoIcon className="h-5 w-5 text-blue-400" />
                </motion.div>
              </div>
              <div>
                <p className="text-sm text-violet-200">Health Status</p>
                <p className="text-2xl font-semibold text-white">
                  {results.length > 0 ? "Needs Attention" : uploadCount > 0 ? "Healthy" : "Unknown"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-md border border-violet-500/10">
              <TabsTrigger 
                value="detect" 
                className="data-[state=active]:bg-violet-600/30 data-[state=active]:text-white text-violet-200 h-12"
                onClick={() => setActiveTab("detect")}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Detect Disease
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="data-[state=active]:bg-violet-600/30 data-[state=active]:text-white text-violet-200 h-12"
                disabled={!currentDiseaseInfo}
                onClick={() => setActiveTab("chat")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Treatment Assistant
                {currentDiseaseInfo && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2 w-2 h-2 rounded-full bg-green-500"
                  />
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="detect" className="space-y-8 mt-6">
              <motion.div
                variants={itemVariants}
                className="glass-panel p-6 rounded-lg max-w-xl mx-auto bg-black/30 backdrop-blur-md border border-violet-500/10"
              >
                <h2 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-300" />
                  <span>Upload Plant Image</span>
                </h2>
                <ImageUpload onImageSelect={handleImageSelect} />
              </motion.div>
              
              {(analyzing || results.length > 0) && (
                <AnimatedResults diseases={results} isLoading={analyzing} />
              )}
            </TabsContent>
            
            <TabsContent value="chat" className="mt-6">
              <PlantChat diseaseInfo={currentDiseaseInfo} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
