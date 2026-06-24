"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, ArrowUpRight, Shield, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { useGrillCartStore } from "@/lib/grillCartStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const { items: storeItems, toggleCart: toggleStoreCart } = useCartStore();
  const { items: grillItems, toggleCart: toggleGrillCart } = useGrillCartStore();

  const isGrillPage = pathname === "/";
  const isStorePage = pathname.startsWith("/meat-store") || pathname.startsWith("/propiedades");
  const items = isGrillPage ? grillItems : storeItems;
  const toggleCart = isGrillPage ? toggleGrillCart : toggleStoreCart;

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

  const isHomeOrGrill = pathname === "/" || pathname === "/meat-store";

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Zona Grill", href: "/" },
    { label: "MEAT STORE", href: "/meat-store" },
    { 
      label: "Nosotros", 
      href: pathname === "/" 
        ? "#nosotros" 
        : (pathname === "/meat-store" ? "#nosotros" : "/meat-store#nosotros") 
    },
    { 
      label: "Contacto", 
      href: pathname === "/" 
        ? "#contacto" 
        : (pathname === "/meat-store" ? "#contacto" : "/meat-store#contacto") 
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2 md:py-2.5 px-4 md:px-8 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-1.5 md:py-2 flex items-center justify-between rounded-full border transition-all duration-300 border-gold-400/40 bg-black/90 backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.8),_0_0_20px_rgba(255,188,0,0.15)]">
          {/* Logo Showcase - 3D Plaque Container */}
          <Link href="/" className="flex items-center group" onClick={handleLinkClick}>
            <div className="relative p-1 rounded-md transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-0.5 flex items-center justify-center select-none overflow-hidden bg-gradient-to-b from-[#14120f] to-[#0a0907] border-b-2 border-r-2 border-t border-l border-gold-600/35 border-r-gold-950/60 border-b-gold-950/80 shadow-[0_3px_8px_rgba(0,0,0,0.7),_inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:shadow-[0_5px_12px_rgba(255,188,0,0.35),_inset_0_1px_1px_rgba(255,255,255,0.15)] group-hover:border-gold-500/45">
              {/* Glossy shine */}
              <div className="absolute inset-0 pointer-events-none rounded-md bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" />
              <img
                src="/uploads/logo.png"
                alt="La Cava del Corte Logo"
                className="h-12 md:h-18 w-auto object-contain filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.6)]"
              />
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
                  className={`text-sm tracking-widest uppercase transition-colors duration-200 ${
                    isActive 
                      ? "text-gold-400 font-semibold" 
                      : "text-gray-300 hover:text-gold-400"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            <Link
              href="/admin"
              className="text-xs flex items-center tracking-wider uppercase transition-colors text-neutral-400 hover:text-gold-400"
            >
              <Shield className="w-3.5 h-3.5 mr-1" />
              {session ? "Panel" : "Admin"}
            </Link>
          </nav>

          {/* Right CTA Button (WhatsApp) & Cart */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => toggleCart(true)}
              className="relative p-2 transition-colors duration-200 cursor-pointer text-gray-300 hover:text-gold-400"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center bg-gold-400 text-obsidian animate-pulse">
                  {items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>

            <a
              href="https://wa.me/523222018003?text=Hola,%20quisiera%20información%20o%20hacer%20un%20pedido%20de%20cortes%20y%20parrilladas."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center shadow-md bg-gold-400 hover:bg-gold-500 text-obsidian hover:shadow-gold-400/20"
            >
              Pedidos
              <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </div>

          {/* Mobile Menu & Cart Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={() => toggleCart(true)}
              className="relative p-2 transition-colors cursor-pointer text-white hover:text-gold-400"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute top-1 right-1 text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center bg-gold-400 text-obsidian">
                  {items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="transition-colors p-1 text-white hover:text-gold-400"
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
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] border-l z-55 p-6 flex flex-col md:hidden transition-colors duration-300 bg-black border-white/5 text-white"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b mb-6 border-white/5">
                <Link href="/" className="flex items-center group" onClick={handleLinkClick}>
                  <div className="relative p-1 rounded-md transition-all duration-300 transform group-hover:scale-105 active:scale-95 flex items-center justify-center select-none overflow-hidden bg-gradient-to-b from-[#14120f] to-[#0a0907] border-b-2 border-r-2 border-t border-l border-gold-600/35 border-r-gold-950/60 border-b-gold-950/80 shadow-[0_3px_8px_rgba(0,0,0,0.7)]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none rounded-md" />
                    <img
                      src="/uploads/logo.png"
                      alt="La Cava del Corte Logo"
                      className="h-14 w-auto object-contain filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.3)]"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 transition-colors text-gray-400 hover:text-gold-400"
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
                        className={`block py-2 text-sm tracking-widest uppercase transition-colors duration-200 ${
                          isActive 
                            ? "text-gold-400 font-bold border-l-2 border-gold-400 pl-3" 
                            : "text-gray-300 hover:text-gold-400 pl-3"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="border-t my-6 border-white/5" />

              {/* Admin panel & WhatsApp buttons */}
              <div className="space-y-4 mt-auto">
                <Link
                  href="/admin"
                  onClick={handleLinkClick}
                  className="text-xs flex items-center justify-center tracking-wider uppercase py-3 border transition-all rounded-sm text-neutral-400 hover:text-gold-400 border-white/5 hover:border-gold-400/30"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {session ? "Panel de Administración" : "Acceso Admin"}
                </Link>

                <a
                  href="https://wa.me/523222018003?text=Hola,%20quisiera%20información%20o%20hacer%20un%20pedido%20de%20cortes%20y%20parrilladas."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="w-full text-center px-5 py-3.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center shadow-lg bg-gold-400 hover:bg-gold-500 text-obsidian hover:shadow-gold-400/20"
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
