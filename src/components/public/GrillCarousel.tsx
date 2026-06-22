"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X, Flame, Eye } from "lucide-react";

export interface SlideData {
  id: number;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    image: "/images/car1.jpeg",
    tag: "SELECCIÓN PRESTIGE",
    title: "CORTES PREMIUM",
    subtitle: "Marmoleo perfecto y calidad prime",
    description: "Cada pieza es seleccionada bajo los más altos estándares de calidad, asegurando una suavidad extrema y un sabor inolvidable en tu paladar.",
  },
  {
    id: 2,
    image: "/images/car2.jpeg",
    tag: "EL ARTE DEL FUEGO",
    title: "FUEGO Y MEZQUITE",
    subtitle: "El auténtico sabor del carbón natural",
    description: "Nuestras brasas de mezquite aportan ese toque ahumado clásico y rústico que sella los jugos y potencia el aroma de cada corte.",
  },
  {
    id: 3,
    image: "/images/car3.jpeg",
    tag: "MADURACIÓN LENTA",
    title: "MADURACIÓN ARTESANAL",
    subtitle: "Sabor y textura en su punto máximo",
    description: "Sometemos nuestras piezas a un riguroso proceso de maduración para suavizar las fibras y concentrar la riqueza de sus jugos naturales.",
  },
  {
    id: 4,
    image: "/images/car4.png",
    tag: "ESPECIALIDADES DE AUTOR",
    title: "CREACIONES GRILL",
    subtitle: "El toque único de nuestro asador",
    description: "Sorpréndete con nuestras papas rellenas rebosantes de carne premium, quesacavas fundidas y complementos que realzan la experiencia.",
  },
  {
    id: 5,
    image: "/images/car5.png",
    tag: "SABOR A LA CARTA",
    title: "BANQUETE DE LUJO",
    subtitle: "La mística de la alta parrilla en tu mesa",
    description: "Creamos un ambiente insuperable de terraza gourmet para que compartas los mejores momentos con las mejores carnes de la región.",
  },
];

const AUTOPLAY_TIME = 6000;

interface GrillCarouselProps {
  slides?: SlideData[];
}

