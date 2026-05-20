"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, ArrowUpRight, Shield, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";

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

  const isHomeOrGrill = pathname === "/" || pathname === "/zona-grill";

  // Set color styling based on current route and scroll state
  const headerBgClass = (scrolled || !isHomeOrGrill)
    ? "bg-[#111111]/95 backdrop-blur-md shadow-lg border-b border-white/5 py-4"
    : "bg-transparent py-6";

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass} ${textColorClass}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2" onClick={handleLinkClick}>
          <span className="font-serif text-2xl tracking-widest font-semibold text-white">
            CARNICERO<span className="text-gold-400"> & GRILL</span>
          </span>
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-gold-400 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#111111] border-t border-white/5 py-6 px-6 shadow-2xl flex flex-col space-y-5 animate-in fade-in slide-in-from-top-5 duration-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={handleLinkClick}
                className={`text-sm tracking-widest uppercase hover:text-gold-400 transition-colors duration-200 ${
                  isActive ? "text-gold-400 font-medium" : "text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          
          <Link
            href="/admin"
            onClick={handleLinkClick}
            className="text-sm flex items-center text-neutral-400 hover:text-gold-400 tracking-wider uppercase py-2 transition-colors"
          >
            <Shield className="w-4 h-4 mr-2" />
            {session ? "Panel de Administración" : "Acceso Admin"}
          </Link>

          <a
            href="https://wa.me/523222018003?text=Hola,%20quisiera%20información%20o%20hacer%20un%20pedido%20de%20cortes%20y%20parrilladas."
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="w-full text-center px-5 py-3 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center"
          >
            Pedidos WhatsApp
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      )}
    </header>
  );
}
