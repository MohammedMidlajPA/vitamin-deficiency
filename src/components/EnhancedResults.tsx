
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Leaf, Microscope, Pill, Shield, ThumbsUp, ThumbsDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { PlantService } from "@/services/PlantService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EnhancedResultsProps {
  diseaseInfo: any;
  isLoading: boolean;
  imageUrl?: string;
}

export const EnhancedResults = ({ diseaseInfo, isLoading, imageUrl }: EnhancedResultsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [enhancedInfo, setEnhancedInfo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const { toast } = useToast();
  const GEMINI_API_KEY = "AIzaSyDWbkSlDbTObn50YlpYcNooLuRP0SVkRCE";

  useEffect(() => {
    // Reset state when new disease info is loaded
    setEnhancedInfo(null);
    setFeedbackGiven(false);
  }, [diseaseInfo]);

  const handleGenerateEnhanced = async () => {
    if (!diseaseInfo) return;
    
    setIsGenerating(true);
    try {
      const info = await PlantService.getEnhancedPlantInfo(diseaseInfo, GEMINI_API_KEY);
      setEnhancedInfo(info);
      toast({
        title: "Enhanced Information Generated",
        description: "AI has created a detailed disease guide for you.",
      });
    } catch (error) {
      console.error("Error generating enhanced info:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate enhanced information.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFeedback = (positive: boolean) => {
    setFeedbackGiven(true);
    toast({
      title: positive ? "Feedback Received" : "Feedback Received",
      description: positive 
        ? "Thanks for the positive feedback! This helps improve our system." 
        : "We're sorry the information wasn't helpful. We'll improve our recommendations.",
      variant: positive ? "default" : "destructive",
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-4 backdrop-blur-md bg-black/30 border border-violet-500/20">
        <CardHeader>
          <CardTitle className="text-center text-violet-100">
            <motion.div
              className="flex items-center justify-center gap-2"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Microscope className="h-5 w-5 text-violet-400" />
              <span>Analyzing Plant Sample</span>
            </motion.div>
          </CardTitle>
          <CardDescription className="text-center text-violet-200/70">
            Our AI is examining your plant image for diseases...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-violet-300 mb-1">
              <span>Analyzing leaf patterns</span>
              <span>Step 2/5</span>
            </div>
            <Progress value={45} className="h-2 bg-violet-900/30" />
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-16 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: i * 0.2,
                }}
              >
                <Leaf className="h-6 w-6 text-violet-300/50" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!diseaseInfo) {
    return null;
  }

  const renderMarkdown = (text: string) => {
    // Very basic markdown-to-jsx conversion
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('# ', '')}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={i} className="text-lg font-semibold mt-3 mb-2">{line.replace('## ', '')}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={i} className="text-md font-semibold mt-3 mb-1">{line.replace('### ', '')}</h3>;
        } else if (line.startsWith('- ')) {
          return <li key={i} className="ml-4 mt-1 flex items-start"><span className="mr-2 mt-1">•</span> {line.replace('- ', '')}</li>;
        } else if (line.startsWith('1. ')) {
          return <li key={i} className="ml-4 mt-1 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
        } else if (line.trim() === '') {
          return <div key={i} className="h-2"></div>;
        } else {
          return <p key={i} className="my-2">{line}</p>;
        }
      });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-3xl mx-auto mt-6"
      >
        <Card className="border border-violet-500/20 bg-black/40 backdrop-blur-md text-white shadow-lg hover:shadow-violet-500/10 transition-all overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-violet-900/50 to-indigo-900/50 pb-4 border-b border-violet-500/20">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2 text-violet-100 mb-1">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, repeatType: "reverse" }}
                  >
                    <Leaf className="h-5 w-5 text-green-400" />
                  </motion.div>
                  <span>{diseaseInfo.name}</span>
                  
                  <Badge className="ml-2 bg-violet-600/70">
                    {(diseaseInfo.probability * 100).toFixed(0)}% Confidence
                  </Badge>
                </CardTitle>
                <CardDescription className="text-violet-200">
                  Detected plant disease analysis
                </CardDescription>
              </div>
              
              {diseaseInfo.probability > 0.9 ? (
                <Badge className="bg-red-500">High Risk</Badge>
              ) : diseaseInfo.probability > 0.7 ? (
                <Badge className="bg-yellow-500/80">Medium Risk</Badge>
              ) : (
                <Badge className="bg-blue-500/80">Low Risk</Badge>
              )}
            </div>
          </CardHeader>
          
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 bg-black/40 border-b border-violet-500/10">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-violet-800/30 rounded-none border-b-2 border-transparent data-[state=active]:border-violet-400"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="enhanced"
                  className="data-[state=active]:bg-violet-800/30 rounded-none border-b-2 border-transparent data-[state=active]:border-violet-400"
                >
                  Enhanced Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="visual" 
                  className="data-[state=active]:bg-violet-800/30 rounded-none border-b-2 border-transparent data-[state=active]:border-violet-400"
                  disabled={!imageUrl}
                >
                  Visual
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-violet-200 mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        Disease Information
                      </h3>
                      <p className="text-sm text-violet-100/80 mb-4">
                        {diseaseInfo.description}
                      </p>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-violet-200 mb-2 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-400" />
                          Risk Assessment
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-xs text-violet-300 mb-1">
                              <span>Severity</span>
                              <span>{diseaseInfo.probability > 0.8 ? 'High' : 'Medium'}</span>
                            </div>
                            <Progress value={diseaseInfo.probability * 100} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-violet-200 mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4 text-green-400" />
                        Treatment Recommendations
                      </h3>
                      
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="biological" className="border-violet-500/20">
                          <AccordionTrigger className="text-violet-100 hover:text-violet-200">
                            Biological Controls
                          </AccordionTrigger>
                          <AccordionContent className="text-violet-200/70">
                            {diseaseInfo.treatment?.biological ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {diseaseInfo.treatment.biological.map((item: string, i: number) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p>No specific biological treatments available.</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="chemical" className="border-violet-500/20">
                          <AccordionTrigger className="text-violet-100 hover:text-violet-200">
                            Chemical Solutions
                          </AccordionTrigger>
                          <AccordionContent className="text-violet-200/70">
                            {diseaseInfo.treatment?.chemical ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {diseaseInfo.treatment.chemical.map((item: string, i: number) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p>No specific chemical treatments available.</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="prevention" className="border-violet-500/20">
                          <AccordionTrigger className="text-violet-100 hover:text-violet-200">
                            Prevention Methods
                          </AccordionTrigger>
                          <AccordionContent className="text-violet-200/70">
                            {diseaseInfo.treatment?.prevention ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {diseaseInfo.treatment.prevention.map((item: string, i: number) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p>No specific prevention methods available.</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="enhanced" className="p-6">
                {enhancedInfo ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-violet-900/20 p-4 border border-violet-500/30">
                      <div className="prose prose-invert max-w-none text-violet-100/90">
                        {renderMarkdown(enhancedInfo)}
                      </div>
                      
                      {!feedbackGiven && (
                        <div className="mt-6 flex justify-center gap-4">
                          <p className="text-sm text-violet-300 mr-2">Was this information helpful?</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-transparent border-green-500/30 hover:bg-green-500/20 text-green-400"
                            onClick={() => handleFeedback(true)}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" /> Yes
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-transparent border-red-500/30 hover:bg-red-500/20 text-red-400"
                            onClick={() => handleFeedback(false)}
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" /> No
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-center mb-6 space-y-2">
                      <h3 className="text-lg font-semibold text-violet-100">Get AI-Enhanced Analysis</h3>
                      <p className="text-sm text-violet-200/70 max-w-md">
                        Our AI can generate a comprehensive guide for treating and managing this plant disease.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleGenerateEnhanced} 
                      disabled={isGenerating}
                      className={cn(
                        "bg-violet-700 hover:bg-violet-600 text-white",
                        isGenerating && "opacity-80"
                      )}
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <Leaf className="h-4 w-4" />
                          </motion.div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Leaf className="mr-2 h-4 w-4" />
                          Generate Enhanced Analysis
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="visual" className="p-6">
                {imageUrl && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-violet-200 mb-3">Your Plant Sample</h3>
                        <div className="rounded-lg overflow-hidden border border-violet-500/30">
                          <img 
                            src={imageUrl} 
                            alt="Plant sample" 
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-violet-200 mb-3">Detection Analysis</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-violet-900/20 rounded-lg">
                            <span className="text-violet-200">Disease Confidence</span>
                            <Badge className="bg-violet-600">
                              {(diseaseInfo.probability * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          
                          <div className="p-4 bg-violet-900/20 rounded-lg">
                            <h4 className="font-medium text-violet-100 mb-2">Visual Symptoms</h4>
                            <p className="text-sm text-violet-200/70">
                              The image shows characteristics consistent with {diseaseInfo.name}.
                              {diseaseInfo.probability > 0.9 
                                ? ' The visual indicators are very distinct and clear.'
                                : diseaseInfo.probability > 0.7 
                                  ? ' Some key visual indicators are present.'
                                  : ' A few indicators suggest this disease may be present.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <CardFooter className="justify-between border-t border-violet-500/20 py-4 bg-black/20">
            <div className="flex items-center text-xs text-violet-300">
              <CheckCircle2 className="h-3 w-3 mr-1 text-green-400" />
              AI-powered analysis
            </div>
            <Button variant="link" className="text-violet-300 hover:text-violet-100">
              Learn more about plant diseases
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
