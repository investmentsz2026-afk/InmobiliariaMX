"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TestimonialData {
  text: string;
  author: string;
  role: string;
}

interface TestimonialsProps {
  reviews?: TestimonialData[];
}

export default function Testimonials({ reviews }: TestimonialsProps) {
  const defaultReviews = [
    {
      text: "Los cortes de carne fría empacados al vacío son extraordinarios. El Ribeye de Sonora tiene un marmoleado perfecto y la frescura es inigualable. Ideal para mis parrilladas de fin de semana.",
      author: "Sofía Galván",
      role: "Cliente Boutique Premium",
    },
    {
      text: "Probé el costillar BBQ de la Zona Grill el domingo pasado y quedé fascinado. La carne se desprende del hueso y el toque ahumado con mezquite es simplemente espectacular. Volveré sin duda.",
      author: "Alejandro Maldonado",
      role: "Comensal Zona Grill",
    },
    {
      text: "La atención personalizada y la calidad del producto son de primer nivel. Me armaron un paquete asador para mi evento corporativo y todos los invitados quedaron maravillados con la chistorra y el Sirloin.",
      author: "Dra. Elena Ruiz",
      role: "Cliente Corporativo",
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
    <div className="relative max-w-4xl mx-auto px-6 py-12 text-center text-neutral-800">
      <Quote className="w-12 h-12 text-[#b01e28]/15 mx-auto mb-6" />
      
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
            <p className="font-serif text-lg sm:text-2xl italic leading-relaxed text-neutral-800">
              "{activeReviews[activeIndex]?.text}"
            </p>
            <div>
              <h4 className="text-sm font-bold tracking-wider text-[#b01e28]">
                {activeReviews[activeIndex]?.author}
              </h4>
              <p className="text-[10px] uppercase tracking-widest text-neutral-450 mt-1 font-semibold">
                {activeReviews[activeIndex]?.role}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="flex justify-center items-center space-x-6 mt-8">
        <button
          onClick={handlePrev}
          className="p-2 border border-neutral-200 hover:border-[#b01e28] hover:text-[#b01e28] text-neutral-600 transition-all duration-300 rounded-full cursor-pointer"
          aria-label="Anterior testimonio"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-neutral-400 tracking-widest font-mono font-semibold">
          {activeIndex + 1} / {activeReviews.length}
        </span>
        <button
          onClick={handleNext}
          className="p-2 border border-neutral-200 hover:border-[#b01e28] hover:text-[#b01e28] text-neutral-600 transition-all duration-300 rounded-full cursor-pointer"
          aria-label="Siguiente testimonio"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
