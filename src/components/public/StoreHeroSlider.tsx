"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface HeroSlide {
  id: string | number;
  tag: string;
  title: string;
  description: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
}

interface StoreHeroSliderProps {
  slides: HeroSlide[];
}

const AUTOPLAY_TIME = 6000;

export default function StoreHeroSlider({ slides }: StoreHeroSliderProps) {
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
    enter: { opacity: 0, scale: 1.02 },
    center: { 
      opacity: 0.9, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" as const }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98,
      transition: { duration: 0.6, ease: "easeIn" as const }
    }
  };

  return (
    <section 
      className="relative h-[calc(100vh-96px)] min-h-[600px] flex flex-col justify-start items-center bg-[#edf2f6] overflow-hidden -mt-24 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Full-Screen Background Media */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
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
                className="w-full h-full object-contain object-center bg-black filter contrast-[1.05]"
              />
            ) : (
              <img
                src={currentSlide.mediaUrl}
                alt={currentSlide.title}
                className="w-full h-full object-cover object-center filter contrast-[1.05]"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. Animated Rings Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-40">
        {/* Ring 1 (Red) */}
        <motion.div
          animate={{
            scale: [0.85, 1.15, 0.85],
            opacity: [0.15, 0.35, 0.15],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[400px] h-[400px] rounded-full border-[3px] border-red-650 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
        />
        {/* Ring 2 (Gold) */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.1, 0.3, 0.1],
            rotate: [360, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[600px] h-[600px] rounded-full border-[3px] border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
        />
      </div>

      {/* 3. Overlaid Text & Buttons Content */}
      {(() => {
        const isVideo = currentSlide?.mediaType === "VIDEO";
        return (
          <div className={`relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col ${
            isVideo 
              ? "justify-end items-start text-left pt-28 pb-20 md:pt-36 md:pb-28 h-full" 
              : "justify-start items-center text-center pt-36 md:pt-48 pb-12"
          }`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className={
                  isVideo
                    ? "space-y-4 flex flex-col items-start text-left max-w-lg mt-auto md:ml-4"
                    : "space-y-6 flex flex-col items-center px-6 py-4 max-w-4xl"
                }
              >
                {/* Animated Accent Badge */}
                <div 
                  className={
                    isVideo
                      ? "flex items-center gap-2 px-3 py-1 border border-white/40 text-white text-[9px] font-bold tracking-widest uppercase rounded-full"
                      : "flex items-center gap-2 px-4 py-1.5 bg-white/90 border border-[#b01e28]/30 text-[#b01e28] text-[10px] font-bold tracking-widest uppercase rounded-full shadow-sm"
                  }
                  style={
                    isVideo
                      ? { textShadow: "1.5px 1.5px 0px rgba(0,0,0,0.85)" }
                      : { textShadow: "0 0 4px rgba(255, 255, 255, 0.8)" }
                  }
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentSlide.tag || "LA CAVA DEL CORTE | BOUTIQUE"}
                </div>

                {/* Impactful Title */}
                <h1 
                  className={
                    isVideo
                      ? "font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.1] mb-1 text-white uppercase whitespace-pre-line max-w-full text-left"
                      : "font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-2 text-neutral-950 uppercase whitespace-pre-line max-w-4xl text-center"
                  }
                  style={
                    isVideo
                      ? { textShadow: "3px 3px 0px rgba(0, 0, 0, 0.85), 5px 5px 15px rgba(0, 0, 0, 0.8)" }
                      : { textShadow: "0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 1), 0 0 5px rgba(255, 255, 255, 0.9)" }
                  }
                >
                  {currentSlide.title}
                </h1>

                {/* Subtitle */}
                <p 
                  className={
                    isVideo
                      ? "text-xs sm:text-sm text-neutral-200 max-w-full font-semibold tracking-wide leading-relaxed text-left"
                      : "text-sm sm:text-base text-neutral-950 max-w-2xl font-semibold tracking-wide leading-relaxed text-center"
                  }
                  style={
                    isVideo
                      ? { textShadow: "1.5px 1.5px 0px rgba(0, 0, 0, 0.85), 3px 3px 8px rgba(0, 0, 0, 0.8)" }
                      : { textShadow: "0 0 8px rgba(255, 255, 255, 1), 0 0 15px rgba(255, 255, 255, 1), 0 0 4px rgba(255, 255, 255, 0.9)" }
                  }
                >
                  {currentSlide.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dual Call to Actions */}
            <div className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-6 z-20 ${
              isVideo ? "justify-start self-start md:ml-4" : "justify-center"
            }`}>
              <Link
                href="/store#catalogo"
                className="px-8 py-4 bg-[#b01e28] hover:bg-[#91181f] text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm shadow-md hover:scale-102 hover:shadow-red-900/20 flex items-center justify-center gap-1.5"
              >
                <span>Cortes para Llevar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className={`px-8 py-4 border text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center hover:scale-102 backdrop-blur-xs shadow-xs ${
                  isVideo
                    ? "bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/60"
                    : "bg-white/50 border-neutral-350 hover:border-neutral-900 text-neutral-800 hover:text-neutral-950"
                }`}
              >
                Explorar Menú Grill
              </Link>
            </div>
          </div>
        );
      })()}

      {/* 4. Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white/40 hover:bg-[#b01e28] text-neutral-800 hover:text-white border border-neutral-300 hover:border-[#b01e28] rounded-full transition-all duration-300 cursor-pointer backdrop-blur-xs flex items-center justify-center shadow-md"
            aria-label="Diapositiva anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white/40 hover:bg-[#b01e28] text-neutral-800 hover:text-white border border-neutral-300 hover:border-[#b01e28] rounded-full transition-all duration-300 cursor-pointer backdrop-blur-xs flex items-center justify-center shadow-md"
            aria-label="Siguiente diapositiva"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* 5. Bottom Dot Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`h-2 transition-all duration-350 cursor-pointer rounded-full ${
                currentIndex === idx 
                  ? "bg-[#b01e28] w-6" 
                  : "bg-neutral-300 hover:bg-neutral-400 w-2"
              }`}
              aria-label={`Ir a diapositiva ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
