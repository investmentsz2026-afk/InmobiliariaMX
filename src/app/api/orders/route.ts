import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { OrderStatus } from "@prisma/client";

// GET /api/orders - Fetch all orders (Admin-only)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("GET Orders Error:", error);
    return NextResponse.json({ error: "Error al obtener las compras" }, { status: 500 });
  }
}

// POST /api/orders - Create a new order (Public checkout)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, address, paymentMethod, total, items, receiptUrl } = body;

    if (!name || !email || !phone || !address || !paymentMethod || total === undefined || !items) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Generate a unique order number like CG-XXXXX
    let orderNumber = "";
    let isUnique = false;
    while (!isUnique) {
      const randNum = Math.floor(10000 + Math.random() * 90000);
      orderNumber = `CG-${randNum}`;
      const existing = await prisma.order.findUnique({
        where: { orderNumber },
      });
      if (!existing) {
        isUnique = true;
      }
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        name,
        email,
        phone,
        address,
        paymentMethod,
        total: parseFloat(total),
        status: OrderStatus.PAGADO,
        items, // Store items directly as JSON array
        receiptUrl: receiptUrl || null,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("POST Order Error:", error);
    return NextResponse.json({ error: "Error al crear la orden" }, { status: 500 });
  }
}

// PUT /api/orders - Update order status (Admin-only)
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

    if (!Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("PUT Order Error:", error);
    return NextResponse.json({ error: "Error al actualizar la compra" }, { status: 500 });
  }
}
