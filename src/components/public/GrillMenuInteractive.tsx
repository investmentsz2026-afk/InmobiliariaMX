"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Flame, Compass, MessageSquare, Clock, MapPin, X, ArrowRight, HelpCircle, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  name: string;
  price: number;
  description: string;
  category: "corte" | "parrillada" | "papa" | "embutido" | "bbq" | "complemento";
  imageUrl?: string | null;
}

interface GrillProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "CORTE" | "PARRILLADA" | "PAPA" | "EMBUTIDO" | "BBQ" | "COMPLEMENTO";
  isActive: boolean;
  imageUrl?: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
} as const;

const columnVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring" as const, 
      stiffness: 80, 
      damping: 18 
    } 
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } }
} as const;

export default function GrillMenuInteractive() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [products, setProducts] = useState<GrillProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Modal Customizer State
  const [doneness, setDoneness] = useState("Término Medio");
  const [side1, setSide1] = useState("Papa Asada al Carbón");
  const [side2, setSide2] = useState("Tortillas de Harina");

  useEffect(() => {
    setMounted(true);
    const fetchGrillMenu = async () => {
      try {
        const res = await fetch("/api/grill");
        if (res.ok) {
          const data = await res.json();
          // Solo mostrar productos activos
          setProducts(data.filter((p: GrillProduct) => p.isActive));
        }
      } catch (err) {
        console.error("Error loading grill products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrillMenu();
  }, []);

  const getFilteredItems = (categories: ("CORTE" | "PARRILLADA" | "PAPA" | "EMBUTIDO" | "BBQ" | "COMPLEMENTO")[]): MenuItem[] => {
    return products
      .filter((p) => categories.includes(p.category))
      .map((p) => ({
        name: p.name,
        price: p.price,
        description: p.description,
        category: p.category.toLowerCase() as any,
        imageUrl: p.imageUrl,
      }));
  };

  const menuData = [
    {
      title: "Cortes al Carbón",
      subtitle: "LÍNEA DIRECTA AL FUEGO",
      items: getFilteredItems(["CORTE"]),
    },
    {
      title: "Parrilladas & Papas Rellenas",
      subtitle: "ESPECIALIDADES DE LA CASA",
      items: getFilteredItems(["PARRILLADA", "PAPA"]),
    },
    {
      title: "Acompañamientos & Ahumados",
      subtitle: "RECETAS URBANAS Y COMPLEMENTOS",
      items: getFilteredItems(["EMBUTIDO", "BBQ", "COMPLEMENTO"]),
    },
  ];

  const handleOpenCustomizer = (item: MenuItem) => {
    setSelectedItem(item);
    // Reset options
    setDoneness("Término Medio");
    setSide1("Papa Asada al Carbón");
    setSide2("Tortillas de Harina");
  };

  const handleWhatsAppSend = () => {
    if (!selectedItem) return;

    const isMeatOrParrillada = ["corte", "parrillada"].includes(selectedItem.category);
    
    // Customize text based on whether it needs Doneness choices
    const donenessText = isMeatOrParrillada ? `%0A*Término:* ${doneness}` : "";
    const sidesText = `%0A*Acompañamiento 1:* ${side1}%0A*Acompañamiento 2:* ${side2}`;

    const text = `Hola La Cava del Corte!%0A%0AMe gustaría ordenar de la *Zona Grill*:%0A%0A*Producto:* ${selectedItem.name}%0A*Precio:* $${selectedItem.price} MXN${donenessText}${sidesText}%0A%0A¿Me podrían confirmar disponibilidad y tiempo estimado?`;

    window.open(`https://wa.me/523222018003?text=${text}`, "_blank");
    setSelectedItem(null);
  };

  return (
    <div className="space-y-12">
      {/* Marquee Running Text Ribbon */}
      <div className="w-full overflow-hidden bg-black/40 border-y border-gold-400/10 py-3.5 relative flex items-center mb-6 shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
        <div className="animate-marquee whitespace-nowrap flex items-center text-[10px] sm:text-xs tracking-[0.2em] font-bold uppercase text-gold-400">
          <div className="flex shrink-0 gap-16 items-center px-8">
            <span className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-gold-400 animate-pulse fill-gold-400/20" /> LA CAVA DEL CORTE
            </span>
            <span className="text-white/30">•</span>
            <span className="text-white">LAS MEJORES CARNES AL CARBÓN</span>
            <span className="text-white/30">•</span>
            <span className="text-gold-400 font-extrabold">ZONA GRILL MODERNA</span>
            <span className="text-white/30">•</span>
            <span className="text-white">100% GANADO DE SONORA</span>
            <span className="text-white/30">•</span>
            <span className="text-gold-400">SABOR & JUGOSIDAD ÚNICA</span>
            <span className="text-white/30">•</span>
            <span className="text-white">PREMIUM SELECTION</span>
            <span className="text-white/30">•</span>
          </div>
          <div className="flex shrink-0 gap-16 items-center px-8" aria-hidden="true">
            <span className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-gold-400 animate-pulse fill-gold-400/20" /> LA CAVA DEL CORTE
            </span>
            <span className="text-white/30">•</span>
            <span className="text-white">LAS MEJORES CARNES AL CARBÓN</span>
            <span className="text-white/30">•</span>
            <span className="text-gold-400 font-extrabold">ZONA GRILL MODERNA</span>
            <span className="text-white/30">•</span>
            <span className="text-white">100% GANADO DE SONORA</span>
            <span className="text-white/30">•</span>
            <span className="text-gold-400">SABOR & JUGOSIDAD ÚNICA</span>
            <span className="text-white/30">•</span>
            <span className="text-white">PREMIUM SELECTION</span>
            <span className="text-white/30">•</span>
          </div>
        </div>
      </div>

      {/* Informative banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-r from-gold-900/20 via-gold-400/5 to-gold-900/20 border border-gold-400/20 rounded-md p-4 text-center max-w-2xl mx-auto mb-8 shadow-[0_4px_20px_rgba(197,168,128,0.05)]"
      >
        <p className="text-xs text-gold-300 font-light flex items-center justify-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0" />
          </motion.div>
          <span>Haz clic en cualquier platillo para personalizar tus complementos y ordenar por WhatsApp.</span>
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((colIdx) => (
            <div
              key={colIdx}
              className="space-y-8 bg-neutral-900/40 border border-white/5 p-8 rounded-sm relative overflow-hidden"
            >
              <div className="border-b border-gold-400/10 pb-4 space-y-2">
                <div className="h-3 w-20 bg-neutral-800 rounded-xs animate-pulse" />
                <div className="h-6 w-40 bg-neutral-800 rounded-xs animate-pulse" />
              </div>
              
              <div className="space-y-6">
                {[1, 2, 3, 4].map((itemIdx) => (
                  <div key={itemIdx} className="flex justify-between items-start p-2 -mx-2">
                    <div className="pr-4 flex-1 space-y-2">
                      <div className="h-4 w-1/2 bg-neutral-850 rounded-xs animate-pulse" />
                      <div className="h-3 w-5/6 bg-neutral-850 rounded-xs animate-pulse" />
                    </div>
                    <div className="h-4 w-12 bg-neutral-800 rounded-xs animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {menuData.map((col, index) => (
            <motion.div
              key={index}
              variants={columnVariants}
              className="space-y-8 bg-gradient-to-br from-[#121212] via-[#0d0d0d] to-[#070707] border border-white/5 p-8 rounded-sm relative overflow-hidden group hover:border-gold-400/30 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_40px_rgba(197,168,128,0.06)]"
            >
              {/* Premium Gold Line Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/2 rounded-bl-full pointer-events-none group-hover:bg-gold-400/5 transition-colors duration-300" />
              
              <div className="border-b border-gold-400/20 pb-5">
                <span className="text-[9px] uppercase text-gold-400 tracking-[0.2em] font-bold block">{col.subtitle}</span>
                <h2 className="font-serif text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white via-gold-50 to-gold-300 font-semibold mt-1.5 leading-snug">
                  {col.title}
                </h2>
              </div>
              
              <div className="space-y-6">
                {col.items.map((item, itemIdx) => (
                  <motion.div
                    key={itemIdx}
                    variants={itemVariants}
                    onClick={() => handleOpenCustomizer(item)}
                    className="flex items-center gap-4 group/item cursor-pointer p-3 -mx-3 hover:bg-white/[0.02] hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] border border-transparent hover:border-gold-400/10 rounded-sm transition-all duration-300"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-sm overflow-hidden border border-white/5 bg-neutral-950 flex-shrink-0 relative group-hover/item:border-gold-400/30 transition-colors duration-300">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a]">
                          <Flame className="w-6 h-6 text-neutral-700 group-hover/item:text-gold-400/60 transition-colors duration-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover/item:bg-transparent transition-colors duration-300" />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="text-sm font-semibold text-white group-hover/item:text-gold-400 transition-colors truncate">
                          {item.name}
                        </h3>
                        <span className="text-sm font-serif font-bold text-gold-400 whitespace-nowrap">
                          ${item.price}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-light mt-1 line-clamp-2 leading-relaxed group-hover/item:text-neutral-300 transition-colors">
                        {item.description}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                        <span className="text-[8px] bg-gold-400/10 text-gold-400 px-1.5 py-0.5 rounded-xs uppercase tracking-widest font-semibold flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Ver detalles y ordenar
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* CTA Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-16 bg-gradient-to-br from-[#121212] to-[#070707] border border-white/5 rounded-md p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gold-400/[0.01] pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-32 h-32 bg-gold-400/5 rounded-full blur-3xl" />
        
        <div className="space-y-3 relative z-10">
          <span className="px-2.5 py-1 bg-gold-400/10 border border-gold-400/20 text-gold-400 text-[9px] tracking-widest uppercase font-bold rounded-sm">
            Servicio para Llevar o a Domicilio
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white mt-2">¿Quieres hacer un pedido libre para este fin de semana?</h3>
          <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-lg">
            Escríbenos directamente por WhatsApp y te ayudamos a programar tu entrega rápida de carnes premium.
          </p>
        </div>
        
        <a
          href="https://wa.me/523222018003?text=Hola,%20quisiera%20hacer%20un%20pedido%20del%20menú%20de%20la%20Zona%20Grill."
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 shrink-0 px-6 py-4 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-obsidian text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center gap-2 shadow-lg shadow-gold-400/20 hover:scale-105 cursor-pointer border border-gold-300/10"
        >
          <MessageSquare className="w-4 h-4 text-obsidian" />
          Ordenar por WhatsApp
        </a>
      </motion.div>

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
              className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] z-10 flex flex-col md:flex-row h-[88vh] md:h-[600px]"
            >
              {/* Premium Top Line Accent for whole container (visible only on mobile if stacked) */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent z-30 md:hidden" />

              {/* Close Button - Glassmorphism, floating on top-right */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-40 p-2 text-white/70 hover:text-white bg-black/40 backdrop-blur-md border border-white/10 rounded-full transition-all hover:scale-105"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LEFT COLUMN: Large cinematic image */}
              <div className="w-full md:w-1/2 h-[220px] md:h-full relative overflow-hidden flex-shrink-0 bg-neutral-950">
                {selectedItem.imageUrl ? (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#161616] to-[#070707] p-8 text-center relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.05)_0%,transparent_70%)]" />
                    <Flame className="w-16 h-16 text-gold-400/20 mb-3 animate-pulse" />
                    <span className="font-serif text-lg text-neutral-400 uppercase tracking-widest font-semibold">La Cava del Corte</span>
                    <span className="text-[10px] text-neutral-600 uppercase tracking-widest mt-1">Zona Grill</span>
                  </div>
                )}
                
                {/* Visual Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent hidden md:block" />

                {/* Overlaid details on desktop or mobile image base */}
                <div className="absolute bottom-5 left-5 right-5 z-20">
                  <span className="px-2 py-0.5 bg-gold-400/10 border border-gold-400/20 text-gold-400 text-[8px] tracking-widest uppercase font-bold rounded-xs">
                    Especialidad de la Casa
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
              <div className="w-full md:w-1/2 h-full flex flex-col justify-between bg-[#0a0a0a] min-h-0">
                {/* Options Header - Desktop only (redundant on mobile since titles are on image) */}
                <div className="hidden md:flex justify-between items-center p-6 border-b border-white/5 bg-black/20">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-gold-400 font-bold">
                      Personalizar Pedido
                    </span>
                    <h4 className="font-serif text-lg font-semibold text-white mt-0.5">Opciones de Preparación</h4>
                  </div>
                </div>

                {/* Scrollable details and selectors */}
                <div className="p-5 md:p-6 overflow-y-auto space-y-5 flex-grow min-h-0 custom-scrollbar">
                  {/* Product Description */}
                  <div className="space-y-1 bg-white/[0.01] border border-white/5 rounded-xs p-3.5">
                    <h5 className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Descripción del Platillo</h5>
                    <p className="text-xs text-neutral-300 font-light leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Conditionally Render Doneness Options */}
                  {["corte", "parrillada"].includes(selectedItem.category) && (
                    <div className="space-y-2">
                      <label className="block text-[9px] uppercase tracking-widest text-gold-300 font-bold">
                        Término de la Carne
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {["Término Medio", "Tres Cuartos", "Bien Cocido", "Término Azul"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setDoneness(opt)}
                            className={`py-2 px-3 text-left border rounded-xs transition-all duration-200 flex items-center justify-between ${
                              doneness === opt
                                ? "border-gold-400 bg-gold-400/10 text-white font-medium shadow-[0_0_10px_rgba(197,168,128,0.1)]"
                                : "border-white/5 bg-black/40 text-neutral-400 hover:border-white/10 hover:text-neutral-200"
                            }`}
                          >
                            <span>{opt}</span>
                            {doneness === opt && <Check className="w-3.5 h-3.5 text-gold-400" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Side 1 (Complemento 1) */}
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase tracking-widest text-gold-300 font-bold">
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
                          className={`py-2 px-3 text-left border rounded-xs transition-all duration-200 flex flex-col justify-between h-[68px] ${
                            side1 === opt
                              ? "border-gold-400 bg-gold-400/10 text-white shadow-[0_0_10px_rgba(197,168,128,0.1)]"
                              : "border-white/5 bg-black/40 text-neutral-400 hover:border-white/10 hover:text-neutral-200"
                          }`}
                        >
                          <span className="text-[10px] font-medium leading-snug">{opt}</span>
                          {side1 === opt && <Check className="w-3.5 h-3.5 text-gold-400 self-end mt-1" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Side 2 (Complemento 2) */}
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase tracking-widest text-gold-300 font-bold">
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
                          className={`py-2 px-3 text-left border rounded-xs transition-all duration-200 flex flex-col justify-between h-[68px] ${
                            side2 === opt
                              ? "border-gold-400 bg-gold-400/10 text-white shadow-[0_0_10px_rgba(197,168,128,0.1)]"
                              : "border-white/5 bg-black/40 text-neutral-400 hover:border-white/10 hover:text-neutral-200"
                          }`}
                        >
                          <span className="text-[10px] font-medium leading-snug">{opt}</span>
                          {side2 === opt && <Check className="w-3.5 h-3.5 text-gold-400 self-end mt-1" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button at footer */}
                <div className="p-5 md:p-6 bg-black/40 border-t border-white/5 flex-shrink-0">
                  <button
                    onClick={handleWhatsAppSend}
                    className="w-full py-3.5 bg-[#25D366] hover:bg-[#1ebd54] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-[#25D366]/20 cursor-pointer border border-[#25D366]/20 hover:scale-[1.01]"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    Pedir por WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
