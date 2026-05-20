"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials() {
  const reviews = [
    {
      text: "La experiencia de compra de nuestra residencia fue impecable. El equipo de Elegancia entendió a la perfección nuestros requerimientos estéticos y espaciales. La asesoría legal fue transparente en todo momento.",
      author: "Sofía Galván",
      role: "Propietaria en Cumbres de Autor",
    },
    {
      text: "Invertir en el proyecto de Zona Grill ha sido una de las mejores decisiones de mi portafolio patrimonial. El nivel de amenidades, el diseño del paisaje y la plusvalía generada en pre-venta superaron todas mis expectativas.",
      author: "Alejandro Maldonado",
      role: "Inversionista Lote 12 - Zona Grill",
    },
    {
      text: "Excelente servicio de acompañamiento financiero. Lograron gestionar las autorizaciones notariales de nuestro loft minimalista en tiempo récord. El trato de los asesores es de un nivel ejecutivo insuperable.",
      author: "Dra. Elena Ruiz",
      role: "Propietaria Loft Condesa",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-6 py-12 text-center text-white">
      <Quote className="w-12 h-12 text-gold-400/30 mx-auto mb-6" />
      
      <div className="min-h-[220px] sm:min-h-[160px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <p className="font-serif text-lg sm:text-2xl italic leading-relaxed text-gray-200">
              "{reviews[activeIndex].text}"
            </p>
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-gold-400">
                {reviews[activeIndex].author}
              </h4>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                {reviews[activeIndex].role}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="flex justify-center items-center space-x-6 mt-8">
        <button
          onClick={handlePrev}
          className="p-2 border border-white/10 hover:border-gold-400 hover:text-gold-400 text-white transition-all duration-300 rounded-full"
          aria-label="Anterior testimonio"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-gray-500 tracking-widest">
          {activeIndex + 1} / {reviews.length}
        </span>
        <button
          onClick={handleNext}
          className="p-2 border border-white/10 hover:border-gold-400 hover:text-gold-400 text-white transition-all duration-300 rounded-full"
          aria-label="Siguiente testimonio"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
