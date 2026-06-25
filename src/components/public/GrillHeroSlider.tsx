"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  id: string | number;
  tag: string;
  title: string;
  description: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
}

interface GrillHeroSliderProps {
  slides: HeroSlide[];
}

const AUTOPLAY_TIME = 6000;

export default function GrillHeroSlider({ slides }: GrillHeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const activeSlides = slides && slides.length > 0 ? slides : [];

  const handleNext = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const handlePrev = useCallback(() => {
    if (activeSlides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  const [isSliderVisible, setIsSliderVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsSliderVisible(false);
      } else {
        setIsSliderVisible(true);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentSlide = activeSlides[currentIndex];

  // Try to play the video unmuted when it loads, fallback to muted if blocked
  useEffect(() => {
    if (currentSlide && currentSlide.mediaType === "VIDEO" && videoRef.current) {
      const video = videoRef.current;
      if (!isSliderVisible) {
        video.muted = true;
        video.play().catch(() => {});
        return;
      }
      video.muted = false;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay with audio was blocked, playing muted as fallback:", error);
          video.muted = true;
          video.play().catch(err => console.error("Muted playback failed too:", err));
        });
      }
    }
  }, [currentIndex, currentSlide, isSliderVisible]);

  // Dynamic scroll-mute control
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isSliderVisible;
    }
  }, [isSliderVisible]);

  // Sync unmute when the user interacts with the page (if the slider is visible)
  useEffect(() => {
    const handleInteraction = () => {
      if (videoRef.current && isSliderVisible) {
        const video = videoRef.current;
        if (video.muted) {
          video.muted = false;
          video.play().catch(() => {});
        }
      }
    };

    window.addEventListener("click", handleInteraction, { passive: true });
    window.addEventListener("scroll", handleInteraction, { passive: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [isSliderVisible]);

  // Autoplay Logic: Use 30s safety timeout for videos, standard 6s for images
  useEffect(() => {
    if (activeSlides.length <= 1 || isHovered) return;

    const isVideo = activeSlides[currentIndex]?.mediaType === "VIDEO";
    const delay = isVideo ? 30000 : AUTOPLAY_TIME;

    const timer = setInterval(() => {
      handleNext();
    }, delay);

    return () => clearInterval(timer);
  }, [isHovered, handleNext, activeSlides, currentIndex]);

  if (activeSlides.length === 0) return null;

  const textVariants = {
    enter: { opacity: 0, y: 30 },
    center: { 
      opacity: 1, 
      y: 0,
      transition: {
        y: { type: "spring" as const, stiffness: 80, damping: 15 },
        opacity: { duration: 0.5 }
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.4 }
    }
  };

  const mediaVariants = {
    enter: { opacity: 0, scale: 1.05 },
    center: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" as const }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.6, ease: "easeIn" as const }
    }
  };

  return (
    <div 
      className="relative w-full min-h-[58vh] md:min-h-[68vh] flex items-center overflow-hidden border-b border-gold-400/10 bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Full-Screen Background Media */}
      <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={mediaVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {currentSlide.mediaType === "VIDEO" ? (
              <video
                ref={videoRef}
                src={currentSlide.mediaUrl}
                autoPlay
                playsInline
                muted={!isSliderVisible}
                onEnded={handleNext}
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <img
                src={currentSlide.mediaUrl}
                alt={currentSlide.title}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Cinematic dark overlays to guarantee high contrast and legibility - only for non-videos */}
            {currentSlide.mediaType !== "VIDEO" && (
              <div className="absolute inset-0 bg-black/60 md:bg-gradient-to-r md:from-black/95 md:via-black/70 md:to-black/30 z-10" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. Overlaid Text & Buttons Content */}
      {(() => {
        const isVideo = currentSlide?.mediaType === "VIDEO";
        return (
          <div className={
            isVideo 
              ? "relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col justify-end items-start pt-28 pb-20 md:pt-36 md:pb-24 self-stretch min-h-[58vh] md:min-h-[68vh]"
              : "relative z-10 w-full max-w-7xl mx-auto px-6 py-8 md:py-10 flex items-center"
          }>
            <div className={
              isVideo
                ? "max-w-lg space-y-4 text-left mt-auto md:ml-4"
                : "max-w-2xl space-y-6 text-left relative -top-1 md:-top-4"
            }>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-4"
                >
                  <span 
                    className={
                      isVideo
                        ? "text-gold-400 font-sans tracking-[0.25em] text-xs sm:text-sm font-black uppercase block select-none mb-1"
                        : "text-gold-400 font-sans tracking-[0.25em] text-sm sm:text-base font-black uppercase block select-none"
                    }
                    style={isVideo ? { textShadow: "1.5px 1.5px 0px rgba(0,0,0,0.85)" } : {}}
                  >
                    {currentSlide.tag || "ZONA GRILL"}
                  </span>
                  <h1 
                    className={
                      isVideo
                        ? "font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-none uppercase"
                        : "font-serif text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none uppercase whitespace-pre-line"
                    }
                    style={isVideo ? { textShadow: "3px 3px 0px rgba(0,0,0,0.85), 5px 5px 15px rgba(0,0,0,0.8)" } : {}}
                  >
                    {currentSlide.title}
                  </h1>
                  <p 
                    className={
                      isVideo
                        ? "text-neutral-200 text-xs sm:text-sm font-semibold leading-relaxed max-w-full"
                        : "text-neutral-200 text-lg sm:text-xl font-light leading-relaxed max-w-lg"
                    }
                    style={isVideo ? { textShadow: "1.5px 1.5px 0px rgba(0,0,0,0.85), 3px 3px 8px rgba(0,0,0,0.8)" } : {}}
                  >
                    {currentSlide.description}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://wa.me/523222018003?text=Hola,%20quisiera%20hacer%20un%20pedido%20de%20la%20Zona%20Grill."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-[#25D366] hover:bg-[#1ebd53] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm shadow-xl shadow-green-950/20 flex items-center justify-center gap-2 cursor-pointer border-none z-20"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  Pedir por WhatsApp
                </a>
                <a
                  href="#menu-section"
                  className="px-6 py-4 bg-transparent border border-gold-400/60 hover:border-gold-400 text-gold-400 hover:text-black hover:bg-gold-400 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center cursor-pointer z-20"
                >
                  Ver Menú
                </a>
              </div>

              {/* Quick Details List */}
              {!isVideo && (
                <div className="pt-6 border-t border-gold-400/10 grid grid-cols-2 gap-6 text-xs select-none max-w-sm">
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-gold-400 font-bold mb-0.5">Horarios</span>
                    <span className="text-neutral-300 font-medium">Sábados y Domingos: 14:00 - 19:00</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-widest text-gold-400 font-bold mb-0.5">Ubicación</span>
                    <span className="text-neutral-300 font-medium">Valle Oriente, Monterrey</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* 3. Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-gold-400 text-gold-400 hover:text-black border border-white/10 hover:border-gold-400 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-xs flex items-center justify-center shadow-lg"
            aria-label="Diapositiva anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-gold-400 text-gold-400 hover:text-black border border-white/10 hover:border-gold-400 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-xs flex items-center justify-center shadow-lg"
            aria-label="Siguiente diapositiva"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* 4. Bottom Dot Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 select-none">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`h-2 transition-all duration-350 cursor-pointer rounded-full ${
                currentIndex === idx 
                  ? "bg-gold-400 w-6" 
                  : "bg-white/20 hover:bg-white/40 w-2"
              }`}
              aria-label={`Ir a diapositiva ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
