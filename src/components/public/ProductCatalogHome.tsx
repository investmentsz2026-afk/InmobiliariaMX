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
  type: string;
  status: "DISPONIBLE" | "RESERVADO" | "VENDIDO";
  featured: boolean;
  images: ImageProps[];
}

interface CategoryProps {
  id: string;
  name: string;
}

interface ProductCatalogHomeProps {
  products: Product[];
  categories: CategoryProps[];
}

const getCategoryIcon = (catName: string) => {
  const norm = catName.toLowerCase().trim();
  if (norm.includes("corte") || norm.includes("res") || norm.includes("carne")) return Beef;
  if (norm.includes("paquete") || norm.includes("parrillada")) return UtensilsCrossed;
  if (norm.includes("embutido") || norm.includes("chorizo") || norm.includes("chistorra")) return Award;
  if (norm.includes("especialidad") || norm.includes("grill") || norm.includes("brasa") || norm.includes("caliente")) return Flame;
  return Sparkles;
};

export default function ProductCatalogHome({ products, categories = [] }: ProductCatalogHomeProps) {
  const [activeTab, setActiveTab] = useState<string>("ALL");

  // Only show products whose category matches one of the official managed categories
  const activeProducts = products.filter(p => categories.some(c => c.name === p.type));

  const tabs = [
    { id: "ALL", label: "Todos", icon: Sparkles },
    ...categories.map((c) => ({
      id: c.name,
      label: c.name,
      icon: getCategoryIcon(c.name),
    })),
  ];

  const filteredProducts = activeTab === "ALL" 
    ? activeProducts 
    : activeProducts.filter(p => p.type === activeTab);

  return (
    <div className="space-y-12">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-neutral-200/80 pb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-semibold border rounded-sm transition-all duration-350 cursor-pointer ${
                isActive
                  ? "border-[#b01e28] bg-[#b01e28]/5 text-[#b01e28] font-bold"
                  : "border-neutral-200 bg-white text-neutral-500 hover:text-neutral-900 hover:border-neutral-350"
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
        <div className="text-center py-20 border border-dashed border-neutral-200 rounded-sm bg-white shadow-sm">
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
