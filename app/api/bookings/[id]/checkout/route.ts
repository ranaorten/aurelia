import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { room: true },
  });

  if (!booking || booking.userId !== session.user.id) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  if (booking.status !== "PENDING") {
    return NextResponse.json(
      { error: "This booking is not awaiting payment." },
      { status: 400 },
    );
  }

  const amountInCents = Math.round(Number(booking.totalPrice) * 100);
  const origin = new URL(request.url).origin;
  const dateRange = `${dateFormatter.format(
    booking.checkIn,
  )} – ${dateFormatter.format(booking.checkOut)}`;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: amountInCents,
          product_data: {
            name: `${booking.room.name} — ${dateRange}`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/booking/${booking.id}?success=true`,
    cancel_url: `${origin}/booking/${booking.id}?canceled=true`,
    metadata: {
      bookingId: booking.id,
    },
    // Checkout Session metadata isn't copied to the PaymentIntent by
    // default — set it explicitly so payment_intent.* webhook events
    // (e.g. payment_failed) can also be traced back to the booking.
    payment_intent_data: {
      metadata: {
        bookingId: booking.id,
      },
    },
  });

  // One Payment per booking (Payment.bookingId is unique) — upsert so a
  // retried or re-opened checkout doesn't fail on a duplicate-key error.
  await prisma.payment.upsert({
    where: { bookingId: booking.id },
    update: { amount: booking.totalPrice, status: "PENDING" },
    create: {
      bookingId: booking.id,
      amount: booking.totalPrice,
      status: "PENDING",
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
