"use client";

import { useState } from "react";
import PropertyCard from "./PropertyCard";
import { Flame, Beef, Award, Sparkles, UtensilsCrossed } from "lucide-react";

interface ImageProps {
  id: string;
  url: string;
  isMain: boolean;
}

interface Product {
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
  type: "CASA" | "TERRENO" | "DEPARTAMENTO" | "PROYECTO";
  status: "DISPONIBLE" | "RESERVADO" | "VENDIDO";
  featured: boolean;
  images: ImageProps[];
}

interface ProductCatalogHomeProps {
  products: Product[];
}

type TabType = "ALL" | "CASA" | "TERRENO" | "DEPARTAMENTO" | "PROYECTO";

export default function ProductCatalogHome({ products }: ProductCatalogHomeProps) {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");

  const tabs = [
    { id: "ALL" as const, label: "Todos", icon: Sparkles },
    { id: "CASA" as const, label: "Cortes de Res", icon: Beef },
    { id: "TERRENO" as const, label: "Paquetes & Parrilladas", icon: UtensilsCrossed },
    { id: "DEPARTAMENTO" as const, label: "Embutidos", icon: Award },
    { id: "PROYECTO" as const, label: "Especialidades Grill", icon: Flame },
  ];

  const filteredProducts = activeTab === "ALL" 
    ? products 
    : products.filter(p => p.type === activeTab);

  return (
    <div className="space-y-12">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-white/5 pb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-semibold border rounded-sm transition-all duration-350 cursor-pointer ${
                isActive
                  ? "border-gold-400 bg-gold-400/10 text-gold-400 font-bold"
                  : "border-white/5 bg-white/5 text-neutral-400 hover:text-white hover:border-white/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-sm bg-black/20">
          <p className="text-sm text-neutral-500 font-light max-w-md mx-auto">
            Pronto tendremos más productos disponibles en esta categoría. Pregunta en tienda o escríbenos por WhatsApp.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="h-full">
              <PropertyCard property={product as any} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
