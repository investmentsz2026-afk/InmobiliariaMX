"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/public/PropertyCard";
import { Search, SlidersHorizontal, Loader2, X, RefreshCw } from "lucide-react";

interface Property {
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
  images: Array<{ id: string; url: string; isMain: boolean }>;
}

export default function PropertiesCatalog() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (type) queryParams.append("type", type);
      if (status) queryParams.append("status", status);
      if (minPrice) queryParams.append("minPrice", minPrice);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);

      const response = await fetch(`/api/properties?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search trigger or fetch on filter change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProperties();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, type, status, minPrice, maxPrice]);

  const clearFilters = () => {
    setSearch("");
    setType("");
    setStatus("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="w-full">
      {/* Search and Filters panel */}
      <div className="bg-[#111111] border border-white/5 p-6 mb-12 rounded-sm text-white space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por título, ubicación o palabras clave..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-3.5 pl-11 pr-4 text-sm outline-none transition-all duration-300 rounded-sm placeholder-gray-500"
            />
          </div>
          
          <button
            onClick={clearFilters}
            className="w-full md:w-auto px-5 py-3 border border-white/10 hover:border-gold-400 text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Limpiar Filtros
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-white/5">
          {/* Property Type Filter */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Categoría de Corte</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-3 px-3 text-sm outline-none transition-all duration-300 rounded-sm text-white"
            >
              <option value="">Todas las categorías</option>
              <option value="CASA">Cortes de Res (Carne Fría)</option>
              <option value="TERRENO">Paquetes y Parrilladas</option>
              <option value="DEPARTAMENTO">Embutidos Artesanales</option>
              <option value="PROYECTO">Especialidades Grill</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Disponibilidad</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-3 px-3 text-sm outline-none transition-all duration-300 rounded-sm text-white"
            >
              <option value="">Cualquier estado</option>
              <option value="DISPONIBLE">Disponibles</option>
              <option value="RESERVADO">Agotados</option>
            </select>
          </div>

          {/* Min Price Filter */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Precio Mínimo (MXN)</label>
            <input
              type="number"
              placeholder="Ej. 100"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-3 px-3 text-sm outline-none transition-all duration-300 rounded-sm placeholder-gray-600 text-white"
            />
          </div>

          {/* Max Price Filter */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Precio Máximo (MXN)</label>
            <input
              type="number"
              placeholder="Ej. 1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-3 px-3 text-sm outline-none transition-all duration-300 rounded-sm placeholder-gray-600 text-white"
            />
          </div>
        </div>
      </div>

      {/* Properties list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-gold-400 animate-spin" />
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">Buscando cortes...</span>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-sm">
          <X className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-white font-semibold mb-2">No se encontraron productos</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
            No encontramos cortes que coincidan con tus criterios de búsqueda. Intenta modificar tus filtros o limpiar la búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property as any} />
          ))}
        </div>
      )}
    </div>
  );
}
