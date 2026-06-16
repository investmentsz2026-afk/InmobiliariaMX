import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      // Fallback: If database was reset and session email is not found, load the first ADMIN
      user = await prisma.user.findFirst({
        where: { role: "ADMIN" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return NextResponse.json({ error: "Error de servidor al obtener el perfil" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, currentPassword, newPassword } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y correo son campos obligatorios" }, { status: 400 });
    }

    // Find active user
    let currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      // Fallback: get the first admin user
      currentUser = await prisma.user.findFirst({
        where: { role: "ADMIN" },
      });
    }

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // If email is changing, make sure it's not taken by another user
    if (email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser && existingUser.id !== currentUser.id) {
        return NextResponse.json({ error: "El correo electrónico ya está registrado por otro usuario" }, { status: 400 });
      }
    }

    // Update data object
    const updateData: any = {
      name,
      email,
    };

    // If they want to change the password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Debe ingresar su contraseña actual para establecer una nueva" }, { status: 400 });
      }

      // Verify current password
      const isPasswordValid = bcrypt.compareSync(currentPassword, currentUser.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "La contraseña actual es incorrecta" }, { status: 400 });
      }

      // Hash and set new password
      updateData.password = bcrypt.hashSync(newPassword, 10);
    }

    // Save updates
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: "Perfil actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ error: "Error de servidor al actualizar el perfil" }, { status: 500 });
  }
}
