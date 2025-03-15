
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { GANShowcase, GANModelParameters } from '@/utils/ganShowcase';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface GANDemoProps {
  className?: string;
}

export const GANDemo = ({ className }: GANDemoProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const ganParams: GANModelParameters = {
    epochs: 50, // Lower for demo purposes
    batchSize: 16,
    latentDimension: 100,
    learningRate: 0.0002
  };
  
  const generateImages = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setProgress(0);
    setImages([]);
    
    try {
      const gan = new GANShowcase(ganParams);
      const count = 6; // Number of images to generate
      
      // Mock training progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 300);
      
      // Generate synthetic images
      const syntheticArrays = gan.generateSyntheticDiseaseImages(count);
      
      // Convert arrays to visual format
      const imagePromises = syntheticArrays.map(array => gan.syntheticArrayToImage(array));
      const generatedImages = await Promise.all(imagePromises);
      
      clearInterval(progressInterval);
      setProgress(100);
      setImages(generatedImages);
    } catch (error) {
      console.error("Error generating GAN images:", error);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    }
  };
  
  useEffect(() => {
    // Generate initial images when component mounts
    generateImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className={`rounded-lg border border-violet-500/20 bg-black/30 backdrop-blur-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-400" />
          <h3 className="text-lg font-medium text-white">GAN Disease Synthesis</h3>
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
            <span className="text-xs text-muted-foreground">Generating synthetic disease images...</span>
            <span className="text-xs font-medium text-violet-300">{Math.round(progress)}%</span>
          </div>
          <Progress 
            value={progress} 
            className="h-1" 
            indicatorClassName="bg-violet-500" 
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
            className="aspect-square rounded-md overflow-hidden border border-violet-500/20 bg-black/20"
          >
            <img 
              src={src} 
              alt={`GAN generated plant disease ${i+1}`} 
              className="w-full h-full object-cover" 
            />
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-black/40 rounded border border-violet-500/10 text-xs text-muted-foreground">
        <p>This is a simplified showcase of how GANs (Generative Adversarial Networks) could 
          be used to synthesize plant disease images for training improved detection models.</p>
      </div>
    </div>
  );
};
