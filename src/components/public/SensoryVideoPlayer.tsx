"use client";

import React, { useEffect, useRef, useState } from "react";

interface SensoryVideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  className?: string;
}

export default function SensoryVideoPlayer({
  videoUrl,
  posterUrl,
  className = "w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500",
}: SensoryVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting);
          if (entry.isIntersecting) {
            // Play unmuted when in view
            video.muted = false;
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch((err) => {
                console.warn("Sensory unmuted autoplay blocked, playing muted fallback:", err);
                video.muted = true;
                video.play().catch(() => {});
              });
            }
          } else {
            // Silence and pause when out of view
            video.muted = true;
            video.pause();
          }
        });
      },
      {
        threshold: 0.25, // Trigger when 25% of the video element is visible
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [videoUrl]);

  // Sync unmute when the user clicks or scrolls inside the page
  useEffect(() => {
    const handleInteraction = () => {
      if (videoRef.current && isIntersecting) {
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
  }, [isIntersecting]);

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      poster={posterUrl}
      autoPlay
      loop
      playsInline
      controls
      className={className}
    >
      Tu navegador no soporta reproducción de video.
    </video>
  );
}
