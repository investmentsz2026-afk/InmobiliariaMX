"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Beef,
  Flame,
  MessageSquare,
  CalendarDays,
  LogOut,
  Menu,
  X,
  User,
  ExternalLink,
  ShoppingBag
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Resumen", href: "/admin", icon: LayoutDashboard },
    { label: "Productos", href: "/admin/properties", icon: Beef },
    { label: "Zona Grill", href: "/admin/grill", icon: Flame },
    { label: "Compras / Pagos", href: "/admin/orders", icon: ShoppingBag },
    { label: "Mensajes de Clientes", href: "/admin/leads", icon: MessageSquare },
    { label: "Agenda de Pedidos", href: "/admin/visits", icon: CalendarDays },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-900 text-neutral-100 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-black border-r border-neutral-800 p-6 justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-serif text-xl tracking-widest font-semibold text-white">
              PANEL<span className="text-gold-400">.</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-sm text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
                    isActive
                      ? "bg-gold-400 text-obsidian font-bold"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-neutral-800">
          <div className="flex items-center space-x-3 px-2 py-1">
            <div className="p-2 bg-neutral-800 rounded-full text-gold-400">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Sesión Activa</p>
              <p className="text-xs font-semibold truncate text-neutral-200">{session?.user?.email}</p>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-4 py-2.5 border border-neutral-800 hover:border-gold-400/30 text-[10px] tracking-widest uppercase text-neutral-400 hover:text-gold-400 transition-all rounded-sm font-semibold"
          >
            <span>Ver Web</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-sm text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <span className="font-serif text-lg tracking-widest font-semibold text-white">
            ADMIN<span className="text-gold-400">.</span>
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-neutral-400 hover:text-white"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black pt-20 px-6 flex flex-col justify-between pb-6 animate-in fade-in duration-300">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-sm text-xs font-semibold uppercase tracking-widest ${
                    isActive ? "bg-gold-400 text-obsidian" : "text-neutral-400"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="space-y-4 pt-6 border-t border-neutral-800">
            <div className="flex items-center space-x-3 px-2 py-1">
              <div className="p-2 bg-neutral-800 rounded-full text-gold-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Sesión Activa</p>
                <p className="text-xs font-semibold text-neutral-200">{session?.user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-sm text-xs font-semibold uppercase tracking-widest"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 overflow-y-auto max-w-full">
        {children}
      </main>
    </div>
  );
}
