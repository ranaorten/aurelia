import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { payment: true },
  });

  if (!booking || booking.userId !== session.user.id) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  if (booking.status !== "PENDING" && booking.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: `This booking is already ${booking.status.toLowerCase()}.` },
      { status: 400 },
    );
  }

  if (booking.checkIn.getTime() <= Date.now()) {
    return NextResponse.json(
      { error: "Only bookings with a future check-in date can be cancelled." },
      { status: 400 },
    );
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  const wasPaid = booking.payment?.status === "SUCCESS";

  if (wasPaid) {
    // Refund automation is a later addition — for now this is just a
    // server-side flag for manual follow-up. Nothing in Stripe or the
    // Payment record is changed automatically here.
    console.warn(
      `Booking ${booking.id} was cancelled after a successful payment ` +
        `(paymentId=${booking.payment?.id}). Manual refund may be required.`,
    );
  }

  return NextResponse.json({
    booking: updated,
    message: wasPaid
      ? "Your booking has been cancelled. If you were charged, a refund will be processed separately."
      : "Your booking has been cancelled.",
  });
}
