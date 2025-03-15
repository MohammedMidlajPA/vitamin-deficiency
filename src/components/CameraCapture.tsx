
import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, CheckCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCapture, setHasCapture] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Start camera
  const startCamera = async () => {
    try {
      setErrorMessage(null);
      
      const constraints = {
        video: {
          facingMode: "environment", // Use rear camera on mobile devices
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrorMessage("Unable to access camera. Please ensure you've granted camera permissions.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data as base64 string
        setHasCapture(true);
        // Don't stop the camera yet to allow retaking
      }
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setHasCapture(false);
  };

  // Confirm and use captured photo
  const confirmPhoto = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL('image/jpeg', 0.9);
      onCapture(imageData);
      stopCamera();
      setHasCapture(false);
    }
  };

  // Clean up camera when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const cameraContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center space-y-4"
      variants={cameraContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {!isCameraActive && !hasCapture && (
        <motion.div 
          className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-violet-500/30 rounded-lg bg-black/20"
          whileHover={{ scale: 1.02 }}
        >
          <Camera className="h-12 w-12 text-violet-400 mb-4" />
          <p className="text-center text-white mb-6">
            Capture a photo of your plant to analyze potential diseases
          </p>
          
          <Button 
            onClick={startCamera} 
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Camera className="mr-2 h-4 w-4" />
            Open Camera
          </Button>
          
          {errorMessage && (
            <p className="mt-4 text-red-400 text-sm text-center">
              {errorMessage}
            </p>
          )}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {isCameraActive && (
          <motion.div 
            key="camera-view"
            className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden camera-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              muted 
              className={`w-full h-full object-cover ${hasCapture ? 'hidden' : 'block'}`}
              onCanPlay={() => videoRef.current?.play()}
            />
            
            <canvas 
              ref={canvasRef} 
              className={`w-full h-full object-cover ${hasCapture ? 'block' : 'hidden'}`}
            />
            
            {!hasCapture && (
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center bg-gradient-to-t from-black/70 to-transparent">
                <Button 
                  onClick={capturePhoto} 
                  className="rounded-full w-14 h-14 p-0 bg-white hover:bg-white/90 pulse-border"
                >
                  <div className="rounded-full w-12 h-12 border-2 border-violet-500 flex items-center justify-center">
                    <Camera className="h-6 w-6 text-violet-800" />
                  </div>
                </Button>
              </div>
            )}
            
            {hasCapture && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 p-4 flex justify-center space-x-4 bg-gradient-to-t from-black/70 to-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Button 
                  onClick={retakePhoto} 
                  variant="outline"
                  className="rounded-full flex items-center justify-center bg-white/10 border-white/20 hover:bg-white/20"
                >
                  <RefreshCw className="h-5 w-5 text-white" />
                </Button>
                <Button 
                  onClick={confirmPhoto}
                  className="rounded-full flex items-center justify-center bg-green-600 hover:bg-green-700"
                >
                  <CheckCheck className="h-5 w-5 text-white" />
                </Button>
              </motion.div>
            )}
            
            <button 
              onClick={stopCamera}
              className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors"
              aria-label="Close camera"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
