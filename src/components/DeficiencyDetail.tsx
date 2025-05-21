
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, Info, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DeficiencyDetailProps {
  deficiency: {
    name: string;
    probability: number;
    description?: string;
    sources?: string[];
    symptoms?: string[];
  };
}

export const DeficiencyDetail = ({ deficiency }: DeficiencyDetailProps) => {
  const [showMore, setShowMore] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border border-blue-500/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-black/40 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center"
              >
                <Pill className="h-5 w-5 text-blue-400" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold">{deficiency.name}</h3>
                <div className="flex items-center mt-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      deficiency.probability > 0.9
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : deficiency.probability > 0.7
                        ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    )}
                  >
                    {Math.round(deficiency.probability * 100)}% Match
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">Severity</div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                    className={cn(
                      "w-2 h-6 rounded-sm",
                      i < Math.ceil(deficiency.probability * 5)
                        ? deficiency.probability > 0.8
                          ? "bg-red-500"
                          : deficiency.probability > 0.6
                          ? "bg-orange-400"
                          : "bg-yellow-400"
                        : "bg-gray-600/30"
                    )}
                  ></motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-xs flex justify-between mb-1">
              <span>Confidence</span>
              <span>{Math.round(deficiency.probability * 100)}%</span>
            </div>
            <Progress
              value={deficiency.probability * 100}
              className="h-1"
              style={{
                "--progress-background":
                  deficiency.probability > 0.8
                    ? "rgba(239, 68, 68, 0.7)"
                    : deficiency.probability > 0.6
                    ? "rgba(249, 115, 22, 0.7)"
                    : "rgba(234, 179, 8, 0.7)",
              } as React.CSSProperties}
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-5">
          <div className="space-y-4">
            {deficiency.description && (
              <div>
                <p className="text-sm text-muted-foreground leading-relaxed">{deficiency.description}</p>
              </div>
            )}
            
            {showMore && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {deficiency.symptoms && (
                  <div className="bg-black/20 p-3 rounded-md border border-blue-500/10">
                    <h4 className="text-sm font-medium text-blue-300 mb-2 flex items-center gap-1">
                      <Activity className="h-3 w-3" /> Common Symptoms
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {deficiency.symptoms.map((symptom, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {deficiency.sources && (
                  <div className="bg-black/20 p-3 rounded-md border border-blue-500/10">
                    <h4 className="text-sm font-medium text-green-300 mb-2 flex items-center gap-1">
                      <Info className="h-3 w-3" /> Dietary Sources
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {deficiency.sources.map((source, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                          {source}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="text-xs w-full mt-2"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show less" : "Show more details"}
              <ArrowRight className={`ml-1 h-3 w-3 transition-transform ${showMore ? "rotate-90" : ""}`} />
            </Button>
            
            <div className="text-xs text-center text-blue-200 mt-1">
              Chat with our nutritionist for personalized advice
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
