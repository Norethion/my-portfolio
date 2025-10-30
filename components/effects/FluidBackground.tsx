"use client";

import { useEffect, useRef } from "react";
import { useThemeStore } from "@/stores/useThemeStore";

/**
 * Animated Particles Background Component
 * Dynamic particle animation that responds to mouse movement
 */
export function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    const currentTheme = theme;

    // Particle array
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    const particleCount = 50;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      mouseX = touch.clientX;
      mouseY = touch.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    const drawCircle = (x: number, y: number, radius: number, color: string) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const animate = () => {
      // Use light overlay in light mode, dark overlay in dark mode
      ctx.fillStyle = currentTheme === "light" 
        ? "rgba(255, 255, 255, 0.05)" 
        : "rgba(10, 10, 10, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        // Mouse interaction - particles move away from mouse
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.speedX -= (dx / distance) * force * 0.02;
          particle.speedY -= (dy / distance) * force * 0.02;
        }

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Apply friction
        particle.speedX *= 0.99;
        particle.speedY *= 0.99;

        // Draw particle with gradient
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 2
        );
        gradient.addColorStop(0, `rgba(139, 92, 246, ${particle.opacity})`);
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${particle.opacity * 0.6})`);
        gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

        drawCircle(particle.x, particle.y, particle.size * 2, "rgba(139, 92, 246, 0.3)");
        drawCircle(particle.x, particle.y, particle.size, "rgba(139, 92, 246, 0.5)");

        // Draw connections between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full"
    />
  );
}

