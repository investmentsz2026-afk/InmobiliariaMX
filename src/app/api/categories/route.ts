import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get("target");

    if (!target || (target !== "GRILL" && target !== "STORE")) {
      return NextResponse.json(
        { error: "El parámetro 'target' debe ser 'GRILL' o 'STORE'" },
        { status: 400 }
      );
    }

    const categories = await prisma.customCategory.findMany({
      where: { target },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json(
      { error: "Error al obtener las categorías" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, target } = body;

    if (!name || !target || (target !== "GRILL" && target !== "STORE")) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios o target no es válido" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      return NextResponse.json(
        { error: "El nombre de la categoría no puede estar vacío" },
        { status: 400 }
      );
    }

    // Check uniqueness
    const existing = await prisma.customCategory.findUnique({
      where: {
        name_target: {
          name: trimmedName,
          target,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "La categoría ya existe para este destino" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.customCategory.create({
      data: {
        name: trimmedName,
        target,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("POST Category Error:", error);
    return NextResponse.json(
      { error: "Error al crear la categoría" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el ID de la categoría a eliminar" },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.customCategory.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 404 }
      );
    }

    await prisma.customCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Categoría eliminada con éxito" });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json(
      { error: "Error al eliminar la categoría" },
      { status: 500 }
    );
  }
}
