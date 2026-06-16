"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Flame, Compass, MessageSquare, Clock, MapPin, X, ArrowRight, HelpCircle, Sparkles, Check, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGrillCartStore } from "@/lib/grillCartStore";

interface MenuItem {
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl?: string | null;
}

interface GrillProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  imageUrl?: string | null;
}

interface CustomCategory {
  id: string;
  name: string;
  target: string;
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

const getCategoryMetadata = (catName: string) => {
  const norm = catName.toLowerCase().trim();
  if (norm.includes("corte")) {
    return {
      subtitle: "LÍNEA DIRECTA AL FUEGO",
      description: "Cortes selectos asados al carbón de mezquite natural para obtener una jugosidad y sellado incomparables."
    };
  }
  if (norm.includes("parrillada")) {
    return {
      subtitle: "PARA COMPARTIR EN FAMILIA",
      description: "Las mejores reuniones comienzan con una buena parrillada. Incluyen guarniciones calientes, cebollitas asadas y salsas de la casa."
    };
  }
  if (norm.includes("quesa") || norm.includes("pizza")) {
    return {
      subtitle: "ESPECIALIDADES A LAS BRASAS",
      description: "Nuestras deliciosas quesadillas gigantes doradas al carbón y pizzas artesanales cocidas a la parrilla."
    };
  }
  if (norm.includes("papa")) {
    return {
      subtitle: "LA CONSENTIDA DE LA CASA",
      description: "Delicioso puré elaborado a base de papa, mantequilla fina y la receta secreta, gratinado con queso fundido y preparado al momento."
    };
  }
  if (norm.includes("complemento") || norm.includes("especialidad")) {
    return {
      subtitle: "EL ACOMPAÑAMIENTO PERFECTO",
      description: "Cazuelas de queso fundido, guacamole fresco de la casa preparado al momento y elotes asados."
    };
  }
  if (norm.includes("embutido")) {
    return {
      subtitle: "ENTRADAS ARTESANALES",
      description: "Fina selección de embutidos tradicionales para abrir el apetito en la parrilla."
    };
  }
  return {
    subtitle: "ESPECIALIDAD DEL GRILL",
    description: "Preparados al momento con la calidad única que caracteriza a nuestra cocina."
  };
};

export default function GrillMenuInteractive() {
  const { addItem } = useGrillCartStore();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [products, setProducts] = useState<GrillProduct[]>([]);
  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Modal Customizer State
  const [doneness, setDoneness] = useState("Término Medio");
  const [side1, setSide1] = useState("Papa Asada al Carbón");
  const [side2, setSide2] = useState("Tortillas de Harina");

  useEffect(() => {
    setMounted(true);
    const fetchGrillMenuAndCategories = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/grill"),
          fetch("/api/categories?target=GRILL")
        ]);

        if (prodRes.ok && catRes.ok) {
          const prodData = await prodRes.json();
          const catData = await catRes.json();
          setProducts(prodData.filter((p: GrillProduct) => p.isActive));
          setCategories(catData);
        }
      } catch (err) {
        console.error("Error loading grill products and categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrillMenuAndCategories();
  }, []);

  const menuData = categories.map((cat) => {
    const items = products
      .filter((p) => p.category === cat.name)
      .map((p) => ({
        name: p.name,
        price: p.price,
        description: p.description,
        category: p.category,
        imageUrl: p.imageUrl,
      }));
    const meta = getCategoryMetadata(cat.name);
    return {
      title: cat.name,
      subtitle: meta.subtitle,
      description: meta.description,
      items,
    };
  });

  const handleOpenCustomizer = (item: MenuItem) => {
    setSelectedItem(item);
    setDoneness("Término Medio");
    setSide1("Papa Asada al Carbón");
    setSide2("Tortillas de Harina");
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const categoryLower = selectedItem.category.toLowerCase();
    const isMeatOrParrillada = categoryLower.includes("corte") || categoryLower.includes("parrillada") || categoryLower.includes("bbq");
    const isSideHidden = categoryLower.includes("complemento") || categoryLower.includes("embutido") || categoryLower.includes("pizza") || categoryLower.includes("entrada");

    const matchedProduct = products.find((p) => p.name === selectedItem.name);
    const productId = matchedProduct?.id || selectedItem.name;

    addItem({
      productId,
      name: selectedItem.name,
      price: selectedItem.price,
      doneness: isMeatOrParrillada ? doneness : undefined,
      side1: !isSideHidden ? side1 : undefined,
      side2: !isSideHidden ? side2 : undefined,
      imageUrl: selectedItem.imageUrl,
    });

    setSelectedItem(null);
  };

