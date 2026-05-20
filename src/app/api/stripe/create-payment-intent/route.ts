import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// POST /api/stripe/create-payment-intent
// Crea un PaymentIntent en Stripe y devuelve el client_secret al frontend
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, description, customerEmail } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
    }

    // Stripe trabaja en centavos, así que multiplicamos por 100
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "mxn",
      description: description || "Compra en Carnicero & Grill",
      receipt_email: customerEmail || undefined,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Stripe PaymentIntent Error:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear la intención de pago" },
      { status: 500 }
    );
  }
}
