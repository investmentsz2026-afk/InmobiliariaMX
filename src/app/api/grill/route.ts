import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const products = await prisma.grillProduct.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching grill products:", error);
    return NextResponse.json({ error: "No se pudieron obtener los productos de Zona Grill" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, category, isActive, imageUrl } = body;

    const newProduct = await prisma.grillProduct.create({
      data: {
        name,
        description,
        price: Number(price),
        category,
        isActive: isActive !== undefined ? isActive : true,
        imageUrl,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating grill product:", error);
    return NextResponse.json({ error: "No se pudo crear el producto" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Se requiere un ID de producto" }, { status: 400 });
    }

    const body = await req.json();
    const { name, description, price, category, isActive, imageUrl } = body;

    const updatedProduct = await prisma.grillProduct.update({
      where: { id },
      data: {
        name,
        description,
        price: price !== undefined ? Number(price) : undefined,
        category,
        isActive,
        imageUrl,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating grill product:", error);
    return NextResponse.json({ error: "No se pudo actualizar el producto" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Se requiere un ID de producto" }, { status: 400 });
    }

    await prisma.grillProduct.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting grill product:", error);
    return NextResponse.json({ error: "No se pudo eliminar el producto" }, { status: 500 });
  }
}
