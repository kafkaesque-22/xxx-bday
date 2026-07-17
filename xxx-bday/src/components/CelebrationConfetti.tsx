import React, { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
}

export default function CelebrationConfetti({ active, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  // Premium romantic / birthday palette
  const colors = [
    "#ffd700", // Gold
    "#ff69b4", // Hot Pink
    "#ffb6c1", // Light Pink
    "#ff007f", // Rose Magenta
    "#e6c280", // Champagne Gold
    "#ff4500", // Coral Orange
    "#c084fc", // Soft Violet
  ];

  useEffect(() => {
    if (!active) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      particlesRef.current = [];
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas safely
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Seed initial burst of particles
    const createParticle = (isBurst = false): Particle => {
      const size = Math.random() * 8 + 6;
      return {
        // Burst from bottom-left and bottom-right or top scatter
        x: isBurst 
          ? (Math.random() > 0.5 ? 0 : canvas.width)
          : Math.random() * canvas.width,
        y: isBurst ? canvas.height : -20,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: isBurst 
          ? (Math.random() > 0.5 ? Math.random() * 8 + 4 : -(Math.random() * 8 + 4))
          : Math.random() * 3 - 1.5,
        speedY: isBurst 
          ? -(Math.random() * 12 + 10) // Launch upwards
          : Math.random() * 4 + 2,     // Fall downwards
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.1 + 0.05,
        opacity: 1,
      };
    };

    // Initial blast
    const burstCount = 120;
    for (let i = 0; i < burstCount; i++) {
      particlesRef.current.push(createParticle(true));
    }

    // Steady ambient fall
    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      tick++;
      // Spawn new falling confetti slowly in background
      if (tick % 4 === 0 && particles.length < 220) {
        particles.push(createParticle(false));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update physics
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Add subtle gravity to burst particles or sway
        p.speedY += 0.18; // gravity
        p.speedX *= 0.98; // wind drag

        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        // Flutter side to side
        p.x += Math.sin(p.wobble) * 0.5;

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        // Render as a fluttery rectangle
        const width = p.size * Math.cos(p.wobble);
        ctx.fillRect(-width / 2, -p.size / 2, width, p.size);
        
        ctx.restore();

        // Fade out as they get to bottom
        if (p.y > canvas.height - 100) {
          p.opacity -= 0.02;
        }

        // Remove dead particles
        if (p.y > canvas.height || p.x < -50 || p.x > canvas.width + 50 || p.opacity <= 0) {
          particles.splice(i, 1);
        }
      }

      // Keep rendering as long as there are particles
      if (particles.length > 0) {
        animationRef.current = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-50 gpu-layer"
    />
  );
}
