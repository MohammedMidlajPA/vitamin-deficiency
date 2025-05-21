
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import * as tf from '@tensorflow/tfjs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NutrientGANDemoProps {
  className?: string;
}

// GAN Parameters interface
interface GANModelParameters {
  epochs: number;
  batchSize: number;
  latentDimension: number;
  learningRate: number;
}

export const NutrientGANDemo = ({ className }: NutrientGANDemoProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  
  const ganParams: GANModelParameters = {
    epochs: 50, // Lower for demo purposes
    batchSize: 16,
    latentDimension: 100,
    learningRate: 0.0002
  };
  
  // Create a simple generator model using TensorFlow.js
  const createGenerator = () => {
    const model = tf.sequential();
    
    // Input layer
    model.add(tf.layers.dense({
      units: 256,
      inputShape: [ganParams.latentDimension],
      activation: 'relu'
    }));
    
    // Hidden layers
    model.add(tf.layers.dense({
      units: 512,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: 1024,
      activation: 'relu'
    }));
    
    // Output layer - 28x28 image with RGB channels
    model.add(tf.layers.dense({
      units: 28 * 28 * 3,
      activation: 'tanh'
    }));
    
    return model;
  };
  
  // Generate random latent vectors
  const generateRandomLatentVectors = (samples: number) => {
    return tf.randomNormal([samples, ganParams.latentDimension]);
  };
  
  // Generate images using the GAN generator
  const generateImages = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setProgress(0);
    setImages([]);
    
    try {
      // Create generator model
      const generator = createGenerator();
      const count = 6; // Number of images to generate
      
      // Mock training progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 300);
      
      // Generate latent vectors
      const latentVectors = generateRandomLatentVectors(count);
      
      // Generate synthetic images using the generator
      const outputTensor = generator.predict(latentVectors) as tf.Tensor;
      
      // Reshape the output to images format [batch, height, width, channels]
      const reshapedOutput = outputTensor.reshape([count, 28, 28, 3]);
      
      // Create array of image URLs
      const imageURLs: string[] = [];
      
      // Convert tensors to canvas images
      for (let i = 0; i < count; i++) {
        const imageTensor = reshapedOutput.slice([i, 0, 0, 0], [1, 28, 28, 3]);
        
        // Create a float32 array and normalize to 0-255 range
        const imageArray = await imageTensor.data();
        const normalizedArray = Array.from(imageArray).map(
          val => Math.floor(((val + 1) / 2) * 255)
        );
        
        // Create image data
        const canvas = document.createElement('canvas');
        canvas.width = 28;
        canvas.height = 28;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Create ImageData object
          const imageData = ctx.createImageData(28, 28);
          
          // Set pixel data
          for (let j = 0; j < normalizedArray.length / 3; j++) {
            imageData.data[j * 4] = normalizedArray[j * 3]; // R
            imageData.data[j * 4 + 1] = normalizedArray[j * 3 + 1]; // G
            imageData.data[j * 4 + 2] = normalizedArray[j * 3 + 2]; // B
            imageData.data[j * 4 + 3] = 255; // Alpha
          }
          
          // Put image data to canvas
          ctx.putImageData(imageData, 0, 0);
          
          // Add some deficiency-like visual features
          ctx.globalAlpha = 0.3;
          
          // Use different colors for different types of deficiencies
          const deficiencyColors = [
            'rgba(0, 0, 139, 0.2)', // dark blue (B12)
            'rgba(139, 69, 19, 0.2)', // brown (Iron)
            'rgba(255, 215, 0, 0.2)', // gold (Vitamin D)
            'rgba(0, 100, 0, 0.2)', // dark green (Vitamin K)
            'rgba(255, 140, 0, 0.2)', // dark orange (Vitamin C)
            'rgba(128, 0, 128, 0.2)', // purple (Folate)
          ];
          
          ctx.fillStyle = deficiencyColors[i % deficiencyColors.length];
          
          for (let k = 0; k < 10; k++) {
            const x = Math.random() * 28;
            const y = Math.random() * 28;
            const radius = 1 + Math.random() * 3;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Get data URL
          const dataURL = canvas.toDataURL('image/png');
          imageURLs.push(dataURL);
        }
      }
      
      // Clean up tensors
      latentVectors.dispose();
      outputTensor.dispose();
      reshapedOutput.dispose();
      
      clearInterval(progressInterval);
      setProgress(100);
      setImages(imageURLs);
    } catch (error) {
      console.error("Error generating GAN images:", error);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    }
  };
  
  useEffect(() => {
    // Initialize TensorFlow.js
    tf.ready().then(() => {
      // Generate initial images when component mounts
      generateImages();
    });
    
    // Clean up function
    return () => {
      // Dispose any remaining tensors
      tf.disposeVariables();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className={`rounded-lg border border-blue-500/20 bg-black/30 backdrop-blur-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-medium text-white">Deficiency Visualization</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <Info className="h-4 w-4 text-blue-400/70" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] bg-black/90 border-blue-500/30">
                <p className="text-xs">
                  Using TensorFlow.js to demonstrate how GANs can create visualizations of vitamin deficiency effects 
                  for better understanding and educational purposes.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          className="gap-2 text-xs"
          disabled={isGenerating}
          onClick={generateImages}
        >
          <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Generate New'}
        </Button>
      </div>
      
      {isGenerating && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Generating visualizations...</span>
            <span className="text-xs font-medium text-blue-300">{Math.round(progress)}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-1" 
          />
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2">
        {images.map((src, i) => (
          <motion.div
            key={`gan-image-${i}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="aspect-square rounded-md overflow-hidden border border-blue-500/20 bg-black/20"
          >
            <img 
              src={src} 
              alt={`Vitamin deficiency visualization ${i+1}`} 
              className="w-full h-full object-cover" 
              ref={el => canvasRefs.current[i] = el}
            />
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-black/40 rounded border border-blue-500/10 text-xs text-muted-foreground">
        <p>This TensorFlow.js demo visualizes how different vitamin deficiencies might appear visually in the body. These generated images help in educational contexts to better understand the physical manifestations of nutritional deficiencies.</p>
      </div>
    </div>
  );
};
