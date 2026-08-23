import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkinParam = searchParams.get("checkin");
  const checkoutParam = searchParams.get("checkout");
  const guestsParam = searchParams.get("guests");

  const where: Prisma.RoomWhereInput = {};

  if (guestsParam) {
    const guests = Number(guestsParam);
    if (Number.isNaN(guests) || guests < 1) {
      return NextResponse.json(
        { error: "guests must be a positive number." },
        { status: 400 },
      );
    }
    where.capacity = { gte: guests };
  }

  if (checkinParam || checkoutParam) {
    if (!checkinParam || !checkoutParam) {
      return NextResponse.json(
        { error: "Both checkin and checkout must be provided together." },
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

    // Exclude rooms with any non-cancelled booking that overlaps the
    // requested date range: existing.checkIn < newCheckout AND existing.checkOut > newCheckin.
    where.bookings = {
      none: {
        status: { not: "CANCELLED" },
        checkIn: { lt: checkout },
        checkOut: { gt: checkin },
      },
    };
  }

  const rooms = await prisma.room.findMany({
    where,
    orderBy: { basePrice: "asc" },
  });

  return NextResponse.json(rooms);
}
