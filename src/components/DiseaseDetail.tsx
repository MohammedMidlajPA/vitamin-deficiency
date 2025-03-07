
import { motion } from "framer-motion";
import { Leaf, Info, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DiseaseDetailProps {
  disease: {
    name: string;
    probability: number;
    description: string;
  };
}

export const DiseaseDetail = ({ disease }: DiseaseDetailProps) => {
  const probabilityPercentage = Math.round(disease.probability * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border border-violet-500/20 bg-black/30 backdrop-blur-md">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full p-2 bg-violet-500/20">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Leaf className="h-5 w-5 text-violet-300" />
              </motion.div>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-white">{disease.name}</h3>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex items-center gap-1"
                >
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-violet-500/30 text-violet-100">
                    {probabilityPercentage}% confidence
                  </span>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="mt-2 flex items-start gap-2">
                  <Info className="h-4 w-4 text-violet-300 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-300">{disease.description || "No detailed description available for this disease."}</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-3 p-2 rounded-md bg-red-500/10 border border-red-500/20"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-300 flex-shrink-0" />
                  <p className="text-xs text-red-200">Requires immediate attention. Chat with our assistant for treatment options.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        <motion.div 
          className="h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
      </Card>
    </motion.div>
  );
};
