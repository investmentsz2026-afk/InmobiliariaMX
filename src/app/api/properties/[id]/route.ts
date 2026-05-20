import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!property) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error: any) {
    console.error("GET Property By ID Error:", error);
    return NextResponse.json({ error: "Error al obtener la propiedad" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
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

    // Check if property exists
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    // Check slug uniqueness if it is changed
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.property.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json({ error: "El slug ya existe" }, { status: 400 });
      }
    }

    // Perform database transaction for atomic image replacement and details update
    const updatedProperty = await prisma.$transaction(async (tx) => {
      if (images) {
        // Delete old image references
        await tx.propertyImage.deleteMany({ where: { propertyId: id } });

        // Add new image records
        if (images.length > 0) {
          await tx.propertyImage.createMany({
            data: images.map((img: any) => ({
              url: typeof img === "string" ? img : img.url,
              isMain: typeof img === "string" ? false : !!img.isMain,
              propertyId: id,
            })),
          });
        }
      }

      // Update property attributes
      return tx.property.update({
        where: { id },
        data: {
          title: title !== undefined ? title : undefined,
          slug: slug !== undefined ? slug : undefined,
          description: description !== undefined ? description : undefined,
          price: price !== undefined ? parseFloat(price) : undefined,
          location: location !== undefined ? location : undefined,
          city: city !== undefined ? city : undefined,
          state: state !== undefined ? state : undefined,
          m2Total: m2Total !== undefined ? parseFloat(m2Total) : undefined,
          m2Covered: m2Covered !== undefined ? (m2Covered ? parseFloat(m2Covered) : null) : undefined,
          bedrooms: bedrooms !== undefined ? (bedrooms ? parseInt(bedrooms) : null) : undefined,
          bathrooms: bathrooms !== undefined ? (bathrooms ? parseInt(bathrooms) : null) : undefined,
          parkingSpaces: parkingSpaces !== undefined ? (parkingSpaces ? parseInt(parkingSpaces) : null) : undefined,
          type: type !== undefined ? type : undefined,
          status: status !== undefined ? status : undefined,
          featured: featured !== undefined ? featured : undefined,
        },
        include: {
          images: true,
        },
      });
    });

    return NextResponse.json(updatedProperty);
  } catch (error: any) {
    console.error("PUT Property Error:", error);
    return NextResponse.json({ error: "Error al actualizar la propiedad" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    // Direct cascade delete is handled by database constraint cascade configured in Prisma schema
    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Propiedad eliminada con éxito" });
  } catch (error: any) {
    console.error("DELETE Property Error:", error);
    return NextResponse.json({ error: "Error al eliminar la propiedad" }, { status: 500 });
  }
}
