import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set.");
    return NextResponse.json(
      { error: "Webhook not configured." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  // Signature verification requires the raw, unparsed request body.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object;
      const bookingId = checkoutSession.metadata?.bookingId;

      if (!bookingId) {
        console.error("checkout.session.completed missing bookingId metadata.");
        break;
      }

      const paymentIntentId =
        typeof checkoutSession.payment_intent === "string"
          ? checkoutSession.payment_intent
          : checkoutSession.payment_intent?.id;

      await prisma.$transaction([
        prisma.payment.update({
          where: { bookingId },
          data: {
            status: "SUCCESS",
            providerTransactionId: paymentIntentId,
          },
        }),
        prisma.booking.update({
          where: { id: bookingId },
          data: { status: "CONFIRMED" },
        }),
      ]);
      break;
    }

    case "checkout.session.expired":
    case "payment_intent.payment_failed": {
      const object = event.data.object as {
        metadata?: Record<string, string>;
      };
      const bookingId = object.metadata?.bookingId;

      if (bookingId) {
        await prisma.payment
          .update({
            where: { bookingId },
            data: { status: "FAILED" },
          })
          .catch((error) => {
            console.error("Failed to mark payment as FAILED:", error);
          });
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
