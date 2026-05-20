import { prisma } from "@/lib/prisma";
import Hero from "@/components/public/Hero";
import ProductCatalogHome from "@/components/public/ProductCatalogHome";
import HomeContactForm from "@/components/public/HomeContactForm";
import Testimonials from "@/components/public/Testimonials";
import { ArrowRight, Weight, Flame, ShieldAlert, Award } from "lucide-react";
import Link from "next/link";

// Disable Route Segment Caching to show new properties/products added via the admin panel instantly
export const revalidate = 0;

export default async function HomePage() {
  // Retrieve all cuts/products from the DB
  const properties = await prisma.property.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col bg-neutral-900 text-white">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 1.5. VIDEO PROMOCIONAL */}
      <section className="py-20 bg-neutral-950 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">EXPERIENCIA SENSORIAL</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-white">
              El Arte del Fuego & La Brasa
            </h2>
            <p className="text-xs text-gray-400 mt-3 max-w-lg mx-auto font-light leading-relaxed">
              Mira cómo seleccionamos cada pieza y encendemos las brasas de mezquite para ofrecerte la máxima jugosidad y el sabor auténtico de la parrilla.
            </p>
          </div>

          <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-sm overflow-hidden border border-white/10 shadow-2xl bg-black group">
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
            
            <video
              autoPlay
              loop
              muted
              playsInline
              controls
              poster="https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80"
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-barbecue-steaks-cooking-on-grill-42284-large.mp4"
                type="video/mp4"
              />
              Tu navegador no soporta reproducción de video.
            </video>

            {/* Decorative frame overlay */}
            <div className="absolute inset-0 border border-gold-400/20 m-4 pointer-events-none rounded-xs z-20" />
          </div>
        </div>
      </section>

      {/* 2. CORTES DESTACADOS (CARNE FRÍA) */}
      <section id="catalogo" className="py-24 bg-obsidian border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">SELECCIÓN BOUTIQUE</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-white">
              Nuestro Menú & Productos
            </h2>
            <p className="text-xs text-gray-400 mt-3 max-w-md mx-auto font-light leading-relaxed">
              Cortes premium de Sonora empacados al vacío y especialidades preparadas al carbón. Pide directo por WhatsApp y coordina la entrega.
            </p>
          </div>

          <ProductCatalogHome products={properties as any} />
        </div>
      </section>

      {/* 3. NUESTRO MODELO INTEGRAL (SOBRE NOSOTROS) */}
      <section id="nosotros" className="py-24 bg-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&auto=format&fit=crop&q=80"
              alt="Selección premium de cortes marmoleados de res"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border border-gold-400/25 m-4 rounded-xs pointer-events-none" />
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">CONCEPTO INTEGRAL</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
              Calidad de Origen, Suavidad y Pasión por el Fuego
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              En **Carnicero & Grill** fusionamos dos mundos bajo una sola pasión: el fuego. Nuestro negocio integral te ofrece una **Zona de Carne Congelada Fría** con los cortes crudos premium más selectos de Sonora, empacados al alto vacío individualmente en origen. Esto asegura que la maduración y la frescura de la carne se mantengan intactas hasta tu asador.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed font-light">
              Y si prefieres que nosotros hagamos el trabajo, los fines de semana encendemos las brasas en nuestra **Zona Grill**, ofreciendo parrilladas, papas rellenas y costillares BBQ cocinados a fuego lento con leña y carbón de mezquite, listos para comer o pedir a domicilio.
            </p>
            <div className="pt-6 grid grid-cols-2 gap-6 border-t border-white/10">
              <div>
                <span className="font-serif text-3xl font-bold text-gold-400">100%</span>
                <p className="text-[10px] uppercase text-gray-400 tracking-widest mt-1">Ganado de Sonora</p>
              </div>
              <div>
                <span className="font-serif text-3xl font-bold text-gold-400">Alto Vacío</span>
                <p className="text-[10px] uppercase text-gray-400 tracking-widest mt-1">Frescura Garantizada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NUESTRAS LÍNEAS DE SERVICIO */}
      <section className="py-24 bg-obsidian border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">NUESTRO NEGOCIO</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight mt-2 text-white">
              Servicios Gastronómicos de Alto Nivel
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Carne Congelada */}
            <div className="p-8 border border-white/5 hover:border-gold-400/20 bg-white/5 hover:bg-neutral-900 transition-all duration-300 rounded-sm group">
              <Weight className="w-8 h-8 text-gold-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-lg font-semibold text-white mb-3">Carne Congelada Fría</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Cortes individuales premium de res (Ribeye, Sirloin, T-Bone, Costillar) al alto vacío y congelados para conservar sus jugos y frescura.
              </p>
            </div>
            {/* Zona Grill */}
            <div className="p-8 border border-white/5 hover:border-gold-400/20 bg-white/5 hover:bg-neutral-900 transition-all duration-300 rounded-sm group">
              <Flame className="w-8 h-8 text-gold-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-lg font-semibold text-white mb-3">Zona Grill Caliente</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Asado al carbón los fines de semana. Parrilladas familiares, papas rellenas con carne, y complementos calientes recién salidos del fuego.
              </p>
            </div>
            {/* Embutidos */}
            <div className="p-8 border border-white/5 hover:border-gold-400/20 bg-white/5 hover:bg-neutral-900 transition-all duration-300 rounded-sm group">
              <Award className="w-8 h-8 text-gold-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-lg font-semibold text-white mb-3">Embutidos Artesanales</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Elaboración artesanal de chorizo argentino, chistorra y chorizo de cerdo de receta tradicional para acompañar cada reunión.
              </p>
            </div>
            {/* Pedidos */}
            <div className="p-8 border border-white/5 hover:border-gold-400/20 bg-white/5 hover:bg-neutral-900 transition-all duration-300 rounded-sm group">
              <ShieldAlert className="w-8 h-8 text-gold-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="font-serif text-lg font-semibold text-white mb-3">Eventos y Pedidos</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Cotización de paquetes asadores para eventos corporativos y familiares. Coordinamos la entrega a domicilio lista para tu asador.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GALERÍA VISUAL */}
      <section className="py-12 bg-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[220px]">
            <div className="relative overflow-hidden group rounded-sm aspect-[4/3] sm:aspect-auto">
              <img src="https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&auto=format&fit=crop&q=80" alt="Ribeye marmoleado de Sonora" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-xs text-white uppercase tracking-widest">Ribeye Sonorense</span>
              </div>
            </div>
            <div className="relative overflow-hidden group rounded-sm aspect-[4/3] sm:aspect-auto">
              <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80" alt="Costillas en asador al carbón" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-xs text-white uppercase tracking-widest">Costillar en Asador</span>
              </div>
            </div>
            <div className="relative overflow-hidden group rounded-sm aspect-[4/3] sm:aspect-auto">
              <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80" alt="Brasas de mezquite encendidas con carne" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-xs text-white uppercase tracking-widest">Brasas de Mezquite</span>
              </div>
            </div>
            <div className="relative overflow-hidden group rounded-sm aspect-[4/3] sm:aspect-auto">
              <img src="https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80" alt="T-Bone grueso al fuego directo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-xs text-white uppercase tracking-widest">T-Bone al Fuego</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIOS */}
      <section className="py-24 bg-obsidian border-b border-white/5">
        <Testimonials />
      </section>

      {/* 7. CONTACTO + FORMULARIO */}
      <section id="contacto" className="py-24 bg-neutral-900 text-white relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div>
            <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">CONTACTO & PEDIDOS</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-white">
              ¿Listo para encender el fuego?
            </h2>
            <p className="text-sm text-gray-400 mt-6 leading-relaxed max-w-md">
              Envíanos un mensaje para cotizar paquetes de asado, coordinar un pedido de cortes fríos empacados al vacío o apartar tu parrillada caliente para el fin de semana.
            </p>
            <div className="mt-12 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/5 rounded-full text-gold-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-widest">Pedidos Directos</h4>
                  <p className="text-sm text-white font-medium">WhatsApp: 322 201 8003</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/5 rounded-full text-gold-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-widest">Horarios de Asador (Grill)</h4>
                  <p className="text-sm text-white font-medium">Sábados y Domingos: 14:00 - 19:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-obsidian border border-white/5 p-8 rounded-sm">
            <HomeContactForm />
          </div>

        </div>
      </section>
    </div>
  );
}
