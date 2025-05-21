import React, { useRef, useEffect } from 'react';
import { motion } from "framer-motion";

export const NutrientGANDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvasElement = canvasRef.current as HTMLCanvasElement;
    if (!canvasElement) return;

    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    const numberOfParticles = 150;
    const particleColor = 'rgba(139, 92, 246, 0.5)';

    // Handle canvas resize
    const resizeCanvas = () => {
      canvasElement.width = canvasElement.offsetWidth;
      canvasElement.height = canvasElement.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse position
    const mouse = {
      x: 0,
      y: 0,
      radius: 150
    };

    // Event listener for mousemove
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX - canvasElement.offsetLeft;
      mouse.y = event.clientY - canvasElement.offsetTop;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Create particle
    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.directionX = Math.random() * 2 - 1;
        this.directionY = Math.random() * 2 - 1;
        this.size = Math.random() * 5 + 1;
        this.color = particleColor;
      }

      // Draw particle
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      // Update particle position
      update() {
        // Check if particle is still within canvas
        if (this.x > canvasElement.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvasElement.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;

        // Check mouse position / particle position - collision detection
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
          if (mouse.x < this.x && this.x < canvasElement.width - this.size * 10) {
            this.x += 10;
          }
          if (mouse.x > this.x && this.x > this.size * 10) {
            this.x -= 10;
          }
          if (mouse.y < this.y && this.y < canvasElement.height - this.size * 10) {
            this.y += 10;
          }
          if (mouse.y > this.y && this.y > this.size * 10) {
            this.y -= 10;
          }
        }
        // Draw particle
        this.draw();
      }
    }

    // Create particle array
    const init = () => {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvasElement.width;
        let y = Math.random() * canvasElement.height;
        particlesArray.push(new Particle(x, y));
      }
    };

    // Animation loop
    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Check if particles are close enough to draw line between them
    const connect = () => {
      if (!ctx) return;

      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 50) {
            opacityValue = 1 - (distance / 50);
            ctx.strokeStyle = 'rgba(139, 92, 246,' + opacityValue + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    init();
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-48 rounded-lg overflow-hidden"
    >
      <canvas 
        ref={canvasRef} 
        id="nutrient-gan-canvas"
        className="absolute inset-0 w-full h-full"
      />
    </motion.div>
  );
};