export default function GrillCarousel({ slides }: GrillCarouselProps) {
  const activeSlides = slides && slides.length > 0 ? slides : SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Carousel controls
  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    setProgress(0);
  }, [activeSlides.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    setProgress(0);
  }, [activeSlides.length]);

  const handleSelect = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setProgress(0);
  };

  // Autoplay Logic
  useEffect(() => {
    if (lightboxOpen) return;

    if (!isHovered) {
      const step = 100 / (AUTOPLAY_TIME / 100);
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + step;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isHovered, handleNext, lightboxOpen]);

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const handleLightboxNext = () => {
    setLightboxIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const handleLightboxPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") handleLightboxNext();
      if (e.key === "ArrowLeft") handleLightboxPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, activeSlides.length]);

  // Sync Lightbox index back to carousel on close
  useEffect(() => {
    if (!lightboxOpen) {
      setCurrentIndex(lightboxIndex);
      setProgress(0);
    }
  }, [lightboxOpen, lightboxIndex]);

  // Image animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-8 z-20">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-l-2 border-red-600 pl-4">
        <div>
          <span className="flex items-center gap-1.5 text-xs text-gold-400 font-bold tracking-widest uppercase">
            <Flame className="w-4.5 h-4.5 text-red-500 animate-pulse" />
            Galería del Chef
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1">
            Nuestra Propuesta de <span className="text-red-500">Lujo</span>
          </h2>
        </div>
        <p className="text-neutral-400 text-xs md:text-sm max-w-md font-light leading-relaxed">
          Un recorrido visual por las especialidades, el fuego de mezquite y la sazón exclusiva que hacen de la Zona Grill un restaurante inigualable.
        </p>
      </div>

      {/* Main Container - Split Layout */}
      <div
        className="relative w-full bg-black rounded-xl p-6 sm:p-8 border border-gold-400/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Column: Animated Text and Carousel Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full min-h-[300px] py-2">
          {/* Animated Texts Container */}
          <div className="space-y-3 sm:space-y-4 pr-0 lg:pr-4 flex-1">
            <AnimatePresence mode="wait">
              {activeSlides[currentIndex] && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600/20 border border-red-500/30 text-[9px] sm:text-[10px] tracking-widest text-red-400 font-black rounded-xs uppercase w-max">
                    {activeSlides[currentIndex].tag}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                    {activeSlides[currentIndex].title}
                  </h3>
                  <h4 className="text-xs sm:text-sm text-gold-400 font-semibold uppercase tracking-wider">
                    {activeSlides[currentIndex].subtitle}
                  </h4>
                  <p className="text-neutral-300 text-xs font-light leading-relaxed">
                    {activeSlides[currentIndex].description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive controls and Autoplay progress */}
          <div className="pt-6 border-t border-neutral-800/60 mt-6 flex flex-col gap-4">
            {/* Active slide progress bar */}
            <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-gold-400 to-red-600 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              {/* Navigation Dots */}
              <div className="flex items-center gap-1.5">
                {activeSlides.map((slide, idx) => (
                  <button
                    key={slide.id || idx}
                    onClick={() => handleSelect(idx)}
                    className={`transition-all duration-300 h-1.5 rounded-full cursor-pointer ${
                      idx === currentIndex
                        ? "w-6 bg-gold-400"
                        : "w-1.5 bg-neutral-700 hover:bg-neutral-500"
                    }`}
                    aria-label={`Ir al slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Image Container */}
        <div className="lg:col-span-7 flex items-center justify-center w-full">
          {activeSlides[currentIndex] && (
            <div
              onClick={() => openLightbox(currentIndex)}
              className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-gold-400/15 shadow-xl group/img cursor-zoom-in bg-neutral-950"
              title="Haz clic para ver en pantalla completa"
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  src={activeSlides[currentIndex].image}
                  alt={activeSlides[currentIndex].title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                />
              </AnimatePresence>

              {/* Hover Image Overlay with Zoom/Eye indicator */}
              <div className="absolute inset-0 bg-black/10 group-hover/img:bg-black/40 transition-colors duration-300 flex items-center justify-center z-10">
                <div className="w-12 h-12 rounded-full bg-red-750/90 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-350 scale-75 group-hover/img:scale-100 border border-gold-400/20 shadow-lg shadow-black/50">
                  <Maximize2 className="w-5 h-5 text-gold-400" />
                </div>
              </div>

              {/* Slide Index Counter tag in image corner */}
              <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/75 backdrop-blur-xs text-[9px] font-bold text-neutral-300 border border-white/5 rounded-xs tracking-wider z-10">
                {currentIndex + 1} / {activeSlides.length}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal (rendered via React Portal at root of DOM) */}
      {mounted && activeSlides[lightboxIndex] && createPortal(
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999999] flex flex-col justify-between bg-black/80 backdrop-blur-2xl p-4 md:p-6 overflow-hidden"
              onClick={closeLightbox}
            >
              {/* Close button - absolute for perfect overlay above everything */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-neutral-900/90 hover:bg-red-750 text-white border border-neutral-800 hover:border-red-500/30 flex items-center justify-center transition-all duration-300 hover:scale-105 z-50 cursor-pointer shadow-lg shadow-black/85"
                title="Cerrar (Esc)"
              >
                <X className="w-5.5 h-5.5" />
              </button>

              {/* Top Bar Branding */}
              <div className="flex items-center w-full max-w-7xl mx-auto z-10 pt-2 px-2 h-10 select-none">
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-serif font-black text-lg italic">La Cava</span>
                  <span className="text-neutral-500 text-xs">|</span>
                  <span className="text-neutral-400 text-[10px] tracking-widest uppercase font-semibold">
                    Zona Grill
                  </span>
                </div>
              </div>

              {/* Image Container with Prev/Next Controls */}
              <div className="relative flex-1 flex items-center justify-center max-w-5xl mx-auto w-full group/lightbox my-4 overflow-hidden">
                {/* Prev Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLightboxPrev();
                  }}
                  className="absolute left-2 md:left-4 w-11 h-11 rounded-full bg-neutral-900/80 hover:bg-red-750 text-white border border-neutral-800/80 flex items-center justify-center transition-all duration-300 z-10 hover:scale-105 cursor-pointer shadow-md"
                  title="Anterior (Flecha izquierda)"
                >
                  <ChevronLeft className="w-5.5 h-5.5" />
                </button>

                {/* Main Expanded Image */}
                <div
                  className="relative max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] max-w-full aspect-auto rounded-lg overflow-hidden border border-neutral-800 shadow-2xl flex items-center justify-center bg-neutral-950/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.img
                    key={lightboxIndex}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    src={activeSlides[lightboxIndex].image}
                    alt={activeSlides[lightboxIndex].title}
                    className="max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] max-w-full object-contain select-none"
                  />
                </div>

                {/* Next Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLightboxNext();
                  }}
                  className="absolute right-2 md:right-4 w-11 h-11 rounded-full bg-neutral-900/80 hover:bg-red-750 text-white border border-neutral-800/80 flex items-center justify-center transition-all duration-300 z-10 hover:scale-105 cursor-pointer shadow-md"
                  title="Siguiente (Flecha derecha)"
                >
                  <ChevronRight className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* Bottom Info Bar */}
              <div
                className="w-full max-w-2xl mx-auto bg-black border border-neutral-850 rounded-xl p-4 md:p-5 text-center space-y-1.5 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[9px] tracking-wider text-gold-400 font-bold uppercase block">
                  Imagen {lightboxIndex + 1} de {activeSlides.length}
                </span>
                <h3 className="font-serif text-base md:text-lg font-bold text-white tracking-tight leading-none">
                  {activeSlides[lightboxIndex].title} — <span className="text-gold-400 font-sans text-xs md:text-sm font-medium">{activeSlides[lightboxIndex].subtitle}</span>
                </h3>
                <p className="text-neutral-400 text-[10px] md:text-xs font-light max-w-lg mx-auto leading-relaxed mt-1">
                  {activeSlides[lightboxIndex].description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
