
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle, Activity } from "lucide-react";
import { DiseaseDetail } from "./DiseaseDetail";
import { AnimatedDetection } from "./AnimatedDetection";
import { GANDemo } from "./GANDemo";

interface AnimatedResultsProps {
  diseases: any[];
  isLoading: boolean;
}

export const AnimatedResults = ({ diseases, isLoading }: AnimatedResultsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-1 md:col-span-3"
            >
              <motion.div 
                className="rounded-lg p-6 bg-black/30 backdrop-blur-md border border-violet-500/20 text-center"
                animate={{ 
                  boxShadow: [
                    "0 0 0 rgba(139, 92, 246, 0.4)",
                    "0 0 20px rgba(139, 92, 246, 0.4)",
                    "0 0 0 rgba(139, 92, 246, 0.4)"
                  ]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      },
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }
                    }}
                    className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center"
                  >
                    <Activity className="h-8 w-8 text-violet-300" />
                  </motion.div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">Analyzing Plant Health</h3>
                <p className="text-violet-200">Our AI is examining your plant for diseases...</p>
                
                <motion.div 
                  className="h-1 bg-violet-500/50 mt-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <>
              <motion.div 
                className="col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatedDetection 
                  isDetected={diseases.length > 0}
                  diseaseCount={diseases.length}
                />
                
                {/* Add GAN Demo Component */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mt-4"
                >
                  <GANDemo />
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="col-span-1 md:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="space-y-4">
                  {diseases.length > 0 ? (
                    diseases.map((disease, index) => (
                      <DiseaseDetail key={index} disease={disease} />
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="rounded-lg p-6 bg-green-500/10 backdrop-blur-md border border-green-500/20 text-center"
                    >
                      <div className="flex justify-center mb-3">
                        <motion.div
                          animate={{
                            y: [0, -5, 0],
                            rotateZ: [0, 5, 0, -5, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        >
                          <Sparkles className="h-8 w-8 text-green-300" />
                        </motion.div>
                      </div>
                      <h3 className="text-xl font-bold text-green-100 mb-2">No Issues Detected</h3>
                      <p className="text-green-200">Your plant appears to be healthy! Continue with good care practices.</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      
      {!isLoading && diseases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="rounded-lg p-4 bg-orange-500/10 border border-orange-500/20"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5 text-orange-300" />
            </div>
            <div>
              <h4 className="font-semibold text-orange-200 mb-1">Attention Required</h4>
              <p className="text-sm text-orange-100/80">
                The analysis has detected issues that need your attention. Please check the chat tab for treatment advice
                and care recommendations specific to your plant's condition.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
