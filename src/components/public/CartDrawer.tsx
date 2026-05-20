"use client";

import { useCartStore } from "@/lib/cartStore";
import { X, Plus, Minus, Trash2, CreditCard, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, toggleCheckout } = useCartStore();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => toggleCart(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Drawer container */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-[#111111] border-l border-white/10 text-white flex flex-col shadow-2xl h-full"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-gold-400" />
                <h2 className="font-serif text-lg font-semibold tracking-wide">Tu Pedido</h2>
                {items.length > 0 && (
                  <span className="bg-gold-400 text-obsidian text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={() => toggleCart(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body / Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-neutral-600 animate-bounce" />
                  <p className="text-sm text-neutral-400 max-w-xs">
                    Tu carrito de compras está vacío. Agrega cortes premium para comenzar tu asado.
                  </p>
                  <button
                    onClick={() => toggleCart(false)}
                    className="px-6 py-2.5 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-colors duration-200 rounded-sm"
                  >
                    Volver a Tienda
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3.5 bg-neutral-900 border border-white/5 rounded-sm hover:border-gold-400/25 transition-all duration-300 group"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-neutral-950 rounded-sm overflow-hidden flex-shrink-0 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-sm font-medium text-white line-clamp-1">{item.title}</h4>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mt-0.5">
                          {item.weight >= 1000 ? `${(item.weight / 1000).toFixed(2)} kg` : `${item.weight} g`} / unidad
                        </span>
                      </div>

                      {/* Quantity Selector & Trash */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-white/10 bg-black/40 rounded-xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-gold-400 text-neutral-400 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-neutral-200 w-6 text-center select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-gold-400 text-neutral-400 transition-colors"
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
                            className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
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
              <div className="p-6 border-t border-white/5 bg-black/30 space-y-4">
                <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
                  <span>Subtotal</span>
                  <span className="font-serif text-base font-semibold text-white">
                    ${subtotal.toLocaleString()} MXN
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-500 text-[10px] uppercase tracking-wider">
                  <span>Envío</span>
                  <span className="text-gold-400 font-medium">¡Envío gratis hoy!</span>
                </div>
                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white uppercase tracking-wider">Total</span>
                  <span className="font-serif text-xl font-bold text-gold-400">
                    ${subtotal.toLocaleString()} MXN
                  </span>
                </div>

                <button
                  onClick={() => {
                    toggleCart(false);
                    toggleCheckout(true);
                  }}
                  className="w-full py-4 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 mt-2 shadow-lg hover:shadow-gold-400/20"
                >
                  <CreditCard className="w-4 h-4" />
                  Proceder al Pago
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
