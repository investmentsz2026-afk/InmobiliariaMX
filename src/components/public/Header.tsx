"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, ArrowUpRight, Shield, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { items, toggleCart } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isHomeOrGrill = pathname === "/" || pathname === "/zona-grill";

  const textColorClass = "text-white";

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Inicio", href: "/" },
    { label: "Zona Grill", href: "/zona-grill" },
    { label: "Nosotros", href: "/#nosotros" },
    { label: "Contacto", href: "/#contacto" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 md:py-4 px-4 md:px-8 ${textColorClass}`}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between rounded-full border border-gold-400/40 bg-[#0c0c0c]/85 backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.8),_0_0_20px_rgba(184,144,71,0.15)] transition-all duration-300">
          {/* Logo & Beautiful Title */}
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 group" onClick={handleLinkClick}>
            <img
              src="/uploads/logo.png"
              alt="La Cava del Corte Logo"
              className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl tracking-[0.12em] font-bold text-white uppercase leading-none">
                La Cava
              </span>
              <span className="font-serif text-[10px] md:text-[11px] tracking-[0.25em] font-semibold text-gold-400 uppercase mt-1.5 leading-none">
                del Corte
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm tracking-widest uppercase hover:text-gold-400 transition-colors duration-200 ${
                    isActive 
                      ? "text-gold-400 font-semibold" 
                      : "text-gray-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            <Link
              href="/admin"
              className="text-xs flex items-center text-neutral-400 hover:text-gold-400 tracking-wider uppercase transition-colors"
            >
              <Shield className="w-3.5 h-3.5 mr-1" />
              {session ? "Panel" : "Admin"}
            </Link>
          </nav>

          {/* Right CTA Button (WhatsApp) & Cart */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => toggleCart(true)}
              className="relative p-2 text-gray-300 hover:text-gold-400 transition-colors duration-200 cursor-pointer"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-400 text-obsidian text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>

            <a
              href="https://wa.me/523222018003?text=Hola,%20quisiera%20información%20o%20hacer%20un%20pedido%20de%20cortes%20y%20parrilladas."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center shadow-md hover:shadow-gold-400/20"
            >
              Pedidos
              <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </div>

          {/* Mobile Menu & Cart Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={() => toggleCart(true)}
              className="relative p-2 text-white hover:text-gold-400 transition-colors cursor-pointer"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute top-1 right-1 bg-gold-400 text-obsidian text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-white hover:text-gold-400 transition-colors p-1"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Sidebar) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark & Blurred Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 md:hidden"
            />

            {/* Sidebar Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#0c0c0c] border-l border-white/5 z-55 p-6 flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
                <Link href="/" className="flex items-center space-x-2" onClick={handleLinkClick}>
                  <img
                    src="/uploads/logo.png"
                    alt="La Cava del Corte"
                    className="h-11 w-auto object-contain"
                  />
                  <div className="flex flex-col">
                    <span className="font-serif text-base tracking-[0.12em] font-bold text-white uppercase leading-none">
                      La Cava
                    </span>
                    <span className="font-serif text-[9px] tracking-[0.25em] font-semibold text-gold-400 uppercase mt-1 leading-none">
                      del Corte
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-gray-400 hover:text-gold-400 transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link, idx) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={handleLinkClick}
                        className={`block py-2 text-sm tracking-widest uppercase hover:text-gold-400 transition-colors duration-200 ${
                          isActive ? "text-gold-400 font-bold border-l-2 border-gold-400 pl-3" : "text-gray-300 pl-3"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="border-t border-white/5 my-6" />

              {/* Admin panel & WhatsApp buttons */}
              <div className="space-y-4 mt-auto">
                <Link
                  href="/admin"
                  onClick={handleLinkClick}
                  className="text-xs flex items-center justify-center text-neutral-400 hover:text-gold-400 tracking-wider uppercase py-3 border border-white/5 hover:border-gold-400/30 transition-all rounded-sm"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {session ? "Panel de Administración" : "Acceso Admin"}
                </Link>

                <a
                  href="https://wa.me/523222018003?text=Hola,%20quisiera%20información%20o%20hacer%20un%20pedido%20de%20cortes%20y%20parrilladas."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="w-full text-center px-5 py-3.5 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center shadow-lg hover:shadow-gold-400/20"
                >
                  Pedidos WhatsApp
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
