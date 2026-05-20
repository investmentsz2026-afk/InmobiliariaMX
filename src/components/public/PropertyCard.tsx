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
    type: "CASA" | "TERRENO" | "DEPARTAMENTO" | "PROYECTO";
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

  const typeLabels: Record<string, string> = {
    CASA: "Cortes de Res (Carne Fría)",
    TERRENO: "Paquetes y Parrilladas",
    DEPARTAMENTO: "Embutidos Artesanales",
    PROYECTO: "Especialidades Grill",
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
    <article className="group bg-[#111111] border border-white/5 overflow-hidden flex flex-col justify-between h-full rounded-sm hover:border-gold-400/30 transition-all duration-500 hover:shadow-2xl">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <span className="px-3 py-1 bg-black/75 backdrop-blur-md text-[9px] text-gold-400 font-bold uppercase tracking-widest border border-gold-400/20 rounded-xs">
            {typeLabels[property.type]}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1 border text-[9px] font-bold uppercase tracking-widest rounded-xs ${statusColors[property.status]}`}>
            {statusLabels[property.status]}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-gold-400 font-medium">
            Origen: {property.location || `${property.city}, ${property.state}`}
          </span>
          <h3 className="font-serif text-lg text-white mt-1 group-hover:text-gold-400 transition-colors duration-300 font-semibold line-clamp-1">
            {property.title}
          </h3>
          <p className="font-serif text-gold-400 text-xl font-bold mt-2">
            {formatPrice(property.price)} <span className="text-xs text-gray-500 font-sans tracking-wide">MXN</span>
          </p>
        </div>

        {/* Info Grid specs */}
        <div className="border-t border-b border-white/5 py-4 my-4 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center">
            <Scale className="w-4 h-4 text-gray-500 mb-1" />
            <span className="text-xs font-semibold text-white">{getWeightText(property.m2Total)}</span>
            <span className="text-[8px] uppercase text-gray-500 tracking-wider font-bold">Peso Aprox</span>
          </div>

          <div className="flex flex-col items-center">
            <Layers className="w-4 h-4 text-gray-500 mb-1" />
            <span className="text-xs font-semibold text-white">{property.bedrooms ? `${property.bedrooms}"` : "Var."}</span>
            <span className="text-[8px] uppercase text-gray-500 tracking-wider font-bold">Grosor</span>
          </div>

          <div className="flex flex-col items-center">
            <Award className="w-4 h-4 text-gray-500 mb-1" />
            <span className="text-xs font-semibold text-white">
              {property.bathrooms ? (qualityLabels[property.bathrooms] || "Premium") : "Selección"}
            </span>
            <span className="text-[8px] uppercase text-gray-500 tracking-wider font-bold">Calidad</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {property.type !== "PROYECTO" ? (
            <Link
              href={`/propiedades/${property.slug}`}
              className="w-full py-2.5 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-1.5 shadow-md text-center cursor-pointer font-bold"
            >
              <Scale className="w-3.5 h-3.5" />
              Ver y Personalizar
            </Link>
          ) : (
            <Link
              href={`/propiedades/${property.slug}`}
              className="w-full py-2.5 bg-transparent border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-obsidian text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-1.5 shadow-md text-center cursor-pointer font-bold"
            >
              Personalizar y Pedir
            </Link>
          )}

          <Link
            href={`/propiedades/${property.slug}`}
            className="flex items-center justify-between text-[10px] tracking-widest uppercase text-neutral-400 hover:text-white transition-colors duration-300 pt-1 font-semibold"
          >
            <span>Ver Ficha Técnica</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 text-gold-400" />
          </Link>
        </div>
      </div>
    </article>
  );
}
