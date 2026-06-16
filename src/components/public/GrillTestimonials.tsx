"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TestimonialData {
  text: string;
  author: string;
  role: string;
}

interface GrillTestimonialsProps {
  reviews?: TestimonialData[];
}

export default function GrillTestimonials({ reviews }: GrillTestimonialsProps) {
  const defaultReviews = [
    {
      text: "El costillar BBQ de leña de mezquite de los domingos es insuperable. Se deshace en la boca, caramelizado a la perfección. La mejor alta parrilla gourmet de la ciudad.",
      author: "Carlos Villalobos",
      role: "Cliente de Fin de Semana",
    },
    {
      text: "Las Papas Rellenas Especiales con extra carne son una joya. Pedimos por WhatsApp cada sábado y el servicio es muy rápido y la comida llega caliente.",
      author: "Mariana G. Treviño",
      role: "Comensal Frecuente",
    },
    {
      text: "Un concepto de asado espectacular. El sabor ahumado y rústico del mezquite natural que logran en cada corte de carne es arte puro. 100% recomendados.",
      author: "Chef Roberto Leal",
      role: "Crítico Gastronómico",
    },
  ];

  const activeReviews = reviews && reviews.length > 0 ? reviews : defaultReviews;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % activeReviews.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + activeReviews.length) % activeReviews.length);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-16 text-center relative z-10 border-t border-amber-500/10">
      <div className="flex flex-col items-center mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] tracking-widest uppercase font-bold rounded-full mb-3">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          Testimonios de Clientes
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          La Opinión de <span className="text-amber-500 drop-shadow-[0_2px_10px_rgba(217,119,6,0.2)]">Nuestros Comensales</span>
        </h2>
      </div>

      <div className="bg-[#0b0808]/90 border border-amber-500/15 p-8 sm:p-12 rounded-sm shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-650/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <Quote className="w-12 h-12 text-amber-500/10 mx-auto mb-6" />

        <div className="min-h-[160px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <p className="font-serif text-lg sm:text-xl md:text-2xl italic leading-relaxed text-neutral-250">
                "{activeReviews[activeIndex]?.text}"
              </p>
              <div>
                <h4 className="text-sm font-bold tracking-wider text-amber-500 uppercase">
                  {activeReviews[activeIndex]?.author}
                </h4>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1 font-semibold">
                  {activeReviews[activeIndex]?.role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center space-x-6 mt-8 relative z-25">
          <button
            onClick={handlePrev}
            className="p-2 border border-amber-500/20 hover:border-amber-500 text-neutral-400 hover:text-amber-500 hover:bg-amber-500/5 transition-all duration-300 rounded-full cursor-pointer bg-black/20"
            aria-label="Anterior testimonio"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-neutral-500 tracking-widest font-mono font-semibold">
            {activeIndex + 1} / {activeReviews.length}
          </span>
          <button
            onClick={handleNext}
            className="p-2 border border-amber-500/20 hover:border-amber-500 text-neutral-400 hover:text-amber-500 hover:bg-amber-500/5 transition-all duration-300 rounded-full cursor-pointer bg-black/20"
            aria-label="Siguiente testimonio"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
