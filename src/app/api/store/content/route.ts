import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_STORE_CONTENT = {
  videoSection: {
    tag: "EXPERIENCIA SENSORIAL",
    title: "El Arte del Fuego & La Brasa",
    description: "Mira cómo seleccionamos cada pieza y encendemos las brasas de mezquite para ofrecerte la máxima jugosidad y el sabor auténtico de la parrilla.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-barbecue-steaks-cooking-on-grill-42284-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80",
  },
  aboutSection: {
    tag: "CONCEPTO INTEGRAL",
    title: "Calidad de Origen, Suavidad y Pasión por el Fuego",
    paragraph1: "En La Cava del Corte fusionamos dos mundos bajo una sola pasión: el fuego. Nuestro negocio integral te ofrece una Zona de Carne Congelada Fría con los cortes crudos premium más selectos de Sonora, empacados al alto vacío individualmente en origen. Esto asegura que la maduración y la frescura de la carne se mantengan intactas hasta tu asador.",
    paragraph2: "Y si prefieres que nosotros hagamos el trabajo, los fines de semana encendemos las brasas en nuestra Zona Grill, ofreciendo parrilladas, papas rellenas y costillares BBQ cocinados a fuego lento con leña y carbón de mezquite, listos para comer o pedir a domicilio.",
    stat1Value: "100%",
    stat1Label: "Ganado de Sonora",
    stat2Value: "Alto Vacío",
    stat2Label: "Frescura Garantizada",
    imageUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&auto=format&fit=crop&q=80",
  },
  testimonials: [
    {
      id: 1,
      text: "Los cortes de carne fría empacados al vacío son extraordinarios. El Ribeye de Sonora tiene un marmoleado perfecto y la frescura es inigualable. Ideal para mis parrilladas de fin de semana.",
      author: "Sofía Galván",
      role: "Cliente Boutique Premium",
    },
    {
      id: 2,
      text: "Probé el costillar BBQ de la Zona Grill el domingo pasado y quedé fascinado. La carne se desprende del hueso y el toque ahumado con mezquite es simplemente espectacular. Volveré sin duda.",
      author: "Alejandro Maldonado",
      role: "Comensal Zona Grill",
    },
    {
      id: 3,
      text: "La atención personalizada y la calidad del producto son de primer nivel. Me armaron un paquete asador para mi evento corporativo y todos los invitados quedaron maravillados con la chistorra y el Sirloin.",
      author: "Dra. Elena Ruiz",
      role: "Cliente Corporativo",
    },
  ],
};

export async function GET(req: NextRequest) {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: "store_content" },
    });

    if (!setting) {
      return NextResponse.json(DEFAULT_STORE_CONTENT);
    }

    const data = setting.value as any;
    return NextResponse.json({
      videoSection: { ...DEFAULT_STORE_CONTENT.videoSection, ...data.videoSection },
      aboutSection: { ...DEFAULT_STORE_CONTENT.aboutSection, ...data.aboutSection },
      testimonials: data.testimonials || DEFAULT_STORE_CONTENT.testimonials,
    });
  } catch (error) {
    console.error("Error fetching store content:", error);
    return NextResponse.json({ error: "No se pudo obtener el contenido de la Store" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const updatedSetting = await prisma.systemSetting.upsert({
      where: { key: "store_content" },
      update: { value: body },
      create: { key: "store_content", value: body },
    });

    return NextResponse.json(updatedSetting.value);
  } catch (error) {
    console.error("Error updating store content:", error);
    return NextResponse.json({ error: "No se pudo actualizar el contenido de la Store" }, { status: 500 });
  }
}
