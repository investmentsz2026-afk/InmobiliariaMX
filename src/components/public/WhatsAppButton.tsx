"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/523222018003?text=Hola,%20deseo%20más%20información%20sobre%20sus%20cortes%20de%20carne%20y%20Zona%20Grill."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#1ebd54] transition-all duration-300 hover:scale-110 flex items-center justify-center group border border-white/10 hover:shadow-[0_0_20px_rgba(37,211,102,0.6)]"
      aria-label="Contactar por WhatsApp"
    >
      {/* Pulsing Outer Rings */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none scale-105" />
      <span className="absolute inset-0 rounded-full bg-gold-400/25 animate-pulse pointer-events-none scale-110" />

      <MessageCircle className="w-6 h-6 relative z-10" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 text-[10px] font-bold tracking-widest uppercase transition-all duration-500 ease-out whitespace-nowrap relative z-10">
        Haz tu Pedido
      </span>
    </a>
  );
}
