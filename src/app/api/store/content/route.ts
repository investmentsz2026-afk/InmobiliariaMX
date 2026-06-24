import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_STORE_CONTENT = {
  heroSlides: [
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
  ],
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
  catalogSection: {
    tag: "SELECCIÓN BOUTIQUE",
    title: "Nuestro Menú & Productos",
    description: "Cortes premium de Sonora empacados al vacío y especialidades preparadas al carbón. Pide directo por WhatsApp y coordina la entrega.",
  },
  gallerySection: {
    title: "GALERÍA VISUAL",
    images: [
      { id: "1", url: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&auto=format&fit=crop&q=80", label: "Ribeye Sonorense" },
      { id: "2", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80", label: "Costillar en Asador" },
      { id: "3", url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80", label: "Brasas de Mezquite" },
      { id: "4", url: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80", label: "T-Bone al Fuego" },
    ]
  },
  promoBanner: {
    visible: true,
    tag: "¡Gran Apertura MEAT STORE!",
    description: "Obtén 10% de descuento en tu primer pedido de cortes premium.",
    code: "MEATSTORE10",
    buttonText: "Aplicar en WhatsApp",
    whatsappUrl: "https://wa.me/523222018003?text=Hola!%20Quiero%20ordenar%20con%20el%20código%20de%20descuento%20MEATSTORE10",
  },
  favoritesSection: {
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
  },
  monsterProduct: {
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
  }
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
      heroSlides: data.heroSlides || DEFAULT_STORE_CONTENT.heroSlides,
      videoSection: { ...DEFAULT_STORE_CONTENT.videoSection, ...data.videoSection },
      aboutSection: { ...DEFAULT_STORE_CONTENT.aboutSection, ...data.aboutSection },
      testimonials: data.testimonials || DEFAULT_STORE_CONTENT.testimonials,
      catalogSection: { ...DEFAULT_STORE_CONTENT.catalogSection, ...data.catalogSection },
      gallerySection: { ...DEFAULT_STORE_CONTENT.gallerySection, ...data.gallerySection },
      promoBanner: { ...DEFAULT_STORE_CONTENT.promoBanner, ...data.promoBanner },
      favoritesSection: { ...DEFAULT_STORE_CONTENT.favoritesSection, ...data.favoritesSection },
      monsterProduct: { ...DEFAULT_STORE_CONTENT.monsterProduct, ...data.monsterProduct },
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
