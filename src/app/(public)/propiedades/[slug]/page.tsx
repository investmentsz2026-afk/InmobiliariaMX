import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PropertyImagesGallery from "@/components/public/PropertyImagesGallery";
import ProductDetailPageActions from "@/components/public/ProductDetailPageActions";
import Link from "next/link";
import { ArrowLeft, Scale, Layers, Award, Flame } from "lucide-react";
import { Metadata } from "next";
import { parseDescription } from "@/lib/utils";

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const property = await prisma.property.findUnique({
    where: { slug },
  });

  if (!property) {
    return { title: "Corte No Encontrado" };
  }

  const { text } = parseDescription(property.description);

  return {
    title: `${property.title} | Carnicero & Grill`,
    description: text.substring(0, 150),
  };
}

export default async function PropertyDetailPage(props: Props) {
  const { slug } = await props.params;

  const property = await prisma.property.findUnique({
    where: { slug },
    include: { images: true },
  });

  if (!property) {
    notFound();
  }

  const { text: cleanDescription, qualityPrices } = parseDescription(property.description);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const typeLabels = {
    CASA: "Corte de Res (Carne Fría)",
    TERRENO: "Paquete y Parrillada",
    DEPARTAMENTO: "Embutido Artesanal",
    PROYECTO: "Especialidad Grill",
  };

  const qualityLabels: Record<number, string> = {
    1: "U.S. Choice",
    2: "U.S. Prime",
    3: "Wagyu / A5",
    4: "Sonora Premium",
  };

  const getWeightText = (val: number) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)} kg`;
    }
    return `${val} g`;
  };

  const productData = {
    id: property.id,
    title: property.title,
    price: property.price,
    slug: property.slug,
    type: property.type,
    weight: property.m2Total,
    image: property.images.find((img) => img.isMain)?.url || property.images[0]?.url || "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    qualityPrices,
  };

  return (
    <section className="py-12 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/#catalogo"
          className="inline-flex items-center text-xs tracking-widest uppercase text-gray-500 hover:text-gold-500 mb-8 transition-colors duration-300 font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Title, Gallery, Specs, Description */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <span className="px-3 py-1 bg-gold-50 border border-gold-200 text-gold-600 text-[10px] tracking-widest uppercase font-bold rounded-xs">
                {typeLabels[property.type]}
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-obsidian mt-4">
                {property.title}
              </h1>
              <p className="text-sm text-carbon-text mt-2">
                Origen: {property.location || `${property.city}, ${property.state}`}
              </p>
            </div>

            {/* Gallery */}
            <PropertyImagesGallery images={property.images} title={property.title} />

            {/* Core Specs Grid */}
            <div className="flex flex-row gap-2 sm:gap-4 py-4 sm:py-6 border-t border-b border-gray-100 w-full">
              <div className="flex-grow flex-shrink basis-0 min-w-0 p-2 sm:p-4 bg-gray-50 text-center rounded-sm">
                <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 mx-auto mb-1.5 sm:mb-2 flex-shrink-0" />
                <span className="block text-xs sm:text-sm font-semibold text-obsidian truncate">{getWeightText(property.m2Total)}</span>
                <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 font-bold mt-0.5">Peso Aprox</span>
              </div>
              <div className="flex-grow flex-shrink basis-0 min-w-0 p-2 sm:p-4 bg-gray-50 text-center rounded-sm">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 mx-auto mb-1.5 sm:mb-2 flex-shrink-0" />
                <span className="block text-xs sm:text-sm font-semibold text-obsidian truncate">{property.bedrooms ? `${property.bedrooms}"` : "Var."}</span>
                <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 font-bold mt-0.5">Grosor</span>
              </div>
              <div className="flex-grow flex-shrink basis-0 min-w-0 p-2 sm:p-4 bg-gray-50 text-center rounded-sm">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 mx-auto mb-1.5 sm:mb-2 flex-shrink-0" />
                <span className="block text-xs sm:text-sm font-semibold text-obsidian truncate">{property.parkingSpaces ? `${property.parkingSpaces} pers` : "Al gusto"}</span>
                <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 font-bold mt-0.5">Sugerencia</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-serif text-xl font-semibold text-obsidian mb-4">Descripción del Corte / Preparación</h3>
              <p className="text-sm text-carbon-text leading-relaxed whitespace-pre-line font-light font-sans">
                {cleanDescription}
              </p>
            </div>
          </div>

          {/* Right Column: Pricing & Shopping/Grill Customizer Actions */}
          <div className="space-y-6 lg:sticky lg:top-28 h-fit">
            {/* Main Price display */}
            <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
              <span className="text-[10px] uppercase text-gray-400 tracking-wider block mb-1">Precio por unidad</span>
              <p className="font-serif text-3xl font-bold text-obsidian">
                {formatPrice(property.price)} <span className="text-xs font-sans font-normal text-gray-500">MXN</span>
              </p>
            </div>

            {/* Actions Form Widget */}
            <ProductDetailPageActions product={productData} />
          </div>
        </div>
      </div>
    </section>
  );
}
