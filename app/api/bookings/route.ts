import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateNights, calculateTotalPrice } from "@/lib/pricing";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const roomId = body?.roomId;
  const checkInRaw = body?.checkIn;
  const checkOutRaw = body?.checkOut;
  const guests = Number(body?.guests);

  if (
    typeof roomId !== "string" ||
    typeof checkInRaw !== "string" ||
    typeof checkOutRaw !== "string" ||
    !Number.isFinite(guests) ||
    guests < 1
  ) {
    return NextResponse.json(
      { error: "roomId, checkIn, checkOut and guests are required." },
      { status: 400 },
    );
  }

  const checkIn = new Date(checkInRaw);
  const checkOut = new Date(checkOutRaw);

  if (
    Number.isNaN(checkIn.getTime()) ||
    Number.isNaN(checkOut.getTime()) ||
    checkIn >= checkOut
  ) {
    return NextResponse.json(
      { error: "Invalid check-in/check-out date range." },
      { status: 400 },
    );
  }

  try {
    const booking = await prisma.$transaction(
      async (tx) => {
        const room = await tx.room.findUnique({ where: { id: roomId } });
        if (!room) {
          throw new Error("ROOM_NOT_FOUND");
        }

        if (guests > room.capacity) {
          throw new Error("CAPACITY_EXCEEDED");
        }

        // Re-check for overlapping, non-cancelled bookings inside the
        // transaction — never trust the client's earlier availability check,
        // this is what actually prevents a race-condition double booking.
        const conflictingBooking = await tx.booking.findFirst({
          where: {
            roomId,
            status: { not: "CANCELLED" },
            checkIn: { lt: checkOut },
            checkOut: { gt: checkIn },
          },
          select: { id: true },
        });

        if (conflictingBooking) {
          throw new Error("ROOM_UNAVAILABLE");
        }

        // Total price is always calculated server-side from the room's
        // current base price — a client-supplied price is never trusted.
        const nights = calculateNights(checkIn, checkOut);
        const { total } = calculateTotalPrice(Number(room.basePrice), nights);

        return tx.booking.create({
          data: {
            userId: session.user.id,
            roomId,
            checkIn,
            checkOut,
            guests,
            totalPrice: total,
            status: "PENDING",
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ROOM_NOT_FOUND") {
        return NextResponse.json(
          { error: "Room not found." },
          { status: 404 },
        );
      }
      if (error.message === "CAPACITY_EXCEEDED") {
        return NextResponse.json(
          { error: "Guest count exceeds this room's capacity." },
          { status: 400 },
        );
      }
      if (error.message === "ROOM_UNAVAILABLE") {
        return NextResponse.json(
          { error: "This room is no longer available for these dates." },
          { status: 409 },
        );
      }
    }

    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
