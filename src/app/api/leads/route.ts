import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LeadStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const leads = await prisma.lead.findMany({
      include: {
        property: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(leads);
  } catch (error: any) {
    console.error("GET Leads Error:", error);
    return NextResponse.json({ error: "Error al obtener leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, propertyId } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        message,
        propertyId: propertyId || null,
        status: LeadStatus.NUEVO,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    console.error("POST Lead Error:", error);
    return NextResponse.json({ error: "Error al crear lead de contacto" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Faltan campos (id y status son obligatorios)" }, { status: 400 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status: status as LeadStatus },
    });

    return NextResponse.json(updatedLead);
  } catch (error: any) {
    console.error("PUT Lead Error:", error);
    return NextResponse.json({ error: "Error al actualizar el lead" }, { status: 500 });
  }
}
