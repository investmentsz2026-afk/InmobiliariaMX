import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_GRILL_CONTENT = {
  videoSection: {
    tag: "Experiencia Sensorial",
    title: "El Arte del Fuego en Vivo",
    description: "Mira cómo se encienden nuestras brasas de mezquite natural y cómo preparamos cada corte premium al momento para asegurar la jugosidad y el término perfecto.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-barbecue-steaks-cooking-on-grill-42284-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80",
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
