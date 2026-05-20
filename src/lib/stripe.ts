import Stripe from "stripe";

// Stripe server-side instance
// If no secret key is provided (e.g., during local development), export a null placeholder.
const secretKey = process.env.STRIPE_SECRET_KEY;
export const stripe = secretKey ? new Stripe(secretKey, { typescript: true }) : null;
