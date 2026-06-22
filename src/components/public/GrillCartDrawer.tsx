"use client";

import { useGrillCartStore } from "@/lib/grillCartStore";
import { X, Plus, Minus, Trash2, MessageSquare, Flame, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function GrillCartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, clearCart } = useGrillCartStore();
  const [mounted, setMounted] = useState(false);

  // Checkout Form States
  const [showCheckout, setShowCheckout] = useState(false);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custDate, setCustDate] = useState("");
  const [custTime, setCustTime] = useState("");
  const [custNotes, setCustNotes] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (showCheckout && !custDate) {
      setCustDate(getTodayDate());
    }
  }, [showCheckout]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone || !custDate || !custTime) {
      setFormError("Todos los campos marcados con * son obligatorios.");
      return;
    }
    
    setIsSending(true);
    setFormError("");

    const itemsText = items.map((item) => {
      const donenessText = item.doneness ? `\n   • Término: ${item.doneness}` : "";
      const sidesText = (item.side1 || item.side2)
        ? `\n   • Acompañamientos: ${[item.side1, item.side2].filter(Boolean).join(", ")}`
        : "";
      return `• ${item.quantity}x ${item.name} ($${item.price * item.quantity} MXN)${donenessText}${sidesText}`;
    }).join("\n");

    const formattedCartNotes = `🛒 PRODUCTOS COMPRADOS:\n${itemsText}\n\n💰 Total: $${subtotal} MXN\n\n📌 Indicaciones del Cliente:\n${custNotes || "Ninguna"}`;

    try {
      // 1. Enviar el pedido internamente a la base de datos
      const response = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: custName,
          email: custEmail || "cliente-grill@whatsapp.com",
          phone: custPhone,
          date: custDate,
          time: custTime,
          notes: formattedCartNotes,
          propertyId: "zona-grill",
        }),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "Error al registrar el pedido en la base de datos.");
      }
    } catch (err: any) {
      console.error("Internal db order registration error:", err);
      // No bloqueamos el envío de WhatsApp si el registro interno falla
    } finally {
      // 2. Abrir WhatsApp con la info
      const waTextItems = items.map((item) => {
        const donenessText = item.doneness ? `%0A   • *Término:* ${item.doneness}` : "";
        const sidesText = (item.side1 || item.side2)
          ? `%0A   • *Acompañamientos:* ${[item.side1, item.side2].filter(Boolean).join(", ")}`
          : "";
        return `• *${item.quantity}x ${item.name}* ($${item.price * item.quantity} MXN)${donenessText}${sidesText}`;
      }).join("%0A");

      const waText =
        `🥩 *LA CAVA DEL CORTE - ZONA GRILL* 🥩%0A%0A` +
        `¡Hola! Me gustaría confirmar el siguiente pedido de la *Zona Grill*:%0A%0A` +
        `📌 *DATOS DE ENTREGA / RECOGIDA:*%0A` +
        `• *Cliente:* ${custName}%0A` +
        `• *Teléfono:* ${custPhone}%0A` +
        `• *Fecha:* ${custDate}%0A` +
        `• *Hora:* ${custTime}%0A` +
        (custNotes ? `• *Indicaciones:* ${custNotes}%0A%0A` : `%0A`) +
        `🛒 *DETALLE DEL PEDIDO:*%0A${waTextItems}%0A%0A` +
        `💰 *Total del Pedido:* *$${subtotal} MXN*%0A%0A` +
        `¿Me podrían confirmar disponibilidad y tiempo estimado para recoger?`;

      window.open(`https://wa.me/523222018003?text=${waText}`, "_blank");
      setIsSending(false);
      clearCart();
      setShowCheckout(false);
      toggleCart(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] overflow-hidden font-sans">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!isSending) toggleCart(false);
          }}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Drawer container */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-black border-l border-red-500/10 text-white flex flex-col shadow-2xl h-full"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-red-950/40 flex items-center justify-between bg-black">
              <div className="flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-gold-400 animate-pulse" />
                <h2 className="font-serif text-lg font-semibold tracking-wide">
                  {showCheckout ? "Finalizar Pedido" : "Tu Pedido Grill"}
                </h2>
                {!showCheckout && items.length > 0 && (
                  <span className="bg-gold-400 text-obsidian text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  if (!isSending) toggleCart(false);
                }}
                disabled={isSending}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body / Cart Items or Checkout Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {showCheckout ? (
                <div className="space-y-4 text-left">
                  <h3 className="font-serif text-base text-gold-400 font-semibold mb-1 uppercase tracking-wider">Datos de Entrega / Retiro</h3>
                  <p className="text-[11px] text-neutral-400 leading-relaxed mb-4">
                    Completa tus datos para agendar tu pedido en el sistema e iniciar tu envío por WhatsApp.
                  </p>

                  {formError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] rounded-sm">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleConfirmCheckout} className="space-y-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        disabled={isSending}
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        placeholder="Ej. Pedro Picapiedra"
                        className="w-full bg-black border border-white/10 focus:border-red-500 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Teléfono WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          disabled={isSending}
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          placeholder="Ej. 3222018003"
                          className="w-full bg-black border border-white/10 focus:border-red-500 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Correo (Opcional)</label>
                        <input
                          type="email"
                          disabled={isSending}
                          value={custEmail}
                          onChange={(e) => setCustEmail(e.target.value)}
                          placeholder="correo@ejemplo.com"
                          className="w-full bg-black border border-white/10 focus:border-red-500 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Fecha sugerida *</label>
                        <input
                          type="date"
                          required
                          min={getTodayDate()}
                          disabled={isSending}
                          value={custDate}
                          onChange={(e) => setCustDate(e.target.value)}
                          className="w-full bg-black border border-white/10 focus:border-red-500 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Hora sugerida *</label>
                        <select
                          required
                          disabled={isSending}
                          value={custTime}
                          onChange={(e) => setCustTime(e.target.value)}
                          className="w-full bg-black border border-white/10 focus:border-red-500 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                        >
                          <option value="">Seleccionar</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="1:00 PM">1:00 PM</option>
                          <option value="2:00 PM">2:00 PM</option>
                          <option value="3:00 PM">3:00 PM</option>
                          <option value="4:00 PM">4:00 PM</option>
                          <option value="5:00 PM">5:00 PM</option>
                          <option value="6:00 PM">6:00 PM</option>
                          <option value="7:00 PM">7:00 PM</option>
                          <option value="8:00 PM">8:00 PM</option>
                          <option value="9:00 PM">9:00 PM</option>
                          <option value="10:00 PM">10:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-1 font-bold">Indicaciones o Dirección de Entrega</label>
                      <textarea
                        disabled={isSending}
                        value={custNotes}
                        onChange={(e) => setCustNotes(e.target.value)}
                        placeholder="Ej. Entrega a domicilio en Colonia Centro, término 3/4..."
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 focus:border-red-500 py-2 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white resize-none"
                      />
                    </div>
                  </form>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <Flame className="w-12 h-12 text-neutral-800 animate-bounce" />
                  <p className="text-sm text-neutral-400 max-w-xs">
                    Tu carrito de la Zona Grill está vacío. Agrega tus cortes preparados, pizzas o quesadillas para ordenar por WhatsApp.
                  </p>
                  <button
                    onClick={() => toggleCart(false)}
                    className="px-6 py-2.5 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-colors duration-200 rounded-sm cursor-pointer"
                  >
                    Volver al Menú
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3.5 bg-black border border-red-950/40 rounded-sm hover:border-gold-500/20 transition-all duration-300 group text-left"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-neutral-900 rounded-sm overflow-hidden flex-shrink-0 relative border border-red-950/30">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black">
                          <Flame className="w-6 h-6 text-neutral-700" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-sm font-medium text-white line-clamp-1">{item.name}</h4>
                        {item.doneness && (
                          <span className="text-[9px] bg-red-950/30 text-red-400 border border-red-500/10 px-1 py-0.5 rounded-2xs inline-block mt-1 font-semibold uppercase tracking-wider">
                            Término: {item.doneness}
                          </span>
                        )}
                        {(item.side1 || item.side2) && (
                          <span className="text-[9px] text-neutral-500 block mt-1 line-clamp-1">
                            Acompañado de: {[item.side1, item.side2].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </div>

                      {/* Quantity Selector & Trash */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-red-950/50 bg-black rounded-xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-gold-400 text-neutral-400 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-neutral-200 w-6 text-center select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-gold-400 text-neutral-400 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gold-400 font-serif">
                            ${(item.price * item.quantity).toLocaleString()} MXN
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-red-950/40 bg-black space-y-4">
                {showCheckout ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
                      <span>Total del Pedido</span>
                      <span className="font-serif text-lg font-bold text-gold-400">
                        ${subtotal.toLocaleString()} MXN
                      </span>
                    </div>
                    <button
                      onClick={handleConfirmCheckout}
                      disabled={isSending}
                      className="w-full py-4 bg-gradient-to-r from-red-700 to-red-650 hover:from-red-650 hover:to-red-600 text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 cursor-pointer border border-gold-500/10 hover:scale-102 disabled:opacity-50 font-bold"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          Procesando Pedido...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4 text-white" />
                          Enviar por WhatsApp y Registrar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowCheckout(false)}
                      disabled={isSending}
                      className="w-full py-3 border border-red-950/40 hover:border-red-500/20 text-neutral-400 hover:text-white text-xs font-semibold tracking-widest uppercase transition-all rounded-sm disabled:opacity-50"
                    >
                      Volver al Carrito
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
                      <span>Subtotal</span>
                      <span className="font-serif text-base font-semibold text-white">
                        ${subtotal.toLocaleString()} MXN
                      </span>
                    </div>
                    <div className="border-t border-red-950/20 pt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-white uppercase tracking-wider">Total</span>
                      <span className="font-serif text-xl font-bold text-gold-400">
                        ${subtotal.toLocaleString()} MXN
                      </span>
                    </div>

                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full py-4 bg-gradient-to-r from-red-700 to-red-650 hover:from-red-650 hover:to-red-600 text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 mt-2 shadow-lg shadow-red-900/30 cursor-pointer border border-gold-500/10 hover:scale-102 font-bold"
                    >
                      <MessageSquare className="w-4 h-4 text-white" />
                      Proceder a Ordenar
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
