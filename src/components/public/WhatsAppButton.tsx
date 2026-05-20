"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/523222018003?text=Hola,%20deseo%20más%20información%20sobre%20sus%20cortes%20de%20carne%20y%20Zona%20Grill."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#1ebd54] transition-all duration-300 hover:scale-115 flex items-center justify-center group border border-white/10"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 text-xs font-semibold tracking-widest uppercase transition-all duration-500 ease-out whitespace-nowrap">
        Pedidos
      </span>
    </a>
  );
}
