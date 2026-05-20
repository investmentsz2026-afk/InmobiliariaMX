import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-400 pt-20 pb-10 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand info */}
        <div className="space-y-6">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl tracking-widest font-semibold text-white">
              CARNICERO<span className="text-gold-400"> & GRILL</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed">
            Boutique de carnes premium con cortes de calidad internacional. Contamos con una zona de carne congelada fría para llevar a casa y una zona grill los fines de semana.
          </p>
          <div className="flex space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener" className="p-2 bg-white/5 rounded-full hover:bg-gold-400 hover:text-obsidian text-white transition-all duration-300" aria-label="Instagram">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener" className="p-2 bg-white/5 rounded-full hover:bg-gold-400 hover:text-obsidian text-white transition-all duration-300" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="https://wa.me/523222018003" target="_blank" rel="noopener" className="p-2 bg-white/5 rounded-full hover:bg-gold-400 hover:text-obsidian text-white transition-all duration-300" aria-label="WhatsApp">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Sitemap */}
        <div>
          <h3 className="font-serif text-white tracking-widest text-sm uppercase mb-6 font-semibold">Navegación</h3>
          <ul className="space-y-4 text-sm">
            <li>
              <Link href="/" className="hover:text-gold-400 transition-colors duration-200">Inicio</Link>
            </li>
            <li>
              <Link href="/#catalogo" className="hover:text-gold-400 transition-colors duration-200">Cortes Premium</Link>
            </li>
            <li>
              <Link href="/zona-grill" className="hover:text-gold-400 transition-colors duration-200 text-gold-400">Zona Grill</Link>
            </li>
            <li>
              <Link href="/#nosotros" className="hover:text-gold-400 transition-colors duration-200">Nosotros</Link>
            </li>
            <li>
              <Link href="/#contacto" className="hover:text-gold-400 transition-colors duration-200">Contacto</Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="font-serif text-white tracking-widest text-sm uppercase mb-6 font-semibold">Contacto</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span>San Pedro Garza García, N.L., México</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-gold-400 shrink-0" />
              <a href="tel:+523222018003" className="hover:text-gold-400 transition-colors">+52 32 2201 8003</a>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gold-400 shrink-0" />
              <a href="mailto:info@carnicero.mx" className="hover:text-gold-400 transition-colors">info@carnicero.mx</a>
            </li>
          </ul>
        </div>

        {/* Admin Login Portal */}
        <div>
          <h3 className="font-serif text-white tracking-widest text-sm uppercase mb-6 font-semibold">Administración</h3>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Área protegida exclusiva para la gestión del catálogo de cortes de carne y control de pedidos de la plataforma.
          </p>
          <Link
            href="/login"
            className="inline-block px-5 py-2 border border-white/10 hover:border-gold-400 hover:text-gold-400 text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm"
          >
            Acceder al Panel
          </Link>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600">
        <p>&copy; {new Date().getFullYear()} Carnicero & Grill. Todos los derechos reservados.</p>
        <p className="mt-2 md:mt-0 tracking-widest">DISEÑO Y PASIÓN POR EL FUEGO</p>
      </div>
    </footer>
  );
}
