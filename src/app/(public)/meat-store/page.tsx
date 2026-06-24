import { prisma } from "@/lib/prisma";
import StoreHeroSlider from "@/components/public/StoreHeroSlider";
import ProductCatalogHome from "@/components/public/ProductCatalogHome";
import HomeContactForm from "@/components/public/HomeContactForm";
import Testimonials from "@/components/public/Testimonials";
import SensoryVideoPlayer from "@/components/public/SensoryVideoPlayer";
import { ArrowRight, Weight, Flame, ShieldAlert, Award, Star } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MEAT STORE | La Cava del Corte",
  description: "Boutique premium de carnes selectas de Sonora, paquetes para amigos y parrilladas gourmet.",
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

  const promoBanner = content?.promoBanner || {
    visible: true,
    tag: "¡Gran Apertura MEAT STORE!",
    description: "Obtén 10% de descuento en tu primer pedido de cortes premium.",
    code: "MEATSTORE10",
    buttonText: "Aplicar en WhatsApp",
    whatsappUrl: "https://wa.me/523222018003?text=Hola!%20Quiero%20ordenar%20con%20el%20código%20de%20descuento%20MEATSTORE10",
  };

  const favoritesSection = content?.favoritesSection || {
    tag: "RECOMENDACIONES DE LA CASA",
    title: "Favoritos de Nuestros Clientes",
    description: "Selecciones diseñadas a la medida para cada tipo de ocasión, nivel de experiencia y antojo.",
    cards: [
      {
        id: "1",
        badge: "🥇 Para 2 personas",
        title: "Cena Íntima Premium",
        tag: "Reserva Doble",
        description: "Dos jugosos medallones de Ribeye de 400g cada uno. Perfectos para una velada especial o cena en pareja."
      },
      {
        id: "2",
        badge: "🥇 Para reunión de amigos",
        title: "Parrillada Familiar",
        tag: "Paquete Todo Incluido",
        description: "El combo ideal con Sirloin, chorizo artesanal, papas rellenas y tortillas de harina sonorenses. Rinde para 6 personas."
      },
      {
        id: "3",
        badge: "🥇 Para principiantes",
        title: "Iniciación al Asado",
        tag: "Fácil Preparación",
        description: "Delgados filetes de Sirloin y arrachera fina de cocción rápida. Ideal si estás iniciando en el arte de la parrilla."
      },
      {
        id: "4",
        badge: "🥇 Para parrilleros expertos",
        title: "El Desafío del Fuego",
        tag: "Cortes Gruesos",
        description: "Imponentes cortes de 2 o 3 pulgadas como el Tomahawk o Prime Rib. Requiere control de temperaturas y cocción indirecta."
      }
    ]
  };

  const monsterProduct = content?.monsterProduct || {
    visible: true,
    tag: "🔥 EL MONSTRUO DEL ASADOR",
    title: "Tomahawk Gigante",
    titleBold: "(1.8 kg)",
    description: "Nuestra pieza insignia definitiva: un colosal Tomahawk cortado grueso de 3 pulgadas con su característico hueso largo expuesto. Posee una infiltración de grasa excepcional y un marmoleado de campeonato que le otorga una jugosidad insuperable. Empacado individualmente al alto vacío en origen y congelado de inmediato. Es el reto definitivo para parrilleros expertos.",
    price: 1450,
    weight: "1.8 kg",
    thickness: "3.0\"",
    suggestion: "6 Personas",
    buttonText: "Ver Detalle del Monstruo",
    buttonLink: "/propiedades/el-monstruo-del-asador-tomahawk-gigante-1-8kg",
    imageUrl: "https://images.unsplash.com/photo-1628268909376-e8c44bb3153f?w=1000&auto=format&fit=crop&q=80",
  };

  return (
    <div className="flex flex-col bg-[#edf2f6] text-neutral-900">
      {/* 1. HERO SECTION */}
      <StoreHeroSlider slides={heroSlides} />

      {/* 1.2. BANNER DE OFERTA INICIAL */}
      {promoBanner.visible !== false && (
        <section className="bg-neutral-900 border-y border-gold-500/20 py-4 px-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.12),rgba(0,0,0,0))]" />
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 shrink-0">
                <Award className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-gold-400 text-lg font-semibold tracking-wide uppercase">
                  {promoBanner.tag}
                </h3>
                <p className="text-xs text-neutral-305 font-light mt-0.5">
                  {promoBanner.description}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {promoBanner.code && (
                <div className="px-4 py-2 bg-neutral-950 border border-dashed border-gold-400/40 rounded-sm font-mono text-sm text-gold-400 tracking-widest font-bold">
                  {promoBanner.code}
                </div>
              )}
              {promoBanner.whatsappUrl && (
                <a
                  href={promoBanner.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-semibold tracking-widest uppercase rounded-sm transition-all duration-300 shadow-md shadow-gold-400/10 hover:scale-102 font-bold"
                >
                  {promoBanner.buttonText || "Aplicar en WhatsApp"}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 1.5. VIDEO PROMOCIONAL REORDENADO (VIDEO PRIMERO, TEXTO DESPUÉS) */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          {/* Video Player First */}
          <div className="relative aspect-video w-full max-w-4xl mx-auto rounded-sm overflow-hidden border border-neutral-200 shadow-xl bg-black group mb-12">
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

          {/* Description text second */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-[#b01e28] font-bold">{videoSection.tag}</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-neutral-900">
              {videoSection.title}
            </h2>
            <p className="text-sm text-neutral-600 mt-4 max-w-xl mx-auto font-light leading-relaxed">
              {videoSection.description}
            </p>
          </div>
        </div>
      </section>

      {/* 1.8. FAVORITOS DE NUESTROS CLIENTES */}
      <section className="py-20 bg-neutral-950 text-white relative border-y border-gold-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(176,30,40,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">{favoritesSection.tag}</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-2 text-white">
              {favoritesSection.title}
            </h2>
            <p className="text-xs text-neutral-400 mt-3 max-w-lg mx-auto font-light leading-relaxed">
              {favoritesSection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {favoritesSection.cards?.map((card: any, idx: number) => (
              <div key={card.id || idx} className="bg-neutral-900 border border-neutral-800 rounded-sm p-6 flex flex-col justify-between hover:border-gold-400/40 transition-all duration-300 shadow-lg relative group">
                {card.badge && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-gold-400 text-obsidian text-[10px] font-bold tracking-widest uppercase rounded-sm shadow-md">
                    {card.badge}
                  </div>
                )}
                <div className="mt-4">
                  <h3 className="font-serif text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">{card.title}</h3>
                  {card.tag && (
                    <span className="text-[10px] text-gold-400/80 uppercase tracking-widest font-semibold block mt-1">{card.tag}</span>
                  )}
                  <p className="text-xs text-neutral-455 font-light mt-3 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-850 flex items-center justify-between">
                  <span className="text-xs text-neutral-500 font-medium">Recomendado</span>
                  <Link href="#catalogo" className="text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1 group/btn">
                    Ver cortes <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.2. SHOWCASE MONSTRUO DE PRODUCTO (TOMAHAWK GIGANTE 1.8KG) */}
      {monsterProduct.visible !== false && (
        <section className="py-24 bg-neutral-900 border-b border-gold-500/10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(176,30,40,0.12),transparent_70%)]" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Image section */}
              {monsterProduct.imageUrl && (
                <div className="lg:col-span-6 relative group rounded-sm overflow-hidden border border-gold-400/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent z-10" />
                  <img
                    src={monsterProduct.imageUrl}
                    alt={monsterProduct.title}
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute bottom-6 left-6 z-20">
                    <span className="px-3 py-1 bg-[#b01e28] text-white text-[10px] font-bold tracking-widest uppercase rounded-sm">
                      Corte Insignia
                    </span>
                  </div>
                </div>
              )}

              {/* Content section */}
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs uppercase tracking-[0.2em] text-gold-400 font-bold block">{monsterProduct.tag}</span>
                <h2 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
                  {monsterProduct.title} <br />
                  {monsterProduct.titleBold && (
                    <span className="text-gold-400 font-bold">{monsterProduct.titleBold}</span>
                  )}
                </h2>
                <p className="text-sm text-neutral-305 leading-relaxed font-light font-sans">
                  {monsterProduct.description}
                </p>
                
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-neutral-800 text-center sm:text-left">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold font-sans">Peso Aprox</span>
                    <span className="text-base sm:text-lg font-bold text-white mt-1 block">{monsterProduct.weight}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold font-sans">Grosor</span>
                    <span className="text-base sm:text-lg font-bold text-white mt-1 block">{monsterProduct.thickness}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold font-sans">Sugerencia</span>
                    <span className="text-base sm:text-lg font-bold text-white mt-1 block">{monsterProduct.suggestion}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-6 justify-between sm:justify-start">
                  <div>
                    <span className="text-xs text-neutral-500 block mb-1">Precio de Boutique</span>
                    <span className="font-serif text-3xl font-bold text-gold-400">
                      {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(monsterProduct.price || 0)}{" "}
                      <span className="text-xs font-sans text-neutral-400">MXN</span>
                    </span>
                  </div>
                  {monsterProduct.buttonLink && (
                    <Link
                      href={monsterProduct.buttonLink}
                      className="w-full sm:w-auto px-8 py-4 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm shadow-md hover:scale-102 flex items-center justify-center gap-1.5 font-bold"
                    >
                      {monsterProduct.buttonText}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 2.5. CORTES DESTACADOS (CARNE FRÍA) */}
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
