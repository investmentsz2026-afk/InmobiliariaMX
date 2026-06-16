import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PropertyStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const type = searchParams.get("type") || undefined;
  const status = searchParams.get("status") as PropertyStatus || undefined;
  const featured = searchParams.get("featured") === "true" ? true : undefined;
  const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;

  try {
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    if (type) where.type = type;
    if (status) where.status = status;
    if (featured !== undefined) where.featured = featured;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(properties);
  } catch (error: any) {
    console.error("GET Properties Error:", error);
    return NextResponse.json({ error: "Error al obtener las propiedades" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      description,
      price,
      location,
      city,
      state,
      m2Total,
      m2Covered,
      bedrooms,
      bathrooms,
      parkingSpaces,
      type,
      status,
      featured,
      images,
    } = body;

    if (!title || !slug || !price || !location || !type) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Validate slug uniqueness
    const existing = await prisma.property.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "El slug ya existe, cambie el título o edite el slug directamente." }, { status: 400 });
    }

    const property = await prisma.property.create({
      data: {
        title,
        slug,
        description: description || "",
        price: parseFloat(price),
        location,
        city: city || "",
        state: state || "",
        m2Total: parseFloat(m2Total || 0),
        m2Covered: m2Covered ? parseFloat(m2Covered) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        parkingSpaces: parkingSpaces ? parseInt(parkingSpaces) : null,
        type,
        status: status || PropertyStatus.DISPONIBLE,
        featured: featured || false,
        images: {
          create: images && images.length > 0 ? images.map((img: any) => ({
            url: typeof img === "string" ? img : img.url,
            isMain: typeof img === "string" ? false : !!img.isMain,
          })) : [],
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    console.error("POST Property Error:", error);
    return NextResponse.json({ error: "Error al crear la propiedad" }, { status: 500 });
  }
}