  return (
    <div className="space-y-12">
      {/* Marquee Running Text Ribbon */}
      <div className="w-full overflow-hidden bg-red-950/45 border-y border-gold-400/20 py-3.5 relative flex items-center mb-6 shadow-sm">
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#050000] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#050000] to-transparent z-10 pointer-events-none" />
        <div className="animate-marquee whitespace-nowrap flex items-center text-[10px] sm:text-xs tracking-[0.2em] font-bold uppercase text-gold-400">
          <div className="flex shrink-0 gap-16 items-center px-8">
            <span className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse fill-red-500/10" /> LA CAVA DEL CORTE
            </span>
            <span className="text-red-500/30">•</span>
            <span className="text-neutral-200">LAS MEJORES CARNES AL CARBÓN</span>
            <span className="text-red-500/30">•</span>
            <span className="text-gold-300 font-extrabold">ZONA GRILL RESTAURANTE</span>
            <span className="text-red-500/30">•</span>
            <span className="text-neutral-200">100% GANADO DE SONORA</span>
            <span className="text-red-500/30">•</span>
            <span className="text-red-400">SABOR & JUGOSIDAD ÚNICA</span>
            <span className="text-red-500/30">•</span>
            <span className="text-neutral-200">PREMIUM SELECTION</span>
            <span className="text-red-500/30">•</span>
          </div>
          <div className="flex shrink-0 gap-16 items-center px-8" aria-hidden="true">
            <span className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse fill-red-500/10" /> LA CAVA DEL CORTE
            </span>
            <span className="text-red-500/30">•</span>
            <span className="text-neutral-200">LAS MEJORES CARNES AL CARBÓN</span>
            <span className="text-red-500/30">•</span>
            <span className="text-gold-300 font-extrabold">ZONA GRILL RESTAURANTE</span>
            <span className="text-red-500/30">•</span>
            <span className="text-neutral-200">100% GANADO DE SONORA</span>
            <span className="text-red-500/30">•</span>
            <span className="text-red-400">SABOR & JUGOSIDAD ÚNICA</span>
            <span className="text-red-500/30">•</span>
            <span className="text-neutral-200">PREMIUM SELECTION</span>
            <span className="text-red-500/30">•</span>
          </div>
        </div>
      </div>

      {/* Informative banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-r from-red-950/50 via-gold-500/5 to-red-950/50 border border-gold-400/20 rounded-md p-4 text-center max-w-2xl mx-auto mb-8 shadow-xs"
      >
        <p className="text-xs text-gold-300 font-medium flex items-center justify-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Sparkles className="w-4 h-4 text-red-500 flex-shrink-0" />
          </motion.div>
          <span>Haz clic en cualquier platillo para personalizar tus complementos y ordenar por WhatsApp.</span>
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((colIdx) => (
            <div
              key={colIdx}
              className="space-y-8 bg-[#0c0202]/60 border border-red-950/40 p-8 rounded-sm relative overflow-hidden shadow-sm"
            >
              <div className="border-b border-red-950/40 pb-4 space-y-2">
                <div className="h-3 w-20 bg-neutral-800 rounded-xs animate-pulse" />
                <div className="h-6 w-40 bg-neutral-800 rounded-xs animate-pulse" />
              </div>
              
              <div className="space-y-6">
                {[1, 2, 3, 4].map((itemIdx) => (
                  <div key={itemIdx} className="flex justify-between items-start p-2 -mx-2">
                    <div className="pr-4 flex-1 space-y-2">
                      <div className="h-4 w-1/2 bg-neutral-800 rounded-xs animate-pulse" />
                      <div className="h-3 w-5/6 bg-neutral-800/60 rounded-xs animate-pulse" />
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
          className="space-y-16"
        >
          {menuData.map((section, index) => {
            if (section.items.length === 0) return null;

            return (
              <motion.div
                key={index}
                variants={columnVariants}
                className="space-y-6 text-left"
              >
                {/* Header de la Sección */}
                <div className="relative border-b border-red-950/45 pb-4">
                  <span className="text-[10px] uppercase text-red-500 tracking-[0.25em] font-bold block">
                    {section.subtitle}
                  </span>
                  <h2 className="font-serif text-3xl text-gold-400 font-bold mt-1.5 leading-snug">
                    {section.title}
                  </h2>
                  <p className="text-xs text-neutral-400 max-w-2xl font-light mt-1">
                    {section.description}
                  </p>
                  <div className="absolute bottom-0 left-0 w-24 h-[2px] bg-gold-500/50" />
                </div>

                {/* Grilla de Platillos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, itemIdx) => (
                    <motion.div
                      key={itemIdx}
                      variants={itemVariants}
                      onClick={() => handleOpenCustomizer(item)}
                      className="flex items-center gap-4 group/item cursor-pointer p-3.5 bg-[#0c0202]/60 hover:bg-[#1a0505]/45 border border-red-950/45 hover:border-gold-500/20 rounded-sm transition-all duration-300 shadow-md hover:shadow-[0_8px_30px_rgba(220,38,38,0.06)]"
                    >
                      {/* Thumbnail Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-sm overflow-hidden border border-red-950/45 bg-neutral-900/60 flex-shrink-0 relative group-hover/item:border-gold-500/30 transition-colors duration-300">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#120202] to-[#0a0101]">
                            <Flame className="w-6 h-6 text-neutral-600 group-hover/item:text-red-500 transition-colors duration-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/5 group-hover/item:bg-transparent transition-colors duration-300" />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <h3 className="text-sm font-semibold text-white group-hover/item:text-gold-400 transition-colors truncate">
                            {item.name}
                          </h3>
                          <span className="text-sm font-serif font-extrabold text-gold-400 whitespace-nowrap">
                            ${item.price}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 font-light mt-1 line-clamp-2 leading-relaxed group-hover/item:text-neutral-250 transition-colors">
                          {item.description}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                          <span className="text-[8px] bg-red-500/15 text-red-400 border border-red-500/10 px-1.5 py-0.5 rounded-xs uppercase tracking-widest font-semibold flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Ver detalles y ordenar
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* CTA Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-16 bg-gradient-to-br from-[#120202]/90 to-[#0a0101]/95 border border-red-500/10 rounded-md p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden shadow-md"
      >
        <div className="absolute inset-0 bg-red-500/[0.02] pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-32 h-32 bg-red-650/5 rounded-full blur-3xl" />
        
        <div className="space-y-3 relative z-10">
          <span className="px-2.5 py-1 bg-red-600/15 border border-red-500/20 text-red-400 text-[9px] tracking-widest uppercase font-bold rounded-sm">
            Servicio para Llevar o a Domicilio
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white mt-2">¿Quieres hacer un pedido libre para este fin de semana?</h3>
          <p className="text-xs text-neutral-300 font-light leading-relaxed max-w-lg">
            Escríbenos directamente por WhatsApp y te ayudamos a programar tu entrega rápida de carnes premium.
          </p>
        </div>
        
        <a
          href="https://wa.me/523222018003?text=Hola,%20quisiera%20hacer%20un%20pedido%20del%20menú%20de%20la%20Zona%20Grill."
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 shrink-0 px-6 py-4 bg-gradient-to-r from-red-700 to-red-650 hover:from-red-650 hover:to-red-600 text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center gap-2 shadow-lg shadow-red-900/30 hover:scale-105 cursor-pointer border border-gold-500/10"
        >
          <MessageSquare className="w-4 h-4 text-white" />
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
              className="relative w-full max-w-4xl bg-[#0b0101] border border-red-500/20 rounded-sm overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row h-[88vh] md:h-[600px]"
            >
              {/* Premium Top Line Accent for whole container (visible only on mobile if stacked) */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-650 to-transparent z-30 md:hidden" />

              {/* Close Button - Glassmorphism, floating on top-right */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-40 p-2 text-neutral-200 hover:text-red-500 bg-black/60 backdrop-blur-md border border-red-950/40 hover:border-gold-500/30 rounded-full transition-all hover:scale-105"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LEFT COLUMN: Large cinematic image */}
              <div className="w-full md:w-1/2 h-[220px] md:h-full relative overflow-hidden flex-shrink-0 bg-neutral-900">
                {selectedItem.imageUrl ? (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0505] to-[#050000] p-8 text-center relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.05)_0%,transparent_70%)]" />
                    <Flame className="w-16 h-16 text-red-500/25 mb-3 animate-pulse" />
                    <span className="font-serif text-lg text-gold-400 uppercase tracking-widest font-semibold">La Cava del Corte</span>
                    <span className="text-[10px] text-red-400/80 uppercase tracking-widest mt-1">Zona Grill</span>
                  </div>
                )}
                
                {/* Visual Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent hidden md:block" />

                {/* Overlaid details on desktop or mobile image base */}
                <div className="absolute bottom-5 left-5 right-5 z-20 text-left">
                  <span className="px-2 py-0.5 bg-red-700/90 text-white text-[8px] tracking-widest uppercase font-bold rounded-xs">
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
              <div className="w-full md:w-1/2 h-full flex flex-col justify-between bg-[#0d0101] min-h-0 text-left">
                {/* Options Header - Desktop only (redundant on mobile since titles are on image) */}
                <div className="hidden md:flex justify-between items-center p-6 border-b border-red-950/50 bg-[#0f0202]/70">
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-red-500 font-bold">
                      Personalizar Pedido
                    </span>
                    <h4 className="font-serif text-lg font-semibold text-white mt-0.5">Opciones de Preparación</h4>
                  </div>
                </div>

                {/* Scrollable details and selectors */}
                <div className="p-5 md:p-6 overflow-y-auto space-y-5 flex-grow min-h-0 custom-scrollbar">
                  {/* Product Description */}
                  <div className="space-y-1 bg-[#150303]/60 border border-red-950/40 rounded-xs p-3.5">
                    <h5 className="text-[9px] uppercase tracking-widest text-gold-400/70 font-bold">Descripción del Platillo</h5>
                    <p className="text-xs text-neutral-300 font-light leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </div>

                  {/* Conditionally Render Doneness Options */}
                  {(selectedItem.category.toLowerCase().includes("corte") ||
                    selectedItem.category.toLowerCase().includes("parrillada") ||
                    selectedItem.category.toLowerCase().includes("bbq")) && (
                    <div className="space-y-2">
                      <label className="block text-[9px] uppercase tracking-widest text-gold-400 font-bold">
                        Término de la Carne
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {["Término Medio", "Tres Cuartos", "Bien Cocido", "Término Azul"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setDoneness(opt)}
                            className={`py-2 px-3 text-left border rounded-xs transition-all duration-200 flex items-center justify-between cursor-pointer ${
                              doneness === opt
                                ? "border-red-500 bg-red-950/40 text-white font-medium shadow-[0_0_10px_rgba(220,38,38,0.08)]"
                                : "border-red-950/30 bg-[#120202]/30 text-neutral-400 hover:border-red-500/25 hover:text-white"
                            }`}
                          >
                            <span>{opt}</span>
                            {doneness === opt && <Check className="w-3.5 h-3.5 text-red-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {!(selectedItem.category.toLowerCase().includes("complemento") ||
                    selectedItem.category.toLowerCase().includes("embutido") ||
                    selectedItem.category.toLowerCase().includes("pizza") ||
                    selectedItem.category.toLowerCase().includes("entrada")) && (
                    <>
                      {/* Side 1 (Complemento 1) */}
                      <div className="space-y-2">
                        <label className="block text-[9px] uppercase tracking-widest text-gold-400 font-bold">
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
                              className={`py-2 px-3 text-left border rounded-xs transition-all duration-200 flex flex-col justify-between h-[68px] cursor-pointer ${
                                side1 === opt
                                  ? "border-red-500 bg-red-950/40 text-white shadow-[0_0_10px_rgba(220,38,38,0.08)]"
                                  : "border-red-950/30 bg-[#120202]/30 text-neutral-400 hover:border-red-500/25 hover:text-white"
                              }`}
                            >
                              <span className="text-[10px] font-medium leading-snug">{opt}</span>
                              {side1 === opt && <Check className="w-3.5 h-3.5 text-red-500 self-end mt-1" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Side 2 (Complemento 2) */}
                      <div className="space-y-2">
                        <label className="block text-[9px] uppercase tracking-widest text-gold-400 font-bold">
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
                              className={`py-2 px-3 text-left border rounded-xs transition-all duration-200 flex flex-col justify-between h-[68px] cursor-pointer ${
                                side2 === opt
                                  ? "border-red-500 bg-red-950/40 text-white shadow-[0_0_10px_rgba(220,38,38,0.08)]"
                                  : "border-red-950/30 bg-[#120202]/30 text-neutral-400 hover:border-red-500/25 hover:text-white"
                              }`}
                            >
                              <span className="text-[10px] font-medium leading-snug">{opt}</span>
                              {side2 === opt && <Check className="w-3.5 h-3.5 text-red-500 self-end mt-1" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Button at footer */}
                <div className="p-5 md:p-6 bg-[#0f0202]/80 border-t border-red-950/50 flex-shrink-0">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3.5 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-gold-400/20 cursor-pointer border-none hover:scale-[1.01]"
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
    </div>
  );
}
