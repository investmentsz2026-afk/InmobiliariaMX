import Stripe from "stripe";

// Stripe server-side instance
// Se usa la Secret Key para crear Payment Intents desde el backend
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  typescript: true,
});
