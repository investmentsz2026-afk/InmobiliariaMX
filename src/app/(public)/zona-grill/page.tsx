import { Flame, Clock, MapPin, MessageCircle } from "lucide-react";
import { Metadata } from "next";
import GrillMenuInteractive from "@/components/public/GrillMenuInteractive";
import GrillBackground from "@/components/public/GrillBackground";

export const metadata: Metadata = {
  title: "Menú Zona Grill | La Cava del Corte",
  description: "Disfruta de nuestros cortes preparados al carbón los fines de semana. Parrilladas, papas rellenas con extra carne, BBQ y complementos.",
};

export default function ZonaGrillPage() {
  return (
    <div className="relative text-white min-h-screen -mt-24 pt-40 sm:pt-32 pb-24 font-sans selection:bg-gold-400 selection:text-black overflow-hidden bg-[#030406]">
      {/* Animated Background */}
      <GrillBackground />

      {/* Decorative Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 z-50" />

      {/* Hero / Header Section */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-16 relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold-400/10 rounded-full blur-3xl -z-10" />
        
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-gold-400/10 border border-gold-400/20 text-gold-400 text-[10px] tracking-widest uppercase font-bold rounded-full mb-4">
          <Flame className="w-3.5 h-3.5" />
          Fuego Lento & Leña de Mezquite
        </span>
        
        <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight text-white mb-4">
          Menú Zona Grill
        </h1>
        
        <p className="text-gray-400 text-sm max-w-lg mx-auto font-light leading-relaxed">
          Preparamos cada ingrediente al momento sobre las brasas de carbón natural. Todos los sábados y domingos encendemos el fuego para ti.
        </p>

        {/* Timings and Contact bar */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-gray-400 border-t border-b border-white/5 py-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold-400" />
            <span>Sábados y Domingos: 14:00 - 19:00</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold-400" />
            <span>Zona Grill Valle Oriente</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-gold-400" />
            <span>Pedidos: 322 201 8003</span>
          </div>
        </div>
      </div>

      {/* Interactive Grill Menu Grid */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <GrillMenuInteractive />
      </div>
    </div>
  );
}
