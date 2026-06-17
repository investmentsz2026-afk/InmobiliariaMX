import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_GRILL_CONTENT = {
  videoSection: {
    tag: "Experiencia Sensorial",
    title: "El Arte del Fuego en Vivo",
    description: "Mira cómo se encienden nuestras brasas de mezquite natural y cómo preparamos cada corte premium al momento para asegurar la jugosidad y el término perfecto.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-barbecue-steaks-cooking-on-grill-42284-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80",
    calloutTag: "La Mística de las Brasas",
    calloutTitle: "El Secreto de una Cocción al Mezquite Natural",
    calloutDesc: "No asamos carne, creamos experiencias memorables. Controlamos la temperatura y el humo para lograr cortes jugosos, tiernos y con esa costra caramelizada inconfundible.",
    calloutStat1Value: "100%",
    calloutStat1Label: "Carbón de Mezquite",
    calloutStat2Value: "Gourmet",
    calloutStat2Label: "Cortes Premium Sonora",
  },
  aboutSection: {
    tag: "Nuestra Historia",
    title: "Calidad de Origen y Pasión por el Carbón de Mezquite",
    paragraph1: "En La Cava del Corte encendemos las brasas con un propósito claro: ofrecerte la experiencia definitiva de asado. No es solo comida, es un ritual. Cada fin de semana, seleccionamos exclusivamente los cortes más finos de res de Sonora, madurados artesanalmente y cocinados lentamente a fuego vivo con leña y carbón de mezquite 100% natural.",
    paragraph2: "Nuestros maestros parrilleros controlan la temperatura y el humo para obtener cortes increíblemente tiernos, con ese aroma inconfundible y costras caramelizadas que despiertan pasiones. Si buscas el verdadero sabor de la alta parrilla gourmet, estás en el lugar correcto.",
    stat1Value: "Sonora",
    stat1Label: "Cortes Premium de Origen",
    stat2Value: "100%",
    stat2Label: "Leña de Mezquite Natural",
    imageUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&auto=format&fit=crop&q=80",
  },
  carouselSlides: [
    {
      id: 1,
      image: "/images/car1.jpeg",
      tag: "SELECCIÓN PRESTIGE",
      title: "CORTES PREMIUM",
      subtitle: "Marmoleo perfecto y calidad prime",
      description: "Cada pieza es seleccionada bajo los más altos estándares de calidad, asegurando una suavidad extrema y un sabor inolvidable en tu paladar.",
    },
    {
      id: 2,
      image: "/images/car2.jpeg",
      tag: "EL ARTE DEL FUEGO",
      title: "FUEGO Y MEZQUITE",
      subtitle: "El auténtico sabor del carbón natural",
      description: "Nuestras brasas de mezquite aportan ese toque ahumado clásico y rústico que sella los jugos and potencia el aroma de cada corte.",
    },
    {
      id: 3,
      image: "/images/car3.jpeg",
      tag: "MADURACIÓN LENTA",
      title: "MADURACIÓN ARTESANAL",
      subtitle: "Sabor y textura en su punto máximo",
      description: "Sometemos nuestras piezas a un riguroso proceso de maduración para suavizar las fibras y concentrar la riqueza de sus jugos naturales.",
    },
    {
      id: 4,
      image: "/images/car4.png",
      tag: "ESPECIALIDADES DE AUTOR",
      title: "CREACIONES GRILL",
      subtitle: "El toque único de nuestro asador",
      description: "Sorpréndete con nuestras papas rellenas rebosantes de carne premium, quesacavas fundidas y complementos que realzan la experiencia.",
    },
    {
      id: 5,
      image: "/images/car5.png",
      tag: "SABOR A LA CARTA",
      title: "BANQUETE DE LUJO",
      subtitle: "La mística de la alta parrilla en tu mesa",
      description: "Creamos un ambiente insuperable de terraza gourmet para que compartas los mejores momentos con las mejores carnes de la región.",
    },
  ],
  promotions: [
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
  ],
  testimonials: [
    {
      id: 1,
      text: "El costillar BBQ de leña de mezquite de los domingos es insuperable. Se deshace en la boca, caramelizado a la perfección. La mejor alta parrilla gourmet de la ciudad.",
      author: "Carlos Villalobos",
      role: "Cliente de Fin de Semana",
    },
    {
      id: 2,
      text: "Las Papas Rellenas Especiales con extra carne son una joya. Pedimos por WhatsApp cada sábado y el servicio es muy rápido y la comida llega caliente.",
      author: "Mariana G. Treviño",
      role: "Comensal Frecuente",
    },
    {
      id: 3,
      text: "Un concepto de asado espectacular. El sabor ahumado y rústico del mezquite natural que logran en cada corte de carne es arte puro. 100% recomendados.",
      author: "Chef Roberto Leal",
      role: "Crítico Gastronómico",
    },
  ],
  heroSlides: [
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
  ],
  howItWorksSection: {
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
  },
  favoritesSection: {
    title: "LOS FAVORITOS DE LA CASA",
    buttonText: "Ver todos los favoritos",
  },
  promotionsTitleSection: {
    title: "NOVEDADES Y OFERTAS",
    buttonText: "Ver todas las novedades",
  },
  testimonialsSection: {
    title: "LO QUE DICEN NUESTROS CLIENTES",
    buttonText: "Ver más reseñas",
    buttonLink: "https://wa.me/523222018003?text=Hola,%20quisiera%20enviar%20una%20reseña%20sobre%20mi%20experiencia%20en%20la%20Zona%20Grill.",
  },
};

export async function GET(req: NextRequest) {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "grill_content" },
    });

    if (!setting) {
      return NextResponse.json(DEFAULT_GRILL_CONTENT);
    }

    // Return stored content merged with default structure to prevent missing fields issues
    const data = setting.value as any;
    return NextResponse.json({
      videoSection: { ...DEFAULT_GRILL_CONTENT.videoSection, ...data.videoSection },
      aboutSection: { ...DEFAULT_GRILL_CONTENT.aboutSection, ...data.aboutSection },
      carouselSlides: data.carouselSlides || DEFAULT_GRILL_CONTENT.carouselSlides,
      promotions: data.promotions || DEFAULT_GRILL_CONTENT.promotions,
      testimonials: data.testimonials || DEFAULT_GRILL_CONTENT.testimonials,
      heroSlides: data.heroSlides || DEFAULT_GRILL_CONTENT.heroSlides,
      howItWorksSection: { ...DEFAULT_GRILL_CONTENT.howItWorksSection, ...data.howItWorksSection },
      favoritesSection: { ...DEFAULT_GRILL_CONTENT.favoritesSection, ...data.favoritesSection },
      promotionsTitleSection: { ...DEFAULT_GRILL_CONTENT.promotionsTitleSection, ...data.promotionsTitleSection },
      testimonialsSection: { ...DEFAULT_GRILL_CONTENT.testimonialsSection, ...data.testimonialsSection },
    });
  } catch (error) {
    console.error("Error fetching grill content:", error);
    return NextResponse.json({ error: "No se pudo obtener el contenido de Zona Grill" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const updatedSetting = await prisma.systemSetting.upsert({
      where: { key: "grill_content" },
      update: { value: body },
      create: { key: "grill_content", value: body },
    });

    return NextResponse.json(updatedSetting.value);
  } catch (error) {
    console.error("Error updating grill content:", error);
    return NextResponse.json({ error: "No se pudo actualizar el contenido de Zona Grill" }, { status: 500 });
  }
}
