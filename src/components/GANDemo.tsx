
import React, { useRef, useEffect } from 'react';
import { motion } from "framer-motion";

export const GANDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let points: { x: number; y: number; vx: number; vy: number; size: number; color: string }[] = [];
    const numPoints = 75;

    // Function to generate a random color with vitamin-themed hues
    const getRandomColor = () => {
      const colors = [
        '#FFA07A', // Light Salmon (Vitamin A)
        '#FFDAB9', // Peach (Vitamin C)
        '#98FB98', // Pale Green (Vitamin B)
        '#87CEFA', // Light Sky Blue (Vitamin D)
        '#DDA0DD', // Plum (Vitamin E)
        '#FFFACD', // Lemon Chiffon (Vitamin K)
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // Initialize points
    const initPoints = () => {
      points = [];
      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: Math.random() * canvasElement.width,
          y: Math.random() * canvasElement.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          color: getRandomColor()
        });
      }
    };

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      points.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off the walls
        if (point.x < 0 || point.x > canvasElement.width) {
          point.vx = -point.vx;
        }
        if (point.y < 0 || point.y > canvasElement.height) {
          point.vy = -point.vy;
        }

        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = point.color;
        ctx.fill();
      });

      frameId = requestAnimationFrame(animate);
    };

    // Resize function
    const resizeCanvas = () => {
      canvasElement.width = canvasElement.offsetWidth;
      canvasElement.height = canvasElement.offsetHeight;
      initPoints();
    };

    // Initial setup
    resizeCanvas();
    initPoints();
    animate();

    // Event listener for resize
    window.addEventListener('resize', resizeCanvas);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-32 md:h-48 lg:h-64 rounded-lg overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        id="gan-canvas"
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(10px)' }}
      />
    </motion.div>
  );
};
