import { Flame, Clock, MapPin, MessageCircle, Gift, Star, Compass, HelpCircle, ShoppingBag, Utensils, MessageSquare, DollarSign, Calculator } from "lucide-react";
import { Metadata } from "next";
import GrillMenuInteractive from "@/components/public/GrillMenuInteractive";
import GrillBackground from "@/components/public/GrillBackground";
import GrillCarousel from "@/components/public/GrillCarousel";
import HomeContactForm from "@/components/public/HomeContactForm";
import GrillTestimonials from "@/components/public/GrillTestimonials";
import SectionDivider from "@/components/public/SectionDivider";
import GrillHeroSlider from "@/components/public/GrillHeroSlider";
import GrillFavorites from "@/components/public/GrillFavorites";
import SensoryVideoPlayer from "@/components/public/SensoryVideoPlayer";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Menú Zona Grill | La Cava del Corte",
  description: "Disfruta de nuestros cortes preparados al carbón los fines de semana. Parrilladas, papas rellenas con extra carne, BBQ y complementos.",
};

export const revalidate = 0;

export default async function ZonaGrillPage() {
  const setting = await prisma.systemSetting.findUnique({
    where: { key: "grill_content" },
  });

  const content = setting ? (setting.value as any) : null;

  // Query actual active products to showcase in Favorites
  const products = await prisma.grillProduct.findMany({
    where: { isActive: true },
  });

  const videoSection = content?.videoSection || {
    tag: "Experiencia Sensorial",
    title: "El Arte del Fuego en Vivo",
    description: "Mira cómo se encienden nuestras brasas de mezquite natural y cómo preparamos cada corte premium al momento para asegurar la jugosidad y el término perfecto.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-barbecue-steaks-cooking-on-grill-42284-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80",
  };

  const aboutSection = content?.aboutSection || {
    tag: "Nuestra Historia",
    title: "Calidad de Origen y Pasión por el Carbón de Mezquite",
    paragraph1: "En La Cava del Corte encendemos las brasas con un propósito claro: ofrecerte la experiencia definitiva de asado. No es solo comida, es un ritual. Cada fin de semana, seleccionamos exclusivamente los cortes más finos de res de Sonora, madurados artesanalmente y cocinados lentamente a fuego vivo con leña y carbón de mezquite 100% natural.",
    paragraph2: "Nuestros maestros parrilleros controlan la temperatura y el humo para obtener cortes increíblemente tiernos, con ese aroma inconfundible y costras caramelizadas que despiertan pasiones. Si buscas el verdadero sabor de la alta parrilla gourmet, estás en el lugar correcto.",
    stat1Value: "Sonora",
    stat1Label: "Cortes Premium de Origen",
    stat2Value: "100%",
    stat2Label: "Leña de Mezquite Natural",
    imageUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&auto=format&fit=crop&q=80",
  };

  const carouselSlides = content?.carouselSlides || [];

  const promotions = content?.promotions || [
    {
      tag: "ESPECIAL DEL CHEF",
      value: "GRATIS",
      title: "Papas Rellenas Especiales",
      description: "En la compra de cualquier Parrillada Familiar, llévate una papa rellena con extra carne de tu elección.",
    },
    {
      tag: "PIZZA DE TEMPORADA",
      value: "10% OFF",
      title: "Nuevos ingredientes, mismo sabor",
      description: "Menciona el código ZONAGRILL10 al ordenar por WhatsApp y obtén 10% en cortes para llevar.",
    },
    {
      tag: "PAPA ESPECIAL",
      value: "$349",
      title: "Edición limitada este fin de semana",
      description: "Llévate un costillar de cerdo BBQ completo, ahumado a la leña, listo para servir por solo $349.",
    },
  ];

  const testimonials = content?.testimonials || [];
  const testimonialsSection = content?.testimonialsSection || {
    title: "LO QUE DICEN NUESTROS CLIENTES",
    buttonText: "Ver más reseñas",
    buttonLink: "https://wa.me/523222018003?text=Hola,%20quisiera%20enviar%20una%20reseña%20sobre%20mi%20experiencia%20en%20la%20Zona%20Grill.",
  };

  const heroSlides = content?.heroSlides || [
    {
      id: 1,
      tag: "SOLO SERVICIO A DOMICILIO",
      title: "LA CAVA\nDEL CORTE",
      description: "Las mejores brasas merecen los mejores cortes.",
      mediaType: "IMAGE",
      mediaUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      tag: "SÁBADOS Y DOMINGOS",
      title: "CORTES PREMIUM",
      description: "Disfruta de la mejor carne asada con leña y carbón de mezquite 100% natural.",
      mediaType: "IMAGE",
      mediaUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1000&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      tag: "ESPECIALIDADES AL CARBÓN",
      title: "PAPAS RELLENAS",
      description: "Nuestras famosas papas con puré cremoso, queso fundido y abundante carne de tu elección.",
      mediaType: "IMAGE",
      mediaUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&auto=format&fit=crop&q=80",
    },
  ];

  const howItWorksSection = content?.howItWorksSection || {
    title: "¿CÓMO FUNCIONA?",
    step1Title: "Elige tu menú",
    step1Desc: "Descubre nuestras deliciosas opciones al carbón.",
    step2Title: "Escribe por WhatsApp",
    step2Desc: "Realiza tu pedido fácil y rápido con un par de clics.",
    step3Title: "Calculamos envío",
    step3Desc: "Te confirmamos el tiempo y el costo estimado de entrega.",
    step4Title: "Cocina al momento",
    step4Desc: "Todo preparado de forma artesanal al fuego natural.",
    step5Title: "Recíbelo en casa",
    step5Desc: "Y disfruta del aroma y sabor de la parrilla en tu mesa.",
  };

  const favoritesSection = content?.favoritesSection || {
    title: "LOS FAVORITOS DE LA CASA",
    buttonText: "Ver todos los favoritos",
  };

  const promotionsTitleSection = content?.promotionsTitleSection || {
    title: "NOVEDADES Y OFERTAS",
    buttonText: "Ver todas las novedades",
  };

  // Map 4 favorites dishes from db, or fallback to beautiful presets
  const fallbackFavorites = [
    {
      id: "fallback-1",
      name: "PAPA PRIME RIB",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
      category: "Papas Rellenas",
      price: 189,
      description: "Nuestra famosa papa rellena de puré cremoso, queso fundido y abundante Prime Rib al carbón.",
    },
    {
      id: "fallback-2",
      name: "RESERVA DOBLE",
      image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80",
      category: "Cortes Premium",
      price: 499,
      description: "Doble porción de nuestros mejores cortes de res selectos, asados lentamente al carbón de mezquite.",
    },
    {
      id: "fallback-3",
      name: "PIZZA MAR Y TIERRA",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
      category: "Especialidades",
      price: 289,
      description: "Pizza artesanal cocida a la parrilla, con camarones seleccionados, arrachera premium y queso fundido.",
    },
    {
      id: "fallback-4",
      name: "QUESA CAVA",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
      category: "Quesadillas",
      price: 149,
      description: "Quesadilla gigante dorada a las brasas, rellena de queso asadero y carne asada al carbón de la casa.",
    },
  ];

  const dbFavorites = products.slice(0, 4).map((p) => ({
    id: p.id,
    name: p.name,
    image: p.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    category: p.category,
    price: p.price,
    description: p.description,
  }));

  const selectedFavIds = content?.favoritesSection?.productIds || [];
  const chosenFavorites = selectedFavIds
    .map((id: string) => products.find((p) => p.id === id))
    .filter(Boolean)
    .map((p: any) => ({
      id: p.id,
      name: p.name,
      image: p.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
      category: p.category,
      price: p.price,
      description: p.description,
    }));

  const activeFavorites = chosenFavorites.length > 0 ? chosenFavorites : (dbFavorites.length >= 4 ? dbFavorites : fallbackFavorites);

  // Promos Unsplash images mapping based on indexes
  const promoImages = [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&auto=format&fit=crop&q=80",
  ];

  return (
    <div className="relative text-white min-h-screen -mt-24 pt-28 sm:pt-24 pb-20 font-sans selection:bg-red-650 selection:text-white overflow-hidden bg-[#050505]">
      {/* Animated Background */}
      <GrillBackground />

      {/* Decorative Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent z-50" />

      {/* 1. Portada (Slider) */}
      <GrillHeroSlider slides={heroSlides} />

      {/* 2. Nuestro Menú */}
      <div id="menu-section" className="max-w-7xl mx-auto px-6 relative z-10 pt-4">
        <GrillMenuInteractive />
      </div>

      {/* 3. Nuestra Historia (Sobre Nosotros) */}
      <section id="nosotros" className="max-w-7xl mx-auto px-6 relative z-10 py-24 border-t border-amber-500/10 bg-[#0c0c0c]/80 mt-16 rounded-sm shadow-2xl border border-amber-500/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-650/15 border border-red-500/20 text-red-400 text-[10px] tracking-widest uppercase font-bold rounded-full">
              {aboutSection.tag}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {aboutSection.title}
            </h2>
            <p className="text-sm text-neutral-250 leading-relaxed font-normal">
              {aboutSection.paragraph1}
            </p>
            <p className="text-sm text-neutral-250 leading-relaxed font-normal">
              {aboutSection.paragraph2}
            </p>
            <div className="pt-6 grid grid-cols-2 gap-6 border-t border-neutral-900">
              <div>
                <span className="font-serif text-3xl font-extrabold text-amber-500">{aboutSection.stat1Value}</span>
                <p className="text-[10px] uppercase text-neutral-400 tracking-widest mt-1">{aboutSection.stat1Label}</p>
              </div>
              <div>
                <span className="font-serif text-3xl font-extrabold text-amber-500">{aboutSection.stat2Value}</span>
                <p className="text-[10px] uppercase text-neutral-400 tracking-widest mt-1">{aboutSection.stat2Label}</p>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-amber-500/20 shadow-2xl group">
            <img
              src={aboutSection.imageUrl}
              alt="Cortes de carne en la parrilla caliente"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 border-l-2 border-amber-500 pl-3 text-left">
              <span className="block text-[8px] uppercase tracking-widest text-amber-500 font-bold">Maestros del Asador</span>
              <span className="text-white text-xs font-semibold">El Secreto de la Cocción Perfecta</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Los Favoritos de la Casa (Interactive Shopping Cart integration) */}
      <GrillFavorites
        favorites={activeFavorites}
        title={favoritesSection.title}
        buttonText={favoritesSection.buttonText}
      />

      {/* 5. Testimonios */}
      <GrillTestimonials
        reviews={testimonials}
        title={testimonialsSection.title}
        buttonText={testimonialsSection.buttonText}
        buttonLink={testimonialsSection.buttonLink}
      />

      {/* 6. Novedades o Ofertas */}
      <section className="max-w-7xl mx-auto px-6 relative z-10 py-12">
        <SectionDivider title={promotionsTitleSection.title} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {promotions.slice(0, 3).map((promo: any, idx: number) => (
            <div
              key={idx}
              className="bg-[#0c0c0c] border border-amber-500/10 hover:border-amber-500/35 p-6 rounded-sm shadow-xl flex items-center justify-between gap-4 relative overflow-hidden transition-all duration-300 group hover:-translate-y-1"
            >
              {/* Internal glow */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-650/[0.01] rounded-full blur-2xl pointer-events-none" />

              {/* Left Side Texts */}
              <div className="flex-1 text-left">
                <span className="inline-block px-2 py-0.5 bg-red-750/90 text-white text-[8px] tracking-widest font-black rounded-xs uppercase mb-3">
                  {promo.tag}
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-white uppercase leading-snug group-hover:text-gold-400 transition-colors">
                  {promo.title}
                </h3>
                <p className="text-xs text-neutral-250 font-normal leading-relaxed mt-2 line-clamp-3">
                  {promo.description}
                </p>
                
                <a
                  href="https://wa.me/523222018003?text=Hola,%20quisiera%20ordenar%20la%20promoción:%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 py-2 bg-red-750 hover:bg-red-650 text-white text-[9px] font-bold tracking-widest uppercase transition-all duration-300 rounded-xs border-none"
                >
                  ¡Pídela ya!
                </a>
              </div>

              {/* Right Side Circular Image */}
              <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-amber-500/20 group-hover:border-amber-500/45 transition-colors duration-300 relative shadow-lg">
                <img
                  src={promoImages[idx] || promoImages[0]}
                  alt={promo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom outlined gold button */}
        <div className="text-center mt-10">
          <a
            href="https://wa.me/523222018003?text=Hola,%20quisiera%20saber%20más%20sobre%20las%20novedades%20y%20ofertas%20de%20la%20Zona%20Grill."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-amber-500/60 hover:border-amber-500 text-gold-400 hover:text-black hover:bg-amber-500 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer"
          >
            {promotionsTitleSection.buttonText}
          </a>
        </div>
      </section>

      {/* 7. Experiencia Sensorial */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative z-10 border-t border-amber-500/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Interactive Video Player */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-left mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] tracking-widest uppercase font-bold rounded-full">
                <Flame className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                {videoSection.tag}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-2 leading-tight">
                {videoSection.title}
              </h2>
              <p className="text-neutral-200 text-sm mt-3 font-light leading-relaxed">
                {videoSection.description}
              </p>
            </div>

            <div className="relative aspect-video w-full rounded-sm overflow-hidden border border-amber-500/25 shadow-[0_10px_40px_rgba(217,119,6,0.15)] bg-black group">
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
              
              <SensoryVideoPlayer
                videoUrl={videoSection.videoUrl}
                posterUrl={videoSection.posterUrl}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              />

              {/* Decorative amber frame */}
              <div className="absolute inset-0 border border-amber-500/20 m-4 pointer-events-none rounded-xs z-20" />
            </div>
          </div>

          {/* Right side metric showcase / History callout */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-amber-500/15 bg-[#0a0707] p-8 rounded-sm shadow-xl relative overflow-hidden text-left">
              {/* Glow accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-650/5 rounded-full blur-2xl pointer-events-none" />
              
              <span className="text-[10px] tracking-wider text-amber-500 font-bold uppercase block mb-3">{videoSection.calloutTag || "La Mística de las Brasas"}</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight mb-4">
                {videoSection.calloutTitle || "El Secreto de una Cocción al Mezquite Natural"}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-250 font-normal leading-relaxed mb-6">
                {videoSection.calloutDesc || "No asamos carne, creamos experiencias memorables. Controlamos la temperatura and el humo para lograr cortes jugosos, tiernos y con esa costra caramelizada inconfundible."}
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-neutral-900 pt-6">
                <div>
                  <span className="font-serif text-3xl font-extrabold text-amber-500">{videoSection.calloutStat1Value || "100%"}</span>
                  <p className="text-[9px] uppercase text-neutral-400 tracking-widest mt-1">{videoSection.calloutStat1Label || "Carbón de Mezquite"}</p>
                </div>
                <div>
                  <span className="font-serif text-3xl font-extrabold text-amber-500">{videoSection.calloutStat2Value || "Gourmet"}</span>
                  <p className="text-[9px] uppercase text-neutral-400 tracking-widest mt-1">{videoSection.calloutStat2Label || "Cortes Premium Sonora"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Galería del Chef */}
      <GrillCarousel slides={carouselSlides} />

      {/* 9. Cómo funciona */}
      <section className="max-w-7xl mx-auto px-6 relative z-10 py-12">
        <SectionDivider title={howItWorksSection.title} />

        <div className="relative flex flex-col md:flex-row items-stretch justify-between gap-8 md:gap-4 max-w-5xl mx-auto py-8 px-4 mt-6">
          {/* Dashed line background on desktop */}
          <div className="absolute top-[45px] left-8 right-8 h-[1px] border-t border-dashed border-amber-500/20 -translate-y-1/2 hidden md:block z-0" />

          {/* Step 1 */}
          <div className="flex-1 flex flex-col items-center text-center group z-10 relative bg-[#050505] px-2">
            <div className="relative w-16 h-16 rounded-full border border-amber-500/20 bg-[#0c0c0c] flex items-center justify-center text-amber-500 group-hover:border-amber-500/75 transition-all duration-300 shadow-xl shadow-black">
              <Utensils className="w-6 h-6" />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center border border-black select-none">
                1
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-4">{howItWorksSection.step1Title}</h4>
            <p className="text-[10px] sm:text-xs text-neutral-400 max-w-[150px] mx-auto mt-1 font-light leading-relaxed">
              {howItWorksSection.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex-1 flex flex-col items-center text-center group z-10 relative bg-[#050505] px-2">
            <div className="relative w-16 h-16 rounded-full border border-amber-500/20 bg-[#0c0c0c] flex items-center justify-center text-amber-500 group-hover:border-amber-500/75 transition-all duration-300 shadow-xl shadow-black">
              <MessageSquare className="w-6 h-6 animate-pulse" />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center border border-black select-none">
                2
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-4">{howItWorksSection.step2Title}</h4>
            <p className="text-[10px] sm:text-xs text-neutral-400 max-w-[150px] mx-auto mt-1 font-light leading-relaxed">
              {howItWorksSection.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex-1 flex flex-col items-center text-center group z-10 relative bg-[#050505] px-2">
            <div className="relative w-16 h-16 rounded-full border border-amber-500/20 bg-[#0c0c0c] flex items-center justify-center text-amber-500 group-hover:border-amber-500/75 transition-all duration-300 shadow-xl shadow-black">
              <Calculator className="w-6 h-6" />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center border border-black select-none">
                3
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-4">{howItWorksSection.step3Title}</h4>
            <p className="text-[10px] sm:text-xs text-neutral-400 max-w-[150px] mx-auto mt-1 font-light leading-relaxed">
              {howItWorksSection.step3Desc}
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex-1 flex flex-col items-center text-center group z-10 relative bg-[#050505] px-2">
            <div className="relative w-16 h-16 rounded-full border border-amber-500/20 bg-[#0c0c0c] flex items-center justify-center text-amber-500 group-hover:border-amber-500/75 transition-all duration-300 shadow-xl shadow-black">
              <Flame className="w-6 h-6" />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center border border-black select-none">
                4
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-4">{howItWorksSection.step4Title}</h4>
            <p className="text-[10px] sm:text-xs text-neutral-400 max-w-[150px] mx-auto mt-1 font-light leading-relaxed">
              {howItWorksSection.step4Desc}
            </p>
          </div>

          {/* Step 5 */}
          <div className="flex-1 flex flex-col items-center text-center group z-10 relative bg-[#050505] px-2">
            <div className="relative w-16 h-16 rounded-full border border-amber-500/20 bg-[#0c0c0c] flex items-center justify-center text-amber-500 group-hover:border-amber-500/75 transition-all duration-300 shadow-xl shadow-black">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center border border-black select-none">
                5
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mt-4">{howItWorksSection.step5Title}</h4>
            <p className="text-[10px] sm:text-xs text-neutral-400 max-w-[150px] mx-auto mt-1 font-light leading-relaxed">
              {howItWorksSection.step5Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 10. Contacto (Static at bottom) */}
      <section id="contacto" className="max-w-7xl mx-auto px-6 relative z-10 py-24 border-t border-amber-500/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6 text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-650/15 border border-red-500/20 text-red-400 text-[10px] tracking-widest uppercase font-bold rounded-full">
              Ponte en Contacto
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              ¿Listo para encender <br />
              <span className="text-amber-500">las brasas?</span>
            </h2>
            <p className="text-sm text-neutral-250 leading-relaxed font-normal">
              Escríbenos para programar tu pedido, reservar paquetes de asado familiar o cotizar servicios de parrilladas completas a domicilio para tus eventos corporativos y reuniones privadas.
            </p>
            
            <div className="pt-8 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-650/15 border border-red-500/20 rounded-full text-amber-500 shadow-md">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Pedidos y Cotizaciones</h4>
                  <p className="text-sm text-neutral-200 font-semibold">WhatsApp: 322 201 8003</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-650/15 border border-red-500/20 rounded-full text-amber-500 shadow-md">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Horario Zona Grill</h4>
                  <p className="text-sm text-neutral-200 font-semibold">Sábados y Domingos: 14:00 - 19:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-650/15 border border-red-500/20 rounded-full text-amber-500 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Ubicación</h4>
                  <p className="text-sm text-neutral-200 font-semibold">Valle Oriente, Monterrey</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0c0c0c]/80 border border-amber-500/20 p-8 rounded-sm shadow-2xl relative">
            {/* Ambient fire glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/10 to-amber-500/10 rounded-sm blur-md opacity-75 pointer-events-none" />
            <div className="relative z-10">
              <HomeContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
