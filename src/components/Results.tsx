
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, AlertTriangle, Info, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Deficiency {
  name: string;
  probability: number;
  description?: string;
}

interface ResultsProps {
  deficiencies: Deficiency[];
  isLoading?: boolean;
}

export const Results = ({ deficiencies, isLoading }: ResultsProps) => {
  const [progressValues, setProgressValues] = useState<number[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (deficiencies.length > 0 && !isLoading) {
      // Start with zero values and animate to the actual values
      setProgressValues(Array(deficiencies.length).fill(0));
      
      // Show alert when deficiency is detected
      setShowAlert(true);
      
      // Animate progress bars
      const timer = setTimeout(() => {
        setProgressValues(deficiencies.map((d) => Math.round(d.probability * 100)));
      }, 300);
      
      // Hide alert after 5 seconds
      const alertTimer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(alertTimer);
      };
    }
  }, [deficiencies, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <Card className="p-6 border border-violet-500/20 bg-card/50 backdrop-blur-sm animate-pulse">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted/70"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted/70 rounded w-3/4"></div>
                <div className="h-4 bg-muted/70 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted/70 rounded w-5/6"></div>
              <div className="h-4 bg-muted/70 rounded w-full"></div>
              <div className="h-4 bg-muted/70 rounded w-4/5"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (deficiencies.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <Card className="p-6 border border-green-500/20 bg-card/50 backdrop-blur-sm animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Info className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No Deficiencies Detected</h3>
              <p className="text-sm text-muted-foreground">
                Your nutrient levels appear normal, or the symptoms weren't specific enough for a confident assessment.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {showAlert && (
        <Alert 
          variant="highlight" 
          className="mb-4 border-orange-500/30 animate-fade-in" 
          style={{ animationDuration: "0.5s" }}
        >
          <AlertTriangle className="h-5 w-5 text-orange-400 mr-2" />
          <AlertDescription className="flex items-center">
            <span className="text-orange-200 font-medium">Deficiency Alert: </span>
            <span className="ml-2">{deficiencies[0].name} detected with {Math.round(deficiencies[0].probability * 100)}% confidence</span>
          </AlertDescription>
        </Alert>
      )}
      
      {deficiencies.map((deficiency, index) => (
        <Card 
          key={index} 
          className="overflow-hidden border border-violet-500/20 hover:border-violet-500/40 transition-all bg-card/50 backdrop-blur-sm animate-fade-in"
          style={{ animationDelay: `${index * 200}ms`, animationDuration: "0.5s" }}
        >
          <CardHeader className="pb-2 pt-4 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse"></div>
                  <Pill className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">{deficiency.name}</h3>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-sm",
                  deficiency.probability > 0.9
                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                    : deficiency.probability > 0.8
                    ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                )}
              >
                {Math.round(deficiency.probability * 100)}% Match
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="mt-3 mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-violet-300">Confidence Level</span>
                <span className="text-sm font-medium text-violet-300">{progressValues[index] || 0}%</span>
              </div>
              <Progress 
                value={progressValues[index]} 
                className="h-2 bg-violet-950"
                style={{
                  "--progress-background": deficiency.probability > 0.9 
                    ? "rgba(239, 68, 68, 0.7)" 
                    : deficiency.probability > 0.8
                    ? "rgba(249, 115, 22, 0.7)" 
                    : "rgba(234, 179, 8, 0.7)",
                  "transition": "all 1.5s ease-out"
                } as React.CSSProperties}
              />
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Severity</p>
                  <p className="text-sm font-medium text-white">
                    {deficiency.probability > 0.9 ? "High" : deficiency.probability > 0.8 ? "Medium" : "Low"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Pill className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Treatment</p>
                  <p className="text-sm font-medium text-white">Available in chat</p>
                </div>
              </div>
            </div>
            
            {deficiency.description && (
              <div className="mt-4 text-muted-foreground space-y-2 bg-black/20 p-3 rounded-md border border-violet-500/10 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <p className="leading-relaxed">{deficiency.description}</p>
                <p className="text-sm font-medium text-violet-400 animate-pulse">Ask our Nutrition Assistant for treatment options</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
