
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        <Card className="p-6">
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {diseases.map((disease, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{disease.name}</h3>
              <Badge
                variant="outline"
                className={cn(
                  "text-sm",
                  disease.probability > 0.7
                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                    : disease.probability > 0.4
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    : "bg-green-500/10 text-green-500 border-green-500/20"
                )}
              >
                {Math.round(disease.probability * 100)}% Match
              </Badge>
            </div>
            {disease.description && (
              <p className="text-sm text-muted-foreground">
                {disease.description}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
