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
            className="w-screen max-w-md bg-white border-l border-neutral-200 text-neutral-900 flex flex-col shadow-2xl h-full"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-neutral-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#b01e28]" />
                <h2 className="font-serif text-lg font-semibold tracking-wide text-neutral-950">Tu Pedido</h2>
                {items.length > 0 && (
                  <span className="bg-[#b01e28] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={() => toggleCart(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body / Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-neutral-350 animate-bounce" />
                  <p className="text-sm text-neutral-500 max-w-xs">
                    Tu carrito de compras está vacío. Agrega cortes premium para comenzar tu asado.
                  </p>
                  <button
                    onClick={() => toggleCart(false)}
                    className="px-6 py-2.5 bg-[#b01e28] hover:bg-[#91181f] text-white text-xs font-semibold tracking-widest uppercase transition-colors duration-200 rounded-sm"
                  >
                    Volver a Tienda
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3.5 bg-neutral-50 border border-neutral-200/85 rounded-sm hover:border-[#b01e28]/25 transition-all duration-300 group"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-neutral-200 rounded-sm overflow-hidden flex-shrink-0 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between text-neutral-900">
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-neutral-955 line-clamp-1">{item.title}</h4>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mt-0.5">
                          {item.weight >= 1000 ? `${(item.weight / 1000).toFixed(2)} kg` : `${item.weight} g`} / unidad
                        </span>
                      </div>

                      {/* Quantity Selector & Trash */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-neutral-200 bg-white rounded-xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-[#b01e28] text-neutral-500 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-neutral-800 w-6 text-center select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-[#b01e28] text-neutral-500 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-[#b01e28] font-serif">
                            ${(item.price * item.quantity).toLocaleString()} MXN
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-red-650 p-1 transition-colors cursor-pointer"
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
              <div className="p-6 border-t border-neutral-200 bg-neutral-50 space-y-4">
                <div className="flex items-center justify-between text-neutral-500 text-xs uppercase tracking-wider font-semibold">
                  <span>Subtotal</span>
                  <span className="font-serif text-base font-semibold text-neutral-900">
                    ${subtotal.toLocaleString()} MXN
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-450 text-[10px] uppercase tracking-wider font-semibold">
                  <span>Envío</span>
                  <span className="text-[#b01e28] font-bold">¡Envío gratis hoy!</span>
                </div>
                <div className="border-t border-neutral-200 pt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-800 uppercase tracking-wider">Total</span>
                  <span className="font-serif text-xl font-bold text-[#b01e28]">
                    ${subtotal.toLocaleString()} MXN
                  </span>
                </div>

                <button
                  onClick={() => {
                    toggleCart(false);
                    toggleCheckout(true);
                  }}
                  className="w-full py-4 bg-[#b01e28] hover:bg-[#91181f] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 mt-2 shadow-md hover:shadow-red-900/20 cursor-pointer"
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
