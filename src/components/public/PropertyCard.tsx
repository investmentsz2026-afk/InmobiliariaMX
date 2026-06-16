"use client";

import Link from "next/link";
import { Scale, Layers, Award, ArrowRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";

interface ImageProps {
  id: string;
  url: string;
  isMain: boolean;
}

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    slug: string;
    price: number;
    location: string;
    city: string;
    state: string;
    m2Total: number;
    bedrooms: number | null;
    bathrooms: number | null;
    parkingSpaces: number | null;
    type: string;
    status: "DISPONIBLE" | "RESERVADO" | "VENDIDO";
    images: ImageProps[];
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { addItem } = useCartStore();
  const mainImage = property.images.find((img) => img.isMain)?.url || property.images[0]?.url || "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80";

  // Formatter for currency
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statusColors: Record<string, string> = {
    DISPONIBLE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    RESERVADO: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    VENDIDO: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  const statusLabels: Record<string, string> = {
    DISPONIBLE: "Disponible",
    RESERVADO: "Agotado",
    VENDIDO: "Agotado",
  };

  const qualityLabels: Record<number, string> = {
    1: "U.S. Choice",
    2: "U.S. Prime",
    3: "Wagyu / A5",
    4: "Sonora Premium",
  };

  const getWeightText = (val: number) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)} kg`;
    }
    return `${val} g`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: property.id,
      title: property.title,
      price: property.price,
      image: mainImage,
      weight: property.m2Total,
    });
  };

  return (
    <article className="group bg-white border border-neutral-200 overflow-hidden flex flex-col justify-between h-full rounded-sm hover:border-[#b01e28]/45 transition-all duration-500 hover:shadow-2xl">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[9px] text-neutral-800 font-bold uppercase tracking-widest border border-neutral-200 rounded-xs">
            {property.type}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1 border text-[9px] font-bold uppercase tracking-widest rounded-xs ${statusColors[property.status]}`}>
            {statusLabels[property.status]}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6 flex-grow flex flex-col justify-between text-neutral-900">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#b01e28] font-semibold">
            Origen: {property.location || `${property.city}, ${property.state}`}
          </span>
          <h3 className="font-serif text-lg text-neutral-900 mt-1 group-hover:text-[#b01e28] transition-colors duration-300 font-semibold line-clamp-1">
            {property.title}
          </h3>
          <p className="font-serif text-[#b01e28] text-xl font-bold mt-2">
            {formatPrice(property.price)} <span className="text-xs text-neutral-400 font-sans tracking-wide">MXN</span>
          </p>
        </div>

        {/* Info Grid specs */}
        <div className="border-t border-b border-neutral-200/60 py-4 my-4 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center">
            <Scale className="w-4 h-4 text-neutral-400 mb-1" />
            <span className="text-xs font-semibold text-neutral-800">{getWeightText(property.m2Total)}</span>
            <span className="text-[8px] uppercase text-neutral-450 tracking-wider font-bold">Peso Aprox</span>
          </div>

          <div className="flex flex-col items-center">
            <Layers className="w-4 h-4 text-neutral-400 mb-1" />
            <span className="text-xs font-semibold text-neutral-800">{property.bedrooms ? `${property.bedrooms}"` : "Var."}</span>
            <span className="text-[8px] uppercase text-neutral-450 tracking-wider font-bold">Grosor</span>
          </div>

          <div className="flex flex-col items-center">
            <Award className="w-4 h-4 text-neutral-400 mb-1" />
            <span className="text-xs font-semibold text-neutral-800">
              {property.bathrooms ? (qualityLabels[property.bathrooms] || "Premium") : "Selección"}
            </span>
            <span className="text-[8px] uppercase text-neutral-450 tracking-wider font-bold">Calidad</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {!property.type.toLowerCase().includes("grill") && !property.type.toLowerCase().includes("especialidad") ? (
            <Link
              href={`/propiedades/${property.slug}`}
              className="w-full py-2.5 bg-[#b01e28] hover:bg-[#91181f] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-1.5 shadow-sm text-center cursor-pointer font-bold"
            >
              <Scale className="w-3.5 h-3.5" />
              Ver y Personalizar
            </Link>
          ) : (
            <Link
              href={`/propiedades/${property.slug}`}
              className="w-full py-2.5 bg-transparent border border-[#b01e28] text-[#b01e28] hover:bg-[#b01e28] hover:text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-1.5 shadow-sm text-center cursor-pointer font-bold"
            >
              Personalizar y Pedir
            </Link>
          )}

          <Link
            href={`/propiedades/${property.slug}`}
            className="flex items-center justify-between text-[10px] tracking-widest uppercase text-neutral-500 hover:text-[#b01e28] transition-colors duration-300 pt-1 font-semibold"
          >
            <span>Ver Ficha Técnica</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 text-[#b01e28]" />
          </Link>
        </div>
      </div>
    </article>
  );
}
