import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { VisitStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const visits = await prisma.visit.findMany({
      include: {
        property: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(visits);
  } catch (error: any) {
    console.error("GET Visits Error:", error);
    return NextResponse.json({ error: "Error al obtener visitas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, date, time, notes, propertyId } = body;

    if (!name || !email || !phone || !date || !time || !propertyId) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const visit = await prisma.visit.create({
      data: {
        name,
        email,
        phone,
        date: new Date(date),
        time,
        notes: notes || "",
        propertyId,
        status: VisitStatus.PENDIENTE,
      },
    });

    return NextResponse.json(visit, { status: 201 });
  } catch (error: any) {
    console.error("POST Visit Error:", error);
    return NextResponse.json({ error: "Error al programar visita" }, { status: 500 });
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

    const updatedVisit = await prisma.visit.update({
      where: { id },
      data: { status: status as VisitStatus },
    });

    return NextResponse.json(updatedVisit);
  } catch (error: any) {
    console.error("PUT Visit Error:", error);
    return NextResponse.json({ error: "Error al actualizar la visita" }, { status: 500 });
  }
}
