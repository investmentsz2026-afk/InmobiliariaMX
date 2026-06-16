"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  size: number;
  startX: number;
  swayX1: number;
  swayX2: number;
  swayX3: number;
  delay: number;
  duration: number;
}

export default function GrillBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles only on the client side to prevent hydration mismatches
    const generated = Array.from({ length: 22 }, (_, i) => {
      const startX = Math.random() * 100;
      return {
        id: i,
        size: Math.random() * 3.5 + 1.5, // 1.5px to 5px
        startX,
        swayX1: startX + (Math.random() * 8 - 4),
        swayX2: startX + (Math.random() * 14 - 7),
        swayX3: startX + (Math.random() * 8 - 4),
        delay: Math.random() * 12,
        duration: Math.random() * 18 + 12, // 12s to 30s
      };
    });
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#080000]">
      {/* Grill Texture Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-luminosity"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80')` }}
      />
      {/* Deep crimson / burgundy gradient vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/85 via-[#080000]/95 to-black" />

      {/* Moving Glowing Orbs */}
      {/* Animated Gold Glow 1 (Top Right) */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.25, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[140px]"
      />

      {/* Animated Deep Blue Glow 2 (Middle Left) */}
      <motion.div
        animate={{
          x: [0, -80, 50, 0],
          y: [0, 70, -60, 0],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[15%] left-[-15%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[170px]"
      />

      {/* Animated Gold/Amber Glow 3 (Lower Right) */}
      <motion.div
        animate={{
          x: [0, 50, -60, 0],
          y: [0, 80, -40, 0],
          scale: [1, 1.2, 0.95, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[10%] right-[-10%] w-[550px] h-[550px] bg-red-700/12 rounded-full blur-[150px]"
      />

      {/* Animated Deep Navy Glow 4 (Bottom Left) */}
      <motion.div
        animate={{
          x: [0, -50, 60, 0],
          y: [0, -70, 50, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] left-[5%] w-[600px] h-[600px] bg-amber-400/8 rounded-full blur-[180px]"
      />

      {/* Floating Grill Embers / Sparks (Fixed position to float dynamically over viewport) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "105vh", x: `${p.startX}vw`, opacity: 0 }}
            animate={{
              y: "-5vh",
              x: [
                `${p.startX}vw`,
                `${p.swayX1}vw`,
                `${p.swayX2}vw`,
                `${p.swayX3}vw`,
                `${p.startX}vw`,
              ],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
            style={{
              width: p.size,
              height: p.size,
            }}
            className="absolute rounded-full bg-gradient-to-t from-gold-400 via-amber-500 to-orange-600 blur-[0.5px] shadow-[0_0_6px_rgba(245,158,11,0.65),_0_0_12px_rgba(239,68,68,0.35)]"
          />
        ))}
      </div>
    </div>
  );
}
