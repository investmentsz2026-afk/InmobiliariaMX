"use client";

import { useState, useEffect, useRef } from "react";
import { X, Play, Volume2, VolumeX } from "lucide-react";

interface GrillIntroVideoPopupProps {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  enabled?: boolean;
  footerText?: string;
  buttonText?: string;
}

export default function GrillIntroVideoPopup({
  videoUrl,
  posterUrl,
  title = "Cómo Funcionamos",
  enabled = true,
  footerText = "¿Listo para saborear la experiencia?",
  buttonText = "Entendido, Ver Menú",
}: GrillIntroVideoPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!enabled || !videoUrl) return;

    // Check sessionStorage to show once per session
    const hasSeenPopup = sessionStorage.getItem("grill_intro_video_shown");
    if (!hasSeenPopup) {
      setIsOpen(true);
      // Wait for a small user interaction or gesture to try playing
      const handleUserGesture = () => {
        if (videoRef.current) {
          videoRef.current.play().catch((err) => {
            console.log("Auto-play blocked by browser, playing muted:", err);
          });
        }
        window.removeEventListener("click", handleUserGesture);
        window.removeEventListener("touchstart", handleUserGesture);
      };
      window.addEventListener("click", handleUserGesture);
      window.addEventListener("touchstart", handleUserGesture);
    }
  }, [enabled, videoUrl]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("grill_intro_video_shown", "true");
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  if (!isOpen || !enabled || !videoUrl) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-in fade-in duration-300">
      {/* Background click to close */}
      <div className="absolute inset-0 cursor-default" onClick={handleClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-neutral-950 border border-gold-400/20 rounded-sm shadow-[0_20px_50px_rgba(212,175,55,0.15)] overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-350 my-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-gold-400/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
            <h3 className="font-serif text-xs sm:text-base font-bold text-white uppercase tracking-wider">
              {title}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-neutral-400 hover:text-gold-400 hover:bg-neutral-900 border border-transparent hover:border-gold-400/10 transition-all rounded-xs"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black group flex items-center justify-center overflow-hidden max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] shrink min-h-0">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            autoPlay
            playsInline
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-contain"
          />

          {/* Golden border frame overlay */}
          <div className="absolute inset-0 border border-gold-400/10 m-3 pointer-events-none rounded-xs z-10" />

          {/* Quick Play & Mute Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 rounded-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="p-2 bg-gold-400 hover:bg-gold-500 text-black rounded-full transition-all"
              >
                {isPlaying ? <span className="block w-2.5 h-2.5 bg-black" style={{ clipPath: "polygon(0 0, 30% 0, 30% 100%, 0 100%, 0 0, 70% 0, 70% 100%, 100% 100%, 100% 0)" }} /> : <Play className="w-2.5 h-2.5 fill-black text-black" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="p-2 bg-neutral-900/80 hover:bg-neutral-800 text-gold-400 border border-gold-400/15 rounded-full transition-all"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
            
            <span className="text-[10px] text-neutral-400 tracking-wider font-light">
              Haz clic para activar el audio 🔊
            </span>
          </div>
          
          {/* Central Play/Unmute Floating Guide */}
          {isMuted && (
            <button
              onClick={toggleMute}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2.5 bg-black/80 hover:bg-black border border-gold-400/30 text-gold-400 hover:text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xl transition-all duration-300 scale-95 hover:scale-100 animate-bounce z-20"
            >
              <Volume2 className="w-4 h-4" />
              Activar Sonido
            </button>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gold-400/10 flex items-center justify-between bg-black/40 text-[10px] sm:text-xs shrink-0">
          <p className="text-neutral-400 font-light truncate mr-2">
            {footerText}
          </p>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 sm:px-5 sm:py-2 bg-gold-400 hover:bg-gold-500 text-black font-bold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-md shadow-gold-400/10 hover:scale-102 flex-shrink-0"
          >
            {buttonText}
          </button>
        </div>

      </div>
    </div>
  );
}
