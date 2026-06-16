import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

// Helper to check if current user is ADMIN
async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return false;
  return (session.user as any).role === "ADMIN";
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET Users Error:", error);
    return NextResponse.json({ error: "Error de servidor al obtener usuarios" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "El correo electrónico ya está registrado" }, { status: 400 });
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("POST User Error:", error);
    return NextResponse.json({ error: "Error de servidor al crear usuario" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Falta el ID del usuario" }, { status: 400 });
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: "Nombre, correo y rol son obligatorios" }, { status: 400 });
    }

    // Check existing
    const currentUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Check email uniqueness
    if (email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return NextResponse.json({ error: "El correo electrónico ya está registrado por otro usuario" }, { status: 400 });
      }
    }

    const updateData: any = {
      name,
      email,
      role,
    };

    if (password) {
      updateData.password = bcrypt.hashSync(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PUT User Error:", error);
    return NextResponse.json({ error: "Error de servidor al actualizar usuario" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Falta el ID del usuario" }, { status: 400 });
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Prevent self-deletion
    if (userToDelete.email === session?.user?.email) {
      return NextResponse.json({ error: "No puedes eliminar tu propio usuario" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("DELETE User Error:", error);
    return NextResponse.json({ error: "Error de servidor al eliminar usuario" }, { status: 500 });
  }
}
