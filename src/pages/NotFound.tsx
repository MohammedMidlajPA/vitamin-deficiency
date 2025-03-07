
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-purple-900/90 to-violet-900/90">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-10" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative"
        >
          <div className="absolute -inset-4 rounded-full bg-violet-500/10 blur-md" />
          <div className="relative flex items-center justify-center w-24 h-24 bg-violet-500/20 border border-violet-500/30 rounded-full overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10"
            />
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
            >
              <AlertCircle className="h-10 w-10 text-violet-300" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl font-bold mb-2 text-white"
        >
          404
        </motion.h1>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4 max-w-md"
        >
          <h2 className="text-2xl font-medium text-violet-200">Page Not Found</h2>
          <p className="text-violet-300/80">
            The path <span className="text-violet-200 font-mono px-1.5 py-0.5 bg-violet-900/50 rounded">{location.pathname}</span> does not exist in our garden.
          </p>
          
          <div className="h-px w-16 bg-violet-500/30 mx-auto my-6" />
          
          <p className="text-violet-300/70">
            Would you like to go back to analyzing plant diseases?
          </p>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <Button
            variant="default"
            size="lg"
            className="bg-violet-600 hover:bg-violet-700 gap-2"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center"
        >
          <div className="flex items-center gap-2 text-violet-400/60 text-sm">
            <Leaf className="h-4 w-4" />
            <span>PlantGuard AI</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
