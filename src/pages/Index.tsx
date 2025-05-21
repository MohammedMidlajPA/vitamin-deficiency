import { useState, useEffect } from "react";
import { VitaminChat } from "@/components/VitaminChat";
import { AnimatedResultsVitamin } from "@/components/AnimatedResultsVitamin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Pill, Sparkles, User, MessageSquare, AlertTriangle, Info } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Sample vitamin deficiency data
const vitaminDeficiencies = {
  "vitamin_b12": {
    name: "Vitamin B12 Deficiency",
    probability: 0.92,
    description: "Vitamin B12 is crucial for nerve function, DNA production, and red blood cell formation. Deficiency can lead to anemia, neurological issues, and fatigue.",
    sources: ["Meat", "Fish", "Dairy", "Eggs", "Fortified cereals"],
    symptoms: ["Fatigue", "Weakness", "Pale skin", "Tingling in hands/feet", "Memory problems"],
    report: "Your symptoms strongly indicate a Vitamin B12 deficiency, which is common among individuals with your dietary pattern. The reported fatigue, tingling sensations, and memory issues are classic signs. We recommend increasing B12-rich foods in your diet or considering a high-quality B12 supplement (1000-2000 mcg daily). Consider getting a blood test to confirm levels before starting supplementation."
  },
  "vitamin_d": {
    name: "Vitamin D Deficiency",
    probability: 0.85,
    description: "Vitamin D is essential for calcium absorption and bone health. It also plays a role in immune function and mood regulation.",
    sources: ["Sunlight exposure", "Fatty fish", "Fortified milk", "Egg yolks", "Mushrooms"],
    symptoms: ["Bone pain", "Muscle weakness", "Depression", "Hair loss", "Impaired wound healing"],
    report: "Based on your reported symptoms of bone pain, muscle weakness, and low energy levels, you may have a Vitamin D deficiency. This is particularly common in individuals with limited sun exposure or those living in northern climates. Consider taking a Vitamin D3 supplement (2000-5000 IU daily) and increasing your consumption of vitamin D-rich foods. A blood test can determine your exact levels."
  },
  "iron": {
    name: "Iron Deficiency",
    probability: 0.78,
    description: "Iron is necessary for hemoglobin production, which carries oxygen throughout the body. Low iron can lead to anemia and reduced energy levels.",
    sources: ["Red meat", "Beans", "Lentils", "Spinach", "Fortified cereals"],
    symptoms: ["Extreme fatigue", "Pale skin", "Shortness of breath", "Headaches", "Dizziness"],
    report: "Your symptom profile suggests an iron deficiency, which is affecting your oxygen delivery system and energy levels. The combination of fatigue, pale skin, and breathlessness is characteristic of iron deficiency anemia. Consider taking an iron supplement (with vitamin C to enhance absorption) and increasing iron-rich foods in your diet. Avoid consuming iron supplements with calcium or coffee, as these can inhibit absorption."
  },
  "vitamin_c": {
    name: "Vitamin C Deficiency",
    probability: 0.65,
    description: "Vitamin C is an antioxidant that supports immune function, collagen production, and iron absorption from plant-based foods.",
    sources: ["Citrus fruits", "Bell peppers", "Strawberries", "Broccoli", "Kiwi"],
    symptoms: ["Rough skin", "Easy bruising", "Slow wound healing", "Bleeding gums", "Joint pain"],
    report: "Your symptoms indicate a possible Vitamin C deficiency. The combination of easy bruising, slow healing wounds, and gum issues suggests inadequate collagen production, which relies on Vitamin C. To address this, increase your daily intake of Vitamin C-rich foods like citrus fruits, bell peppers, and berries. A supplement of 500-1000mg daily may help resolve symptoms faster. Your body cannot store Vitamin C, so consistent daily intake is important."
  }
};

// Background images
const BackgroundImages = [
  "/images/plant-bg-1.jpg",
  "/images/plant-bg-2.jpg",
];

