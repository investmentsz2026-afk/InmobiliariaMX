"use client";

import { Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import SectionDivider from "./SectionDivider";

interface TestimonialData {
  text: string;
  author: string;
  role: string;
}

interface GrillTestimonialsProps {
  reviews?: TestimonialData[];
  title?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function GrillTestimonials({
  reviews,
  title = "LO QUE DICEN NUESTROS CLIENTES",
  buttonText = "Ver más reseñas",
  buttonLink = "https://wa.me/523222018003?text=Hola,%20quisiera%20enviar%20una%20reseña%20sobre%20mi%20experiencia%20en%20la%20Zona%20Grill.",
}: GrillTestimonialsProps) {
  const defaultReviews = [
    {
      text: "El costillar BBQ de leña de mezquite de los domingos es insuperable. Se deshace en la boca, caramelizado a la perfección. La mejor alta parrilla gourmet.",
      author: "Carlos Villalobos",
      role: "Cliente de Fin de Semana",
    },
    {
      text: "Las Papas Rellenas Especiales con extra carne son una joya. Pedimos por WhatsApp cada sábado y el servicio es muy rápido y caliente.",
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

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 text-center relative z-10 border-t border-amber-500/10">
      {/* Golden Section Divider */}
      <SectionDivider title={title} />

      {/* Grid Layout of 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {activeReviews.slice(0, 3).map((review, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-[#0c0c0c] border border-amber-500/10 hover:border-amber-500/30 p-6 sm:p-8 rounded-sm shadow-xl flex flex-col justify-between text-left relative overflow-hidden transition-all duration-300 group"
          >
            {/* Ambient fire glow inside card */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-650/[0.02] rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              {/* 5 Golden Stars */}
              <div className="flex items-center gap-1 select-none">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                ))}
              </div>

              {/* Quote text */}
              <p className="font-serif text-sm sm:text-base italic leading-relaxed text-neutral-100">
                "{review.text}"
              </p>
            </div>

            {/* Author info */}
            <div className="mt-6 border-t border-neutral-900 pt-4">
              <h4 className="text-xs font-bold tracking-widest text-gold-400 uppercase">
                — {review.author}
              </h4>
              <p className="text-[9px] uppercase tracking-widest text-neutral-500 mt-1 font-semibold">
                {review.role}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Golden Outline Button */}
      <div className="mt-10">
        <a
          href={buttonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-amber-500/60 hover:border-amber-500 text-gold-400 hover:text-black hover:bg-amber-500 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          {buttonText}
        </a>
      </div>
    </section>
  );
}
