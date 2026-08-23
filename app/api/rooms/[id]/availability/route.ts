import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const checkinParam = searchParams.get("checkin");
  const checkoutParam = searchParams.get("checkout");

  if (!checkinParam || !checkoutParam) {
    return NextResponse.json(
      { error: "checkin and checkout query params are required." },
      { status: 400 },
    );
  }

  const checkin = new Date(checkinParam);
  const checkout = new Date(checkoutParam);

  if (Number.isNaN(checkin.getTime()) || Number.isNaN(checkout.getTime())) {
    return NextResponse.json(
      { error: "checkin and checkout must be valid dates." },
      { status: 400 },
    );
  }

  if (checkin >= checkout) {
    return NextResponse.json(
      { error: "checkout must be after checkin." },
      { status: 400 },
    );
  }

  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) {
    return NextResponse.json({ error: "Room not found." }, { status: 404 });
  }

  // A room is unavailable if any non-cancelled booking overlaps the
  // requested range: existing.checkIn < newCheckout AND existing.checkOut > newCheckin.
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      roomId: id,
      status: { not: "CANCELLED" },
      checkIn: { lt: checkout },
      checkOut: { gt: checkin },
    },
    select: { id: true },
  });

  return NextResponse.json({ available: !conflictingBooking });
}
