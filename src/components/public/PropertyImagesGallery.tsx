"use client";

import { useState } from "react";

interface ImageProps {
  id: string;
  url: string;
  isMain: boolean;
}

interface PropertyImagesGalleryProps {
  images: ImageProps[];
  title: string;
}

export default function PropertyImagesGallery({ images, title }: PropertyImagesGalleryProps) {
  // Sort images so the main one is first, or default to the first element
  const sortedImages = [...images].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
  const [activeImage, setActiveImage] = useState(
    sortedImages[0]?.url || "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
  );

  if (images.length === 0) {
    return (
      <div className="aspect-[16/10] w-full bg-gray-100 rounded-sm flex items-center justify-center border border-gray-100">
        <span className="text-xs text-gray-400">Sin imágenes disponibles</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active Main Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/10 border border-gray-100 rounded-sm shadow-md">
        <img
          src={activeImage}
          alt={title}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      {/* Thumbnails list */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {sortedImages.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img.url)}
              className={`relative aspect-[16/10] overflow-hidden rounded-xs border-2 transition-all duration-300 ${
                activeImage === img.url ? "border-gold-400 scale-98" : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={img.url}
                alt={`${title} miniatura`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