const Index = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("assess");
  const [currentDeficiencyInfo, setCurrentDeficiencyInfo] = useState<any>(null);
  const { toast } = useToast();
  const [assessmentCount, setAssessmentCount] = useState(0);
  const [symptoms, setSymptoms] = useState<Record<string, boolean>>({
    fatigue: false,
    paleSkin: false,
    tingling: false,
    memoryIssues: false,
    breathlessness: false,
    hairLoss: false,
    bonePain: false,
    musclePain: false,
    bruising: false,
    dizziness: false,
  });
  const [energyLevel, setEnergyLevel] = useState<string>("medium");
  const [dietType, setDietType] = useState<string>("mixed");
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (results.length > 0) {
      setCurrentDeficiencyInfo(results[0]);
      setActiveTab("chat");
    } else {
      setCurrentDeficiencyInfo(null);
    }
  }, [results]);

  const analyzeSymptoms = () => {
    setAnalyzing(true);
    
    // Simulate API delay
    setTimeout(() => {
      let detectedDeficiencies: any[] = [];
      
      // Simple algorithm to detect potential deficiencies based on symptoms
      const symptomCount = Object.values(symptoms).filter(Boolean).length;
      
      if (symptomCount === 0) {
        toast({
          title: "No Symptoms Selected",
          description: "Please select at least one symptom to analyze.",
          variant: "destructive",
        });
        setAnalyzing(false);
        return;
      }
      
      if (symptoms.fatigue && symptoms.paleSkin && symptoms.breathlessness) {
        // Iron deficiency signs
        detectedDeficiencies.push(vitaminDeficiencies.iron);
      }
      
      if (symptoms.tingling && symptoms.memoryIssues && symptoms.fatigue && dietType === "vegan") {
        // B12 deficiency common in vegans
        detectedDeficiencies.push(vitaminDeficiencies.vitamin_b12);
      }
      
      if (symptoms.bonePain && symptoms.musclePain && energyLevel === "low") {
        // Vitamin D deficiency signs
        detectedDeficiencies.push(vitaminDeficiencies.vitamin_d);
      }
      
      if (symptoms.bruising && symptoms.dizziness) {
        // Potential vitamin C deficiency
        detectedDeficiencies.push(vitaminDeficiencies.vitamin_c);
      }
      
      // If no specific pattern but many symptoms, suggest general deficiencies
      if (detectedDeficiencies.length === 0 && symptomCount > 3) {
        // Add general deficiencies based on diet and energy
        if (dietType === "vegan" || dietType === "vegetarian") {
          detectedDeficiencies.push(vitaminDeficiencies.vitamin_b12);
        }
        if (energyLevel === "low") {
          detectedDeficiencies.push(vitaminDeficiencies.iron);
        }
      }
      
      setResults(detectedDeficiencies);
      setAssessmentCount(prev => prev + 1);
      
      if (detectedDeficiencies.length > 0) {
        toast({
          title: "Potential Deficiency Detected",
          description: `We've identified potential ${detectedDeficiencies[0].name} with ${(detectedDeficiencies[0].probability * 100).toFixed(0)}% confidence. View the analysis for details.`,
          variant: "default",
        });
        setShowReport(true);
      } else {
        toast({
          title: "Assessment Complete",
          description: "Good news! No high-confidence vitamin deficiencies detected based on your symptoms.",
          variant: "default",
        });
      }
      
      setAnalyzing(false);
    }, 2500);
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setSymptoms(prev => ({
      ...prev,
      [symptom]: checked
    }));
  };

  const resetAssessment = () => {
    setSymptoms({
      fatigue: false,
      paleSkin: false,
      tingling: false,
      memoryIssues: false,
      breathlessness: false,
      hairLoss: false,
      bonePain: false,
      musclePain: false,
      bruising: false,
      dizziness: false,
    });
    setEnergyLevel("medium");
    setDietType("mixed");
    setShowReport(false);
  };

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

  const bgVariants = {
    initial: { scale: 1, opacity: 0.2 },
    animate: { 
      scale: 1.05, 
      opacity: 0.3,
      transition: { 
        duration: 20, 
        repeat: Infinity, 
        repeatType: "reverse" as const
      } 
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-blue-900/95 to-purple-900/95" />
        <div className="absolute inset-0 bg-grid opacity-5" />
        
        {BackgroundImages.map((img, index) => (
          <motion.div 
            key={index}
            initial="initial"
            animate="animate"
            variants={bgVariants}
            className="absolute inset-0 bg-no-repeat bg-cover mix-blend-overlay"
            style={{ 
              backgroundImage: `url(${img})`,
              filter: "saturate(0.8) hue-rotate(210deg)",
              transformOrigin: index === 0 ? "center" : "bottom right"
            }}
          />
        ))}
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-blue-300/10"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0.1 + Math.random() * 0.2,
                scale: 0.1 + Math.random()
              }}
              animate={{ 
                y: [null, "-100vh"],
                opacity: [null, 0],
              }}
              transition={{ 
                duration: 10 + Math.random() * 20, 
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      <header className="relative z-10 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div 
                className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center"
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
                <Pill className="h-5 w-5 text-white" />
              </motion.div>
              <span className="text-xl font-semibold text-white">Vitamin <span className="text-blue-300">AI</span></span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                className="text-white border-white/20 hover:bg-white/10 transition-all duration-300"
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
                className="absolute -inset-4 rounded-full bg-blue-500/10 blur-md"
              />
              <motion.div
                className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center"
                animate={{
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Sparkles className="h-7 w-7 text-white" />
              </motion.div>
            </div>
          </div>
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-300 to-indigo-100"
          >
            Vitamin Deficiency Detection
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-blue-100 max-w-2xl mx-auto"
          >
            Complete a symptom assessment to identify potential vitamin deficiencies and get personalized nutrition advice.
          </motion.p>
        </motion.div>

        {assessmentCount > 0 && (
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(59, 130, 246, 0.3)" }}
              className="flex bg-black/20 backdrop-blur-sm border border-blue-500/10 rounded-lg p-4 items-center gap-4 transition-all"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <User className="h-5 w-5 text-white" />
                </motion.div>
              </div>
              <div>
                <p className="text-sm text-blue-200">Assessments Completed</p>
                <p className="text-2xl font-semibold text-white">{assessmentCount}</p>
              </div>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(59, 130, 246, 0.3)" }}
              className="flex bg-black/20 backdrop-blur-sm border border-blue-500/10 rounded-lg p-4 items-center gap-4 transition-all"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.2 }}
                >
                  <AlertTriangle className="h-5 w-5 text-white" />
                </motion.div>
              </div>
              <div>
                <p className="text-sm text-blue-200">Deficiencies Detected</p>
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
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(59, 130, 246, 0.3)" }}
              className="flex bg-black/20 backdrop-blur-sm border border-blue-500/10 rounded-lg p-4 items-center gap-4 transition-all"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.4 }}
                >
                  <Info className="h-5 w-5 text-white" />
                </motion.div>
              </div>
              <div>
                <p className="text-sm text-blue-200">Health Status</p>
                <p className="text-2xl font-semibold text-white">
                  {results.length > 0 ? "Needs Attention" : assessmentCount > 0 ? "Healthy" : "Unknown"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="max-w-4xl mx-auto"
            defaultValue="assess"
          >
            <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-md border border-blue-500/10">
              <TabsTrigger 
                value="assess" 
                className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-white text-blue-200 h-12"
              >
                <User className="mr-2 h-4 w-4" />
                Symptom Assessment
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="data-[state=active]:bg-blue-600/30 data-[state=active]:text-white text-blue-200 h-12"
                disabled={!currentDeficiencyInfo}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Nutrition Assistant
                {currentDeficiencyInfo && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2 w-2 h-2 rounded-full bg-green-500"
                  />
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assess" className="space-y-8 mt-6">
              <motion.div
                variants={itemVariants}
                className="glass-panel p-6 rounded-lg max-w-xl mx-auto bg-black/30 backdrop-blur-md border border-blue-500/10"
              >
                <h2 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-300" />
                  <span>Symptom Assessment</span>
                </h2>
                
                <Card className="bg-black/40 border-blue-500/20 p-5">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Select your symptoms:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { id: "fatigue", label: "Fatigue & Weakness" },
                          { id: "paleSkin", label: "Pale Skin" },
                          { id: "tingling", label: "Tingling in Extremities" },
                          { id: "memoryIssues", label: "Memory Problems" },
                          { id: "breathlessness", label: "Shortness of Breath" },
                          { id: "hairLoss", label: "Hair Loss" },
                          { id: "bonePain", label: "Bone/Joint Pain" },
                          { id: "musclePain", label: "Muscle Pain/Cramps" },
                          { id: "bruising", label: "Easy Bruising" },
                          { id: "dizziness", label: "Dizziness/Headaches" },
                        ].map(symptom => (
                          <div key={symptom.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={symptom.id} 
                              checked={symptoms[symptom.id as keyof typeof symptoms]}
                              onCheckedChange={(checked) => handleSymptomChange(symptom.id, checked === true)}
                              className="border-blue-500/50"
                            />
                            <Label htmlFor={symptom.id} className="text-sm">{symptom.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium mb-2">Energy Level:</h3>
                      <RadioGroup defaultValue="medium" value={energyLevel} onValueChange={setEnergyLevel}>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="low" id="energy-low" />
                            <Label htmlFor="energy-low">Low</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="energy-medium" />
                            <Label htmlFor="energy-medium">Medium</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="high" id="energy-high" />
                            <Label htmlFor="energy-high">High</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-medium mb-2">Diet Type:</h3>
                      <RadioGroup defaultValue="mixed" value={dietType} onValueChange={setDietType}>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mixed" id="diet-mixed" />
                            <Label htmlFor="diet-mixed">Mixed</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="vegetarian" id="diet-vegetarian" />
                            <Label htmlFor="diet-vegetarian">Vegetarian</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="vegan" id="diet-vegan" />
                            <Label htmlFor="diet-vegan">Vegan</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={analyzing}
                        onClick={analyzeSymptoms}
                      >
                        {analyzing ? (
                          <>
                            <span className="animate-pulse mr-2">Analyzing...</span>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                            />
                          </>
                        ) : "Analyze Symptoms"}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-blue-500/20 hover:bg-blue-500/10"
                        onClick={resetAssessment}
                        disabled={analyzing}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
              
              {(analyzing || results.length > 0) && (
                <AnimatedResultsVitamin 
                  deficiencies={results} 
                  isLoading={analyzing} 
                />
              )}

              {showReport && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="max-w-4xl mx-auto"
                >
                  <Card className="bg-black/30 backdrop-blur-md border border-blue-500/20 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-blue-500/20 pb-3">
                        <Info className="h-5 w-5 text-blue-300" />
                        <h2 className="text-xl font-semibold text-white">Deficiency Report</h2>
                      </div>
                      
                      {results.map((deficiency, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-blue-200">{deficiency.name}</h3>
                            <Badge className="bg-blue-600">{(deficiency.probability * 100).toFixed(0)}% Match</Badge>
                          </div>
                          
                          <p className="text-white text-sm leading-relaxed">{deficiency.report}</p>
                          
                          <div className="pt-2">
                            <h4 className="text-sm font-medium text-blue-300 mb-1">Recommended Food Sources:</h4>
                            <div className="flex flex-wrap gap-2">
                              {deficiency.sources.map((source: string, i: number) => (
                                <Badge key={i} variant="outline" className="bg-blue-900/20 border-blue-500/30">
                                  {source}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            className="mt-2 bg-blue-600 hover:bg-blue-700"
                            onClick={() => setActiveTab("chat")}
                          >
                            Discuss with Nutrition Assistant
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="chat" className="mt-6">
              <VitaminChat deficiencyInfo={currentDeficiencyInfo} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
