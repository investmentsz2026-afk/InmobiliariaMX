"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[calc(100vh-96px)] min-h-[600px] flex items-center justify-center bg-black overflow-hidden -mt-24">
      {/* Background Image with darken overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1600&auto=format&fit=crop&q=80"
          alt="Cortes premium asándose en parrilla de carbón"
          className="w-full h-full object-cover object-center opacity-55 scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/55 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white flex flex-col items-center pt-28 sm:pt-0">
        
        {/* Animated Accent Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 flex items-center gap-2 px-4 py-1.5 bg-gold-400/15 backdrop-blur-md border border-gold-400/30 text-gold-400 text-[10px] font-bold tracking-widest uppercase rounded-full"
        >
          <Sparkles className="w-3.5 h-3.5" />
          LA CAVA DEL CORTE | BOUTIQUE & ZONA GRILL
        </motion.div>

        {/* Impactful Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6"
        >
          Cortes Premium de Sonora <br className="hidden sm:inline" />
          & El Arte del <span className="text-gold-400">Buen Comer</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-base sm:text-lg text-gray-300 max-w-2xl font-light tracking-wide leading-relaxed mb-10"
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
            href="/#catalogo"
            className="px-8 py-4 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm shadow-xl flex items-center justify-center hover:scale-102"
          >
            Cortes para Llevar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/zona-grill"
            className="px-8 py-4 bg-transparent border border-white/20 hover:border-gold-400 text-white hover:text-gold-400 text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center hover:scale-102 backdrop-blur-xs"
          >
            Explorar Menú Grill
          </Link>
        </motion.div>
      </div>

      {/* Decorative Slide Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 opacity-60">
        <span className="text-[9px] uppercase tracking-widest text-gray-400 mb-2 font-medium">Deslizar para explorar</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-gold-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
