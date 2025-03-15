
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Leaf, Microscope, Pill, Shield, ThumbsUp, ThumbsDown, MessageCircle, HelpCircle } from "lucide-react";
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

  // Enhanced biological control methods with detailed descriptions
  const bioControlMethods = [
    {
      name: "Beneficial Microorganisms",
      description: "Introduce Bacillus subtilis, Trichoderma spp., or mycorrhizal fungi to suppress pathogens through competition, antibiosis, or induced plant resistance. Apply as soil drenches or foliar sprays every 2-4 weeks during the growing season.",
      effectiveness: 85
    },
    {
      name: "Predatory Insects",
      description: "Release ladybugs, lacewings, or predatory mites that feed on common plant pests. Most effective when introduced at the first sign of infestation and provided with suitable habitat like companion plants and water sources.",
      effectiveness: 80
    },
    {
      name: "Neem Oil Extract",
      description: "Derived from the neem tree, this botanical insecticide and fungicide disrupts pest growth cycles and prevents fungal spore germination without harming beneficial insects when used correctly. Apply every 7-14 days as a foliar spray.",
      effectiveness: 75
    },
    {
      name: "Compost Tea",
      description: "Liquid extract from mature compost that introduces beneficial microorganisms to plant surfaces and soil. Contains diverse microbial populations that occupy infection sites and compete with pathogens while enhancing plant immunity.",
      effectiveness: 70
    }
  ];

  // Enhanced chemical solutions with detailed descriptions
  const chemicalSolutions = [
    {
      name: "Copper Fungicides",
      description: "Broad-spectrum fungicides that disrupt pathogen metabolism. Most effective as preventative treatments before disease appears or at first symptoms. Apply every 7-14 days depending on disease pressure and rainfall.",
      cautions: "Can accumulate in soil with repeated use. Toxic to aquatic organisms.",
      effectiveness: 90
    },
    {
      name: "Sulfur Compounds",
      description: "Controls powdery mildew and other fungal diseases by inhibiting spore germination. Most effective in temperatures between 65-80°F. Apply at 7-10 day intervals when conditions favor disease development.",
      cautions: "May cause leaf burn in hot weather (above 85°F). Do not apply within 2 weeks of oil sprays.",
      effectiveness: 85
    },
    {
      name: "Potassium Bicarbonate",
      description: "Eco-friendly fungicide that disrupts cell wall function in many fungal pathogens. Provides curative and protective action against powdery mildew and other diseases. Safe for beneficial insects.",
      cautions: "Less persistent than synthetic options; requires more frequent application.",
      effectiveness: 75
    }
  ];

  // Enhanced prevention methods with detailed explanations
  const preventionMethods = [
    {
      name: "Crop Rotation",
      description: "Plant different families of crops in the same area in sequential seasons to break disease cycles. Most pathogens can't survive without a suitable host plant. Implement 3-4 year rotations for maximum effectiveness.",
      importance: "Critical for breaking soil-borne disease cycles"
    },
    {
      name: "Proper Plant Spacing",
      description: "Adequate spacing improves air circulation, reduces humidity around foliage, and accelerates drying after rain or irrigation. Follow specific spacing recommendations for each plant variety.",
      importance: "Prevents conditions that favor fungal and bacterial growth"
    },
    {
      name: "Resistant Varieties",
      description: "Select plant varieties bred for resistance to common diseases in your region. Resistance genes reduce infection rates and limit disease severity even when pathogens are present.",
      importance: "Most sustainable long-term strategy for disease management"
    },
    {
      name: "Sanitation Practices",
      description: "Remove and destroy infected plant debris, sterilize tools between plants, and clean growing areas between seasons. Prevents pathogen survival and transmission.",
      importance: "Eliminates disease reservoirs and reduces initial inoculum"
    },
    {
      name: "Water Management",
      description: "Water at soil level rather than from above to keep foliage dry. Schedule irrigation for morning hours so plants dry quickly. Use drip irrigation or soaker hoses when possible.",
      importance: "Many pathogens require water for dispersal and infection"
    }
  ];

  // FAQ data for common biological control methods
  const bioControlFaqs = [
    {
      question: "What are biological control methods?",
      answer: "Biological control methods use living organisms, natural compounds, or ecological approaches to manage plant diseases and pests. They're environmentally friendly alternatives to chemical treatments that work by introducing natural enemies of plant pathogens, competition for resources, or stimulating the plant's own defense mechanisms."
    },
    {
      question: "When is the best time to apply biological controls?",
      answer: "Most biological controls should be applied preventatively before disease pressure becomes high, or at the very first signs of infection. Early morning or evening application is best, when temperatures are moderate and UV exposure is low. For soil-based biologicals, apply when soil is moist and temperatures are between 55-80°F for optimal microbial establishment."
    },
    {
      question: "How do beneficial nematodes work against plant pests?",
      answer: "Beneficial nematodes are microscopic, non-segmented roundworms that act as parasites to many harmful garden pests. They enter pest insects through natural body openings, release symbiotic bacteria that kill the host, and then feed on the resulting bacterial soup and insect tissues. They're particularly effective against soil-dwelling pests like grubs, weevil larvae, and fungus gnat larvae."
    },
    {
      question: "How do I use compost tea for plant health?",
      answer: "Compost tea is made by steeping finished compost in aerated water for 24-48 hours, creating a liquid rich in beneficial microorganisms. For optimal results, brew with non-chlorinated water, maintain oxygen levels during brewing, and use immediately after preparation. Apply as a soil drench (1 gallon per 50 sq ft) or foliar spray (diluted to light tea color) every 2-4 weeks during the growing season. Most effective when plants are actively growing."
    },
    {
      question: "When should I introduce predatory insects?",
      answer: "Introduce predatory insects at the first sign of pest problems, or preventatively in early growing seasons if you've had recurring issues. For greenhouse crops, introduce predators when plants are established but before pest populations build. Release in early morning or evening when temperatures are cool, after watering plants to provide humidity. Multiple smaller releases are often more effective than a single large release."
    },
    {
      question: "Are biological controls effective for fungal diseases?",
      answer: "Yes, several biological controls target fungal diseases effectively. Bacillus subtilis, Trichoderma species, and Streptomyces microorganisms suppress fungal pathogens through multiple mechanisms: they produce antifungal compounds, directly parasitize fungal pathogens, compete for space and nutrients on plant surfaces, and induce systemic resistance within plants. For best results, apply before disease appears or at first symptoms, and maintain regular applications throughout the growing season."
    },
    {
      question: "How can I improve the effectiveness of biological controls?",
      answer: "Create favorable conditions for biological agents by maintaining proper soil health with adequate organic matter (2-5%), keeping soil consistently moist but not waterlogged, avoiding applications during extreme temperatures, and integrating multiple compatible biological controls for synergistic effects. Most importantly, avoid broad-spectrum chemical pesticides that can harm beneficial organisms, and apply biological controls when pest populations are still at low to moderate levels."
    }
  ];

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
                  value="biological-faq"
                  className="data-[state=active]:bg-violet-800/30 rounded-none border-b-2 border-transparent data-[state=active]:border-violet-400"
                >
                  Bio Controls
                </TabsTrigger>
                <TabsTrigger 
                  value="enhanced"
                  className="data-[state=active]:bg-violet-800/30 rounded-none border-b-2 border-transparent data-[state=active]:border-violet-400"
                >
                  Enhanced
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
                              <div className="space-y-3">
                                {bioControlMethods.slice(0, 3).map((method, index) => (
                                  <div key={index} className="border border-violet-500/20 rounded-md p-3 bg-violet-900/10">
                                    <h5 className="font-medium text-violet-200">{method.name}</h5>
                                    <p className="text-sm text-violet-300/80 mt-1">{method.description}</p>
                                    <div className="mt-2">
                                      <div className="flex justify-between text-xs text-violet-300 mb-1">
                                        <span>Effectiveness</span>
                                        <span>{method.effectiveness}%</span>
                                      </div>
                                      <Progress value={method.effectiveness} className="h-1.5 bg-violet-900/30" />
                                    </div>
                                  </div>
                                ))}
                              </div>
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
                              <div className="space-y-3">
                                {chemicalSolutions.map((solution, index) => (
                                  <div key={index} className="border border-violet-500/20 rounded-md p-3 bg-violet-900/10">
                                    <h5 className="font-medium text-violet-200">{solution.name}</h5>
                                    <p className="text-sm text-violet-300/80 mt-1">{solution.description}</p>
                                    <p className="text-xs text-red-300/80 mt-1 flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" /> {solution.cautions}
                                    </p>
                                    <div className="mt-2">
                                      <div className="flex justify-between text-xs text-violet-300 mb-1">
                                        <span>Effectiveness</span>
                                        <span>{solution.effectiveness}%</span>
                                      </div>
                                      <Progress value={solution.effectiveness} className="h-1.5 bg-violet-900/30" />
                                    </div>
                                  </div>
                                ))}
                              </div>
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
                              <div className="space-y-3">
                                {preventionMethods.map((method, index) => (
                                  <div key={index} className="border border-violet-500/20 rounded-md p-3 bg-violet-900/10">
                                    <div className="flex justify-between">
                                      <h5 className="font-medium text-violet-200">{method.name}</h5>
                                      <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-500/30">
                                        Recommended
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-violet-300/80 mt-1">{method.description}</p>
                                    <p className="text-xs text-green-300/80 mt-1.5 italic">{method.importance}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="biological-faq" className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-10 w-10 rounded-full bg-green-600/20 flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-violet-100">Biological Control Guide</h3>
                  </div>
                  
                  <div className="bg-violet-900/20 rounded-lg border border-violet-500/20 p-4">
                    <p className="text-violet-200 mb-4 text-sm">
                      Biological control methods offer sustainable, eco-friendly approaches to managing plant diseases. 
                      These methods harness natural processes and organisms to suppress pathogens while minimizing environmental impact.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {bioControlMethods.map((method, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="bg-violet-800/20 rounded-lg p-3 border border-violet-500/30"
                        >
                          <h4 className="font-medium text-green-300 mb-1">{method.name}</h4>
                          <p className="text-sm text-violet-200/80 mb-2">{method.description}</p>
                          <div>
                            <div className="flex justify-between text-xs text-violet-300 mb-1">
                              <span>Effectiveness</span>
                              <span>{method.effectiveness}%</span>
                            </div>
                            <Progress 
                              value={method.effectiveness} 
                              className="h-1.5" 
                              indicatorClassName={cn(
                                method.effectiveness > 80 ? "bg-green-500" : 
                                method.effectiveness > 70 ? "bg-green-400" : "bg-green-300"
                              )}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full">
                      {bioControlFaqs.map((faq, index) => (
                        <AccordionItem key={index} value={`faq-${index}`} className="border-violet-500/20">
                          <AccordionTrigger className="text-violet-100 hover:text-violet-200 py-3">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-violet-200/80">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    
                    <div className="mt-4 pt-4 border-t border-violet-500/20">
                      <h4 className="font-medium text-violet-100 mb-2 flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-400" />
                        Application Tips
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-violet-200/80 text-sm">
                        <li>Always apply biological controls during cooler parts of the day (early morning or evening)</li>
                        <li>Follow manufacturer's instructions for application rates and timing</li>
                        <li>Maintain consistent soil moisture to support beneficial microorganisms</li>
                        <li>Combine multiple biological approaches for better disease management</li>
                        <li>Be patient - biological controls often work more slowly than chemical alternatives</li>
                      </ul>
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
