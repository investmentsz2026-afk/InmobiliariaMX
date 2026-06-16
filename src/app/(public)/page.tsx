import { Flame, Clock, MapPin, MessageCircle, Gift } from "lucide-react";
import { Metadata } from "next";
import GrillMenuInteractive from "@/components/public/GrillMenuInteractive";
import GrillBackground from "@/components/public/GrillBackground";
import GrillCarousel from "@/components/public/GrillCarousel";
import HomeContactForm from "@/components/public/HomeContactForm";
import GrillTestimonials from "@/components/public/GrillTestimonials";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Menú Zona Grill | La Cava del Corte",
  description: "Disfruta de nuestros cortes preparados al carbón los fines de semana. Parrilladas, papas rellenas con extra carne, BBQ y complementos.",
};

export default async function ZonaGrillPage() {
  const setting = await prisma.systemSetting.findUnique({
    where: { key: "grill_content" },
  });

  const content = setting ? (setting.value as any) : null;

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
      tag: "Sábados y Domingos",
      value: "GRATIS",
      title: "Papas Rellenas Especiales",
      description: "En la compra de cualquier Parrillada Familiar, llévate una papa rellena con extra carne de tu elección.",
    },
    {
      tag: "Pedido Online",
      value: "10% OFF",
      title: "Descuento por WhatsApp",
      description: "Menciona el código ZONAGRILL10 al ordenar por WhatsApp y obtén 10% en cortes para llevar.",
    },
    {
      tag: "Exclusivo Domingo",
      value: "$349",
      title: "Domingos de Costillar BBQ",
      description: "Llévate un costillar de cerdo BBQ completo, ahumado a la leña, listo para servir por solo $349.",
    },
  ];

  const testimonials = content?.testimonials || [];

  return (
    <div className="relative text-white min-h-screen -mt-24 pt-28 sm:pt-24 pb-20 font-sans selection:bg-red-650 selection:text-white overflow-hidden bg-[#050000]">
      {/* Animated Background */}
      <GrillBackground />

      {/* Decorative Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 z-50" />

      {/* Premium Cover / Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-10 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Captivating Texts */}
        <div className="lg:col-span-5 space-y-4 text-left lg:pt-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-500/20 text-red-500 text-[10px] tracking-widest uppercase font-bold rounded-full">
            <Flame className="w-3.5 h-3.5 animate-pulse text-red-500" />
            Experiencia de Asado Real
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Restaurante <br />
            <span className="text-amber-500 drop-shadow-[0_2px_10px_rgba(217,119,6,0.2)]">Zona Grill</span>
          </h1>
          <p className="text-neutral-300 text-sm leading-relaxed font-light">
            En **La Cava del Corte** encendemos las brasas de mezquite cada fin de semana. Preparamos parrilladas selectas, costillares caramelizados y papas rellenas con carne premium al carbón natural, listos para deleitar tu paladar.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#menu-section"
              className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white border border-amber-600/20 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm shadow-md hover:shadow-red-900/40 flex items-center justify-center cursor-pointer"
            >
              Ver Menú del Asador
            </a>
            <a
              href="https://wa.me/523222018003?text=Hola,%20quisiera%20hacer%20un%20pedido%20o%20reservar%20de%20la%20Zona%20Grill."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center"
            >
              Pedir por WhatsApp
            </a>
          </div>

          {/* Quick Details List */}
          <div className="pt-6 border-t border-red-950/40 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-amber-500/70 font-bold">Horarios</span>
              <span className="text-neutral-200 font-medium">Sábados y Domingos: 14:00 - 19:00</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-amber-500/70 font-bold">Ubicación</span>
              <span className="text-neutral-200 font-medium">Valle Oriente, Monterrey</span>
            </div>
          </div>

          {/* Callout / Marketing Text */}
          <div className="pt-4 border-t border-red-950/20 text-left">
            <p className="font-serif italic text-xs md:text-sm text-amber-400/90 font-medium leading-relaxed">
              "Seleccionamos exclusivamente cortes de alta gama, madurados artesanalmente y asados al fuego vivo de mezquite natural. La verdadera experiencia gourmet de la alta parrilla."
            </p>
          </div>
        </div>

        {/* Right Side: Visual Image Grid Showcase */}
        <div className="lg:col-span-7 grid grid-cols-12 gap-4">
          {/* Main Large Image */}
          <div className="col-span-8 relative aspect-[4/3] rounded-sm overflow-hidden border border-amber-500/20 shadow-lg group">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
              alt="Corte prime asándose en la parrilla"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-red-700/90 text-white text-[9px] font-bold uppercase tracking-widest rounded-xs">
              Al Carbón de Mezquite
            </span>
          </div>

          {/* Two Stacked Small Images */}
          <div className="col-span-4 flex flex-col gap-4">
            <div className="flex-1 relative aspect-[4/3] sm:aspect-square rounded-sm overflow-hidden border border-amber-500/20 shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80"
                alt="Brasas de carbón caliente"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex-1 relative aspect-[4/3] sm:aspect-square rounded-sm overflow-hidden border border-amber-500/20 shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&auto=format&fit=crop&q=80"
                alt="Costillares a la barbacoa preparados"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* Bottom Banner Image (Cozy Restaurant/Prep) */}
          <div className="col-span-12 relative aspect-[21/9] rounded-sm overflow-hidden border border-amber-500/20 shadow-md group">
            <img
              src="https://images.unsplash.com/photo-1558030006-450675393462?w=1000&auto=format&fit=crop&q=80"
              alt="Preparación y sazón del corte al fuego"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 text-white text-left">
              <span className="block text-[8px] uppercase tracking-widest text-amber-500 font-bold">100% Calidad Sonora</span>
              <span className="font-serif text-sm font-semibold">Sabor e Ingredientes de Origen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Video & Promotions Section */}
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
              <p className="text-neutral-300 text-sm mt-3 font-light leading-relaxed">
                {videoSection.description}
              </p>
            </div>

            <div className="relative aspect-video w-full rounded-sm overflow-hidden border border-amber-500/25 shadow-[0_10px_40px_rgba(217,119,6,0.15)] bg-black group">
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
              
              <video
                autoPlay
                loop
                muted
                playsInline
                controls
                poster={videoSection.posterUrl}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              >
                <source
                  src={videoSection.videoUrl}
                  type="video/mp4"
                />
                Tu navegador no soporta reproducción de video.
              </video>

              {/* Decorative amber frame */}
              <div className="absolute inset-0 border border-amber-500/20 m-4 pointer-events-none rounded-xs z-20" />
            </div>
          </div>

          {/* Right: Weekend Promotions Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-amber-500/20 bg-[#0a0707] p-8 rounded-sm shadow-xl relative overflow-hidden">
              {/* Glow accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="font-serif text-lg tracking-wider text-amber-500 uppercase font-bold mb-6 border-b border-amber-500/10 pb-3 flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" />
                Promociones del Fin de Semana
              </h3>

              <div className="space-y-4">
                {promotions.map((promo: any, index: number) => {
                  const isAmberBadge = index === 1;
                  return (
                    <div key={index} className="p-4 bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all duration-300 rounded-sm group">
                      <div className="flex justify-between items-start">
                        <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-xs ${
                          isAmberBadge 
                            ? "bg-amber-500 text-black" 
                            : "bg-red-600/90 text-white"
                        }`}>
                          {promo.tag}
                        </span>
                        <span className="text-amber-500 font-serif font-bold text-xs">{promo.value}</span>
                      </div>
                      <h4 className="text-neutral-200 text-sm font-semibold mt-2 group-hover:text-amber-500 transition-colors">
                        {promo.title}
                      </h4>
                      <p className="text-neutral-400 text-xs mt-1 font-light whitespace-pre-line leading-relaxed">
                        {promo.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Animated Image Carousel */}
      <GrillCarousel slides={carouselSlides} />

      {/* Interactive Grill Menu Grid */}
      <div id="menu-section" className="max-w-7xl mx-auto px-6 relative z-10 pt-12 border-t border-amber-500/10">
        <GrillMenuInteractive />
      </div>

      {/* Sobre Nosotros Section */}
      <section id="nosotros" className="max-w-7xl mx-auto px-6 relative z-10 py-24 border-t border-amber-500/10 bg-[#0a0707]/90 mt-16 rounded-sm shadow-2xl border border-amber-500/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-500/20 text-red-500 text-[10px] tracking-widest uppercase font-bold rounded-full">
              {aboutSection.tag}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {aboutSection.title}
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed font-light">
              {aboutSection.paragraph1}
            </p>
            <p className="text-neutral-300 text-sm leading-relaxed font-light">
              {aboutSection.paragraph2}
            </p>
            <div className="pt-6 grid grid-cols-2 gap-6 border-t border-red-950/40">
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
            <div className="absolute bottom-4 left-4 border-l-2 border-amber-500 pl-3">
              <span className="block text-[8px] uppercase tracking-widest text-amber-500 font-bold">Maestros del Asador</span>
              <span className="text-white text-xs font-semibold">El Secreto de la Cocción Perfecta</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <GrillTestimonials reviews={testimonials} />

      {/* Contacto Section */}
      <section id="contacto" className="max-w-7xl mx-auto px-6 relative z-10 py-24 border-t border-amber-500/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-500/20 text-red-500 text-[10px] tracking-widest uppercase font-bold rounded-full">
              Ponte en Contacto
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              ¿Listo para encender <br />
              <span className="text-amber-500">las brasas?</span>
            </h2>
            <p className="text-neutral-300 text-sm leading-relaxed font-light">
              Escríbenos para programar tu pedido, reservar paquetes de asado familiar o cotizar servicios de parrilladas completas a domicilio para tus eventos corporativos y reuniones privadas.
            </p>
            
            <div className="pt-8 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-full text-amber-500 shadow-md">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Pedidos y Cotizaciones</h4>
                  <p className="text-sm text-neutral-200 font-semibold">WhatsApp: 322 201 8003</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-full text-amber-500 shadow-md">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Horario Zona Grill</h4>
                  <p className="text-sm text-neutral-200 font-semibold">Sábados y Domingos: 14:00 - 19:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-full text-amber-500 shadow-md">
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
