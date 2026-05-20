"use client";

import { useState, useEffect } from "react";
import { Flame, Compass, MessageSquare, Clock, MapPin, X, ArrowRight, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  name: string;
  price: number;
  description: string;
  category: "corte" | "parrillada" | "papa" | "embutido" | "bbq" | "complemento";
}

interface GrillProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "CORTE" | "PARRILLADA" | "PAPA" | "EMBUTIDO" | "BBQ" | "COMPLEMENTO";
  isActive: boolean;
}

export default function GrillMenuInteractive() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [products, setProducts] = useState<GrillProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Customizer State
  const [doneness, setDoneness] = useState("Término Medio");
  const [side1, setSide1] = useState("Papa Asada al Carbón");
  const [side2, setSide2] = useState("Tortillas de Harina");

  useEffect(() => {
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
      }));
  };

  const menuData = [
    {
      title: "Cortes al Carbón",
      subtitle: "LÍNEA AL CARBÓN",
      items: getFilteredItems(["CORTE"]),
    },
    {
      title: "Parrilladas & Papas Rellenas",
      subtitle: "PARA COMPARTIR & ESPECIALIDADES",
      items: getFilteredItems(["PARRILLADA", "PAPA"]),
    },
    {
      title: "Embutidos & Ahumados",
      subtitle: "COMPLEMENTOS Y RECETAS A LAS BRASAS",
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
    const sidesText = `%0A*Complemento 1:* ${side1}%0A*Complemento 2:* ${side2}`;

    const text = `Hola Carnicero %26 Grill!%0A%0AMe gustaría ordenar de la *Zona Grill*:%0A%0A*Producto:* ${selectedItem.name}%0A*Precio:* $${selectedItem.price} MXN${donenessText}${sidesText}%0A%0A¿Me podrían confirmar disponibilidad y tiempo estimado para recoger o entrega?`;

    window.open(`https://wa.me/523222018003?text=${text}`, "_blank");
    setSelectedItem(null);
  };

  return (
    <div className="space-y-12">
      {/* Informative banner */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-sm p-4 text-center max-w-xl mx-auto mb-8">
        <p className="text-xs text-gold-400 font-light flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0" />
          Haz clic en cualquier platillo para personalizar tus complementos y ordenar por WhatsApp.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((colIdx) => (
            <div
              key={colIdx}
              className="space-y-8 bg-[#111111]/80 border border-white/5 p-8 rounded-sm backdrop-blur-xs relative overflow-hidden"
            >
              <div className="border-b border-gold-400/20 pb-4 space-y-2">
                <div className="h-3 w-20 bg-neutral-850 rounded-xs animate-pulse" />
                <div className="h-6 w-40 bg-neutral-800 rounded-xs animate-pulse" />
              </div>
              
              <div className="space-y-6">
                {[1, 2, 3, 4].map((itemIdx) => (
                  <div key={itemIdx} className="flex justify-between items-start p-2 -mx-2">
                    <div className="pr-4 flex-1 space-y-2">
                      <div className="h-4 w-1/2 bg-neutral-800 rounded-xs animate-pulse" />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {menuData.map((col, index) => (
            <div
              key={index}
              className="space-y-8 bg-[#111111]/80 border border-white/5 p-8 rounded-sm backdrop-blur-xs relative overflow-hidden group hover:border-gold-400/20 transition-all duration-350"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/2 rounded-bl-full pointer-events-none group-hover:bg-gold-400/4 transition-colors duration-300" />
              
              <div className="border-b border-gold-400/20 pb-4">
                <span className="text-[10px] uppercase text-gold-400 tracking-widest font-bold">{col.subtitle}</span>
                <h2 className="font-serif text-2xl text-white font-semibold mt-1">{col.title}</h2>
              </div>
              
              <div className="space-y-6">
                {col.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    onClick={() => handleOpenCustomizer(item)}
                    className="flex justify-between items-start group/item cursor-pointer p-2 -mx-2 hover:bg-white/5 rounded-xs transition-all duration-200"
                  >
                    <div className="pr-4">
                      <h3 className="text-sm font-semibold text-white group-hover/item:text-gold-400 transition-colors flex items-center gap-1.5">
                        {item.name}
                        <span className="opacity-0 group-hover/item:opacity-100 text-[8px] bg-gold-400/10 text-gold-400 px-1 py-0.5 rounded-xs uppercase tracking-widest transition-opacity duration-200">
                          Pedir
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 font-light mt-1 line-clamp-2">{item.description}</p>
                    </div>
                    <span className="text-sm font-serif font-bold text-gold-400">${item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Box */}
      <div className="mt-16 bg-[#111111] border border-white/5 rounded-sm p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-2">
          <span className="px-2.5 py-1 bg-gold-400/10 border border-gold-400/20 text-gold-400 text-[9px] tracking-widest uppercase font-bold rounded-xs">
            Servicio para Llevar o a Domicilio
          </span>
          <h3 className="font-serif text-xl font-semibold text-white mt-2">¿Quieres hacer un pedido libre para este fin de semana?</h3>
          <p className="text-xs text-gray-400 font-light">Escríbenos por WhatsApp y coordinamos tu entrega de forma rápida y sencilla.</p>
        </div>
        
        <a
          href="https://wa.me/523222018003?text=Hola,%20quisiera%20hacer%20un%20pedido%20del%20menú%20de%20la%20Zona%20Grill."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-6 py-3.5 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center gap-2 shadow-lg shadow-gold-400/5 hover:scale-102 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          Ordenar por WhatsApp
        </a>
      </div>

      {/* INTERACTIVE CUSTOMIZER MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xs"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#111111] border border-white/10 rounded-sm overflow-hidden shadow-2xl z-10 p-6 space-y-6"
            >
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-gold-400 font-bold bg-gold-400/5 px-2 py-0.5 rounded-xs">
                    Zona Grill Asados
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-white mt-1.5">{selectedItem.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1">${selectedItem.price} MXN</p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Conditionally Render Doneness Options */}
              {["corte", "parrillada"].includes(selectedItem.category) && (
                <div className="space-y-2">
                  <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                    Elige el término de cocción
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {["Término Medio", "Tres Cuartos", "Bien Cocido", "Término Azul"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setDoneness(opt)}
                        className={`py-2 px-3 text-left border rounded-sm transition-all duration-300 ${
                          doneness === opt
                            ? "border-gold-400 bg-gold-400/10 text-gold-400"
                            : "border-white/5 bg-black/35 text-neutral-300 hover:border-white/10"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Side 1 */}
              <div className="space-y-2">
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                  Elige Complemento Uno
                </label>
                <select
                  value={side1}
                  onChange={(e) => setSide1(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none text-neutral-200 rounded-sm"
                >
                  <option value="Papa Asada al Carbón">Papa Asada al Carbón</option>
                  <option value="Queso Fundido con Chorizo">Queso Fundido con Chorizo</option>
                  <option value="Guacamole Premium">Guacamole Premium con Totopos</option>
                  <option value="Elote Asado">Elote Asado con Aderezo</option>
                </select>
              </div>

              {/* Side 2 */}
              <div className="space-y-2">
                <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
                  Elige Complemento Dos
                </label>
                <select
                  value={side2}
                  onChange={(e) => setSide2(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none text-neutral-200 rounded-sm"
                >
                  <option value="Tortillas de Harina">Tortillas de Harina Sonorenses</option>
                  <option value="Cebollitas Cambray">Cebollitas Cambray Asadas</option>
                  <option value="Chiles Toreados">Chiles Toreados con Cebolla</option>
                  <option value="Frijoles Charros Especiales">Frijoles Charros Especiales</option>
                </select>
              </div>

              {/* Button */}
              <button
                onClick={handleWhatsAppSend}
                className="w-full py-4 bg-[#25D366] hover:bg-[#1ebd54] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 mt-4 shadow-lg hover:shadow-[#25D366]/20 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Pedir por WhatsApp
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
