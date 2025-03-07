
import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedDetectionProps {
  isDetected: boolean;
  diseaseCount: number;
  className?: string;
}

export const AnimatedDetection = ({ isDetected, diseaseCount, className }: AnimatedDetectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={cn("relative p-4 rounded-lg bg-black/30 backdrop-blur-md border border-violet-500/20", className)}
    >
      <div className="absolute -top-3 -left-3">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0) 70%)"
          }}
        >
          {isDetected ? (
            <AlertTriangle className="h-5 w-5 text-red-400" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-400" />
          )}
        </motion.div>
      </div>

      <motion.div
        className="text-center py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-2">
          {isDetected ? "Disease Detected" : "No Disease Detected"}
        </h3>
        
        <div className="relative inline-block">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <p className="text-3xl font-bold text-center relative z-10">
              {diseaseCount}
              <span className="text-base ml-1 opacity-70">
                {diseaseCount === 1 ? "issue" : "issues"}
              </span>
            </p>
          </motion.div>
          
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: isDetected
                ? ["0 0 0px rgba(239, 68, 68, 0.5)", "0 0 20px rgba(239, 68, 68, 0.5)", "0 0 0px rgba(239, 68, 68, 0.5)"]
                : ["0 0 0px rgba(74, 222, 128, 0.5)", "0 0 20px rgba(74, 222, 128, 0.5)", "0 0 0px rgba(74, 222, 128, 0.5)"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
        
        <p className="text-sm mt-2 opacity-80">
          {isDetected 
            ? "We've identified potential plant health issues." 
            : "Your plant appears to be healthy!"}
        </p>
      </motion.div>

      <div className="absolute -bottom-2 -right-2">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        >
          <Sparkles className="h-4 w-4 text-violet-300" />
        </motion.div>
      </div>
    </motion.div>
  );
};
