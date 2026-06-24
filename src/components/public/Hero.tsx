"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[calc(100vh-96px)] min-h-[600px] flex items-center justify-center bg-[#edf2f6] overflow-hidden -mt-24">
      {/* Background Image with fade overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1600&auto=format&fit=crop&q=80"
          alt="Cortes premium de carne de res marmoleada"
          className="w-full h-full object-cover object-center opacity-90 scale-102 filter contrast-[1.05]"
        />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#edf2f6] to-transparent" />
      </div>

      {/* Animated Rings Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-95">
        {/* Ring 1 (Red) */}
        <motion.div
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[400px] h-[400px] rounded-full border-[5px] border-red-600 shadow-[0_0_35px_rgba(220,38,38,0.95),_inset_0_0_20px_rgba(220,38,38,0.7)]"
        />
        {/* Ring 2 (Gold) */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.25, 0.6, 0.25],
            rotate: [360, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[600px] h-[600px] rounded-full border-[5px] border-gold-400 shadow-[0_0_35px_rgba(255,188,0,0.95),_inset_0_0_20px_rgba(255,188,0,0.7)]"
        />
        {/* Ring 3 (Dashed Red) */}
        <motion.div
          animate={{
            scale: [0.9, 1.4, 0.9],
            opacity: [0.15, 0.45, 0.15],
            rotate: [0, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[800px] h-[800px] rounded-full border-[3px] border-dashed border-red-500/90 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-neutral-800 flex flex-col items-center pt-28 sm:pt-0">
        
        {/* Animated Accent Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 flex items-center gap-2 px-4 py-1.5 bg-[#b01e28]/5 border border-[#b01e28]/20 text-[#b01e28] text-[10px] font-bold tracking-widest uppercase rounded-full"
        >
          <Sparkles className="w-3.5 h-3.5" />
          LA CAVA DEL CORTE | BOUTIQUE PREMIUM
        </motion.div>

        {/* Impactful Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6 text-neutral-900"
        >
          Cortes Premium de Sonora <br className="hidden sm:inline" />
          & El Arte del <span className="text-[#b01e28]">Buen Comer</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-base sm:text-lg text-gold-950 max-w-2xl font-normal tracking-wide leading-relaxed mb-10 px-6 sm:px-8 py-4 bg-gold-50/80 backdrop-blur-md border border-gold-400/30 rounded-sm shadow-[0_4px_20px_rgba(255,188,0,0.08)]"
        >
          Seleccionamos minuciosamente los mejores cortes marmoleados, empacados al alto vacío y listos para tu asador. Disfruta también de nuestra Zona Grill cocinada al carbón de leña los fines de semana.
        </motion.p>

        {/* Dual Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link
            href="/meat-store#catalogo"
            className="px-8 py-4 bg-[#b01e28] hover:bg-[#91181f] text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm shadow-md hover:scale-102 hover:shadow-red-900/20"
          >
            Cortes para Llevar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/"
            className="px-8 py-4 bg-transparent border border-neutral-350 hover:border-neutral-900 text-neutral-800 hover:text-neutral-950 text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center hover:scale-102 backdrop-blur-xs"
          >
            Explorar Menú Grill
          </Link>
        </motion.div>
      </div>

      {/* Decorative Slide Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 opacity-60">
        <span className="text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-medium">Deslizar para explorar</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#b01e28] to-transparent animate-pulse" />
      </div>
    </section>
  );
}
