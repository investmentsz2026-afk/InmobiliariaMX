"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Star, ShoppingCart, X, Check, Flame, Sparkles, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGrillCartStore } from "@/lib/grillCartStore";
import SectionDivider from "./SectionDivider";

interface FavoriteItem {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  description: string;
}

interface GrillFavoritesProps {
  favorites: FavoriteItem[];
  title: string;
  buttonText: string;
}

export default function GrillFavorites({ favorites, title, buttonText }: GrillFavoritesProps) {
  const { addItem } = useGrillCartStore();
  const [selectedItem, setSelectedItem] = useState<FavoriteItem | null>(null);
  const [mounted, setMounted] = useState(false);

  // Modal Customizer State
  const [doneness, setDoneness] = useState("Término Medio");
  const [side1, setSide1] = useState("Papa Asada al Carbón");
  const [side2, setSide2] = useState("Tortillas de Harina");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenCustomizer = (item: FavoriteItem) => {
    setSelectedItem(item);
    setDoneness("Término Medio");
    setSide1("Papa Asada al Carbón");
    setSide2("Tortillas de Harina");
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const categoryLower = selectedItem.category.toLowerCase();
    const isMeatOrParrillada =
      categoryLower.includes("corte") ||
      categoryLower.includes("parrillada") ||
      categoryLower.includes("bbq");
    const isSideHidden =
      categoryLower.includes("complemento") ||
      categoryLower.includes("embutido") ||
      categoryLower.includes("pizza") ||
      categoryLower.includes("entrada");

    addItem({
      productId: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      doneness: isMeatOrParrillada ? doneness : undefined,
      side1: !isSideHidden ? side1 : undefined,
      side2: !isSideHidden ? side2 : undefined,
      imageUrl: selectedItem.image,
    });

    setSelectedItem(null);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 relative z-10 py-12">
      <SectionDivider title={title} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {favorites.map((fav, idx) => (
          <div
            key={fav.id || idx}
            className="bg-black border border-gold-400/10 hover:border-gold-400/35 p-4 rounded-sm shadow-xl transition-all duration-300 text-center flex flex-col justify-between group hover:-translate-y-1"
          >
            <div>
              {/* Crop-designed image */}
              <div className="relative aspect-square w-full rounded-sm overflow-hidden mb-4 border border-white/5">
                <img
                  src={fav.image}
                  alt={fav.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Category label badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 border border-gold-400/20 text-gold-400 text-[8px] font-bold uppercase tracking-widest rounded-xs">
                  {fav.category}
                </span>
              </div>

              {/* Serif title */}
              <h3 className="font-serif text-base sm:text-lg font-bold text-white uppercase tracking-wider group-hover:text-gold-400 transition-colors line-clamp-1">
                {fav.name}
              </h3>

              {/* Price Tag */}
              <p className="text-sm font-serif font-black text-gold-400 mt-1">
                ${fav.price} MXN
              </p>

              {/* Description preview */}
              <p className="text-[11px] text-neutral-400 font-normal mt-2 line-clamp-2 min-h-[32px] px-1">
                {fav.description}
              </p>

              {/* 5 gold stars */}
              <div className="flex items-center justify-center gap-1 mt-3 select-none">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => handleOpenCustomizer(fav)}
                className="w-full py-2 bg-gold-400 border border-gold-400 text-black hover:bg-gold-500 hover:border-gold-500 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Ordenar Platillo
              </button>
              
              <a
                href="#menu-section"
                className="inline-block w-full py-2 bg-transparent border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white text-[9px] font-bold uppercase tracking-widest transition-all duration-300 rounded-xs"
              >
                Ver Todo el Menú
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom outlined gold button */}
      <div className="text-center mt-10">
        <a
          href="#menu-section"
          className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-gold-400/60 hover:border-gold-400 text-gold-400 hover:text-black hover:bg-gold-400 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer"
        >
          {buttonText}
        </a>
      </div>

      {/* INTERACTIVE CUSTOMIZER MODAL */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedItem && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedItem(null)}
                className="absolute inset-0 bg-black/75 backdrop-blur-md"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-full max-w-4xl bg-black border border-gold-400/20 rounded-sm overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row h-[88vh] md:h-[600px]"
              >
                {/* Premium Top Line Accent for whole container */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent z-30 md:hidden" />

                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-40 p-2 text-neutral-200 hover:text-gold-400 bg-black/60 backdrop-blur-md border border-neutral-850 hover:border-gold-400/30 rounded-full transition-all hover:scale-105 cursor-pointer animate-fade-in"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* LEFT COLUMN: Large cinematic image */}
                <div className="w-full md:w-1/2 h-[220px] md:h-full relative overflow-hidden flex-shrink-0 bg-neutral-950">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Visual Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent hidden md:block" />

                  {/* Overlaid details */}
                  <div className="absolute bottom-5 left-5 right-5 z-20 text-left">
                    <span className="px-2 py-0.5 bg-red-700/90 text-white text-[8px] tracking-widest uppercase font-bold rounded-xs">
                      Especialidad Destacada
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1 text-shadow-md">
                      {selectedItem.name}
                    </h3>
                    <p className="text-lg font-serif font-bold text-gold-400 mt-0.5">
                      ${selectedItem.price} MXN
                    </p>
                  </div>
                </div>

                {/* RIGHT COLUMN: Options and Customizer */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-between bg-black min-h-0 text-left">
                  {/* Options Header */}
                  <div className="hidden md:flex justify-between items-center p-6 border-b border-neutral-850 bg-black">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold-400 font-bold">
                        Personalizar Pedido
                      </span>
                      <h4 className="font-serif text-xl font-semibold text-white mt-0.5">Opciones de Preparación</h4>
                    </div>
                  </div>

                  {/* Scrollable details and selectors */}
                  <div className="p-5 md:p-6 overflow-y-auto space-y-5 flex-grow min-h-0 custom-scrollbar">
                    {/* Product Description */}
                    <div className="space-y-1 bg-black border border-neutral-850 rounded-xs p-3.5">
                      <h5 className="text-[10px] sm:text-xs uppercase tracking-widest text-gold-400 font-bold">Descripción del Platillo</h5>
                      <p className="text-sm sm:text-base text-neutral-100 font-normal leading-relaxed">
                        {selectedItem.description}
                      </p>
                    </div>

                    {/* Conditionally Render Doneness Options */}
                    {(selectedItem.category.toLowerCase().includes("corte") ||
                      selectedItem.category.toLowerCase().includes("parrillada") ||
                      selectedItem.category.toLowerCase().includes("bbq")) && (
                      <div className="space-y-2">
                        <label className="block text-[10px] sm:text-xs uppercase tracking-widest text-gold-400 font-bold">
                          Término de la Carne
                        </label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {["Término Medio", "Tres Cuartos", "Bien Cocido", "Término Azul"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setDoneness(opt)}
                              className={`py-3 px-4 text-left border rounded-xs transition-all duration-200 flex items-center justify-between cursor-pointer text-xs sm:text-sm ${
                                doneness === opt
                                  ? "border-gold-400 bg-gold-950/20 text-white font-semibold shadow-[0_0_10px_rgba(255,188,0,0.08)]"
                                  : "border-neutral-850 bg-black text-neutral-300 hover:border-gold-400/30 hover:text-white"
                              }`}
                            >
                              <span>{opt}</span>
                              {doneness === opt && <Check className="w-3.5 h-3.5 text-gold-400" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sides Options (Hidden for simple items) */}
                    {!(selectedItem.category.toLowerCase().includes("complemento") ||
                      selectedItem.category.toLowerCase().includes("embutido") ||
                      selectedItem.category.toLowerCase().includes("pizza") ||
                      selectedItem.category.toLowerCase().includes("entrada")) && (
                      <>
                        {/* Side 1 */}
                        <div className="space-y-2">
                          <label className="block text-[10px] sm:text-xs uppercase tracking-widest text-gold-400 font-bold">
                            Primer Acompañamiento
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              "Papa Asada al Carbón",
                              "Queso Fundido con Chorizo",
                              "Guacamole Premium",
                              "Elote Asado"
                            ].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSide1(opt)}
                                className={`py-3 px-4 text-left border rounded-xs transition-all duration-200 flex flex-col justify-between h-[76px] cursor-pointer text-xs sm:text-sm ${
                                  side1 === opt
                                    ? "border-gold-400 bg-gold-950/20 text-white shadow-[0_0_10px_rgba(255,188,0,0.08)]"
                                    : "border-neutral-850 bg-black/30 text-neutral-300 hover:border-gold-400/30 hover:text-white"
                                }`}
                              >
                                <span className="text-xs sm:text-sm font-semibold leading-snug">{opt}</span>
                                {side1 === opt && <Check className="w-3.5 h-3.5 text-gold-400 self-end mt-1" />}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Side 2 */}
                        <div className="space-y-2">
                          <label className="block text-[10px] sm:text-xs uppercase tracking-widest text-gold-400 font-bold">
                            Segundo Acompañamiento
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              "Tortillas de Harina",
                              "Cebollitas Cambray",
                              "Chiles Toreados",
                              "Frijoles Charros"
                            ].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSide2(opt)}
                                className={`py-3 px-4 text-left border rounded-xs transition-all duration-200 flex flex-col justify-between h-[76px] cursor-pointer text-xs sm:text-sm ${
                                  side2 === opt
                                    ? "border-gold-400 bg-gold-950/20 text-white shadow-[0_0_10px_rgba(255,188,0,0.08)]"
                                    : "border-neutral-850 bg-black/30 text-neutral-300 hover:border-gold-400/30 hover:text-white"
                                }`}
                              >
                                <span className="text-xs sm:text-sm font-semibold leading-snug">{opt}</span>
                                {side2 === opt && <Check className="w-3.5 h-3.5 text-gold-400 self-end mt-1" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="p-5 md:p-6 bg-black border-t border-neutral-850 flex-shrink-0">
                    <button
                      onClick={handleAddToCart}
                      className="w-full py-3.5 bg-gold-400 hover:bg-gold-500 text-black text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-gold-400/20 cursor-pointer border-none hover:scale-[1.01]"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Agregar al Pedido
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
