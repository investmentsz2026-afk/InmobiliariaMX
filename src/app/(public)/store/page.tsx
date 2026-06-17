import { prisma } from "@/lib/prisma";
import StoreHeroSlider from "@/components/public/StoreHeroSlider";
import ProductCatalogHome from "@/components/public/ProductCatalogHome";
import HomeContactForm from "@/components/public/HomeContactForm";
import Testimonials from "@/components/public/Testimonials";
import SensoryVideoPlayer from "@/components/public/SensoryVideoPlayer";
import { ArrowRight, Weight, Flame, ShieldAlert, Award } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique & Tienda | La Cava del Corte",
  description: "Boutique de carnes premium con cortes de calidad internacional empacados al vacío. Compra directo o coordina tu entrega.",
};

// Disable Route Segment Caching to show new properties/products added via the admin panel instantly
export const revalidate = 0;

export default async function StorePage() {
  // Retrieve all cuts/products from the DB
  const [properties, storeCategories, setting] = await Promise.all([
    prisma.property.findMany({
      include: { images: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customCategory.findMany({
      where: { target: "STORE" },
      orderBy: { createdAt: "asc" },
    }),
    prisma.systemSetting.findUnique({
      where: { key: "store_content" },
    }),
  ]);

  const categories = storeCategories.map((c) => ({ id: c.id, name: c.name }));

  const content = setting ? (setting.value as any) : null;

  const heroSlides = content?.heroSlides || [
    {
      id: "1",
      tag: "LA CAVA DEL CORTE | BOUTIQUE PREMIUM",
      title: "Cortes Premium de Sonora\n& El Arte del Buen Comer",
      description: "Seleccionamos minuciosamente los mejores cortes marmoleados, empacados al alto vacío y listos para tu asador. Disfruta también de nuestra Zona Grill cocinada al carbón de leña los fines de semana.",
      mediaType: "IMAGE",
      mediaUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1600&auto=format&fit=crop&q=80",
    },
    {
      id: "2",
      tag: "MADURACIÓN & SABOR",
      title: "Calidad de Origen\nen tu Asador",
      description: "Cortes empacados individualmente en origen al alto vacío para preservar la frescura, terneza y el sabor extraordinario del auténtico ganado sonorense.",
      mediaType: "IMAGE",
      mediaUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&auto=format&fit=crop&q=80",
    },
    {
      id: "3",
      tag: "EXPERIENCIA SENSORIAL",
      title: "El Fuego Sagrado\nde la Parrilla",
      description: "Parrilladas, costillares BBQ y platos listos para servir los fines de semana. Sabor ahumado a leña y carbón directo a tu mesa.",
      mediaType: "VIDEO",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-barbecue-steaks-cooking-on-grill-42284-large.mp4",
    }
  ];

  const videoSection = content?.videoSection || {
    tag: "EXPERIENCIA SENSORIAL",
    title: "El Arte del Fuego & La Brasa",
    description: "Mira cómo seleccionamos cada pieza y encendemos las brasas de mezquite para ofrecerte la máxima jugosidad y el sabor auténtico de la parrilla.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-barbecue-steaks-cooking-on-grill-42284-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80",
  };

  const catalogSection = content?.catalogSection || {
    tag: "SELECCIÓN BOUTIQUE",
    title: "Nuestro Menú & Productos",
    description: "Cortes premium de Sonora empacados al vacío y especialidades preparadas al carbón. Pide directo por WhatsApp y coordina la entrega.",
  };

  const aboutSection = content?.aboutSection || {
    tag: "CONCEPTO INTEGRAL",
    title: "Calidad de Origen, Suavidad y Pasión por el Fuego",
    paragraph1: "En La Cava del Corte fusionamos dos mundos bajo una sola pasión: el fuego. Nuestro negocio integral te ofrece una Zona de Carne Congelada Fría con los cortes crudos premium más selectos de Sonora, empacados al alto vacío individualmente en origen. Esto asegura que la maduración y la frescura de la carne se mantengan intactas hasta tu asador.",
    paragraph2: "Y si prefieres que nosotros hagamos el trabajo, los fines de semana encendemos las brasas en nuestra Zona Grill, ofreciendo parrilladas, papas rellenas y costillares BBQ cocinados a fuego lento con leña y carbón de mezquite, listos para comer o pedir a domicilio.",
    stat1Value: "100%",
    stat1Label: "Ganado de Sonora",
    stat2Value: "Alto Vacío",
    stat2Label: "Frescura Garantizada",
    imageUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&auto=format&fit=crop&q=80",
  };

  const gallerySection = content?.gallerySection || {
    title: "GALERÍA VISUAL",
    images: [
      { id: "1", url: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&auto=format&fit=crop&q=80", label: "Ribeye Sonorense" },
      { id: "2", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80", label: "Costillar en Asador" },
      { id: "3", url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80", label: "Brasas de Mezquite" },
      { id: "4", url: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80", label: "T-Bone al Fuego" },
    ]
  };

  const testimonials = content?.testimonials || [];

  return (
    <div className="flex flex-col bg-[#edf2f6] text-neutral-900">
      {/* 1. HERO SECTION */}
      <StoreHeroSlider slides={heroSlides} />

      {/* 1.5. VIDEO PROMOCIONAL */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#b01e28] font-bold">{videoSection.tag}</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-neutral-900">
              {videoSection.title}
            </h2>
            <p className="text-xs text-neutral-500 mt-3 max-w-lg mx-auto font-light leading-relaxed">
              {videoSection.description}
            </p>
          </div>

          <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-sm overflow-hidden border border-neutral-200 shadow-xl bg-black group">
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
            
            <SensoryVideoPlayer
              videoUrl={videoSection.videoUrl}
              posterUrl={videoSection.posterUrl}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            />

            {/* Decorative frame overlay */}
            <div className="absolute inset-0 border border-[#b01e28]/20 m-4 pointer-events-none rounded-xs z-20" />
          </div>
        </div>
      </section>

      {/* 2. CORTES DESTACADOS (CARNE FRÍA) */}
      <section id="catalogo" className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#b01e28] font-bold">{catalogSection.tag}</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-neutral-900">
              {catalogSection.title}
            </h2>
            <p className="text-xs text-neutral-500 mt-3 max-w-md mx-auto font-light leading-relaxed">
              {catalogSection.description}
            </p>
          </div>

          <ProductCatalogHome products={properties as any} categories={categories} />
        </div>
      </section>

      {/* 3. NUESTRO MODELO INTEGRAL (SOBRE NOSOTROS) */}
      <section id="nosotros" className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 bg-white border border-neutral-200 rounded-sm shadow-md grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-xl border border-neutral-200">
            <img
              src={aboutSection.imageUrl}
              alt="Selección premium de cortes marmoleados de res"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border border-[#b01e28]/15 m-4 rounded-xs pointer-events-none" />
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#b01e28] font-bold">{aboutSection.tag}</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 leading-tight">
              {aboutSection.title}
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              {aboutSection.paragraph1}
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              {aboutSection.paragraph2}
            </p>
            <div className="pt-6 grid grid-cols-2 gap-6 border-t border-neutral-200">
              <div>
                <span className="font-serif text-3xl font-bold text-[#b01e28]">{aboutSection.stat1Value}</span>
                <p className="text-[10px] uppercase text-neutral-500 tracking-widest mt-1">{aboutSection.stat1Label}</p>
              </div>
              <div>
                <span className="font-serif text-3xl font-bold text-[#b01e28]">{aboutSection.stat2Value}</span>
                <p className="text-[10px] uppercase text-neutral-500 tracking-widest mt-1">{aboutSection.stat2Label}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GALERÍA VISUAL */}
      <section className="py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${gallerySection.images.length >= 4 ? 'lg:grid-cols-4' : gallerySection.images.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4 min-h-[220px]`}>
            {gallerySection.images.map((img: any) => (
              <div key={img.id} className="relative overflow-hidden group rounded-sm aspect-[4/3] sm:aspect-auto">
                <img src={img.url} alt={img.label || "Galería"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs text-white uppercase tracking-widest">{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIOS */}
      <section className="py-24 bg-transparent">
        <div className="max-w-7xl mx-auto bg-white border border-neutral-200 py-12 rounded-sm shadow-md">
          <Testimonials reviews={testimonials} />
        </div>
      </section>

      {/* 7. CONTACTO + FORMULARIO */}
      <section id="contacto" className="py-24 bg-transparent text-neutral-900 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div>
            <span className="text-xs uppercase tracking-widest text-[#b01e28] font-bold">CONTACTO & PEDIDOS</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-neutral-900">
              ¿Listo para encender el fuego?
            </h2>
            <p className="text-sm text-neutral-600 mt-6 leading-relaxed max-w-md">
              Envíanos un mensaje para cotizar paquetes de asado, coordinar un pedido de cortes fríos empacados al vacío o apartar tu parrillada caliente para el fin de semana.
            </p>
            <div className="mt-12 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white border border-neutral-200 rounded-full text-[#b01e28] shadow-sm">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Pedidos Directos</h4>
                  <p className="text-sm text-neutral-800 font-semibold">WhatsApp: 322 201 8003</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white border border-neutral-200 rounded-full text-[#b01e28] shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Horarios de Asador (Grill)</h4>
                  <p className="text-sm text-neutral-800 font-semibold">Sábados y Domingos: 14:00 - 19:00</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-neutral-200 p-8 rounded-sm shadow-md">
            <HomeContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
