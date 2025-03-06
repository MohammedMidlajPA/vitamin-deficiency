
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Disease {
  name: string;
  probability: number;
  description?: string;
}

interface ResultsProps {
  diseases: Disease[];
  isLoading?: boolean;
}

export const Results = ({ diseases, isLoading }: ResultsProps) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <Card className="p-6 border border-violet-500/20 bg-card/50 backdrop-blur-sm">
          <div className="space-y-4 animate-pulse">
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

  if (diseases.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <Card className="p-6 border border-yellow-500/20 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No Diseases Detected</h3>
              <p className="text-sm text-muted-foreground">
                Your plant appears healthy, or the image wasn't clear enough for a confident diagnosis.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {diseases.map((disease, index) => (
        <Card 
          key={index} 
          className="overflow-hidden border border-violet-500/20 hover:border-violet-500/40 transition-all bg-card/50 backdrop-blur-sm"
        >
          <CardHeader className="pb-2 pt-4 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold">{disease.name}</h3>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-sm",
                  disease.probability > 0.9
                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                    : disease.probability > 0.8
                    ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                )}
              >
                {Math.round(disease.probability * 100)}% Match
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {disease.description && (
              <div className="mt-2 text-muted-foreground space-y-2">
                <p className="leading-relaxed">{disease.description}</p>
                <p className="text-sm font-medium text-violet-400">Ask our Plant Assistant for treatment options</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
