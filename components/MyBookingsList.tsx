"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

type ApiBooking = {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: string;
  status: BookingStatus;
  room: { name: string; images: string[] };
  payment: { status: string } | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING: "bg-antique-gold/15 text-antique-gold",
  CONFIRMED: "bg-muted-olive/15 text-muted-olive",
  CANCELLED: "bg-gray-200 text-gray-500",
  COMPLETED: "bg-charcoal-brown/10 text-charcoal-brown",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

export default function MyBookingsList() {
  const [bookings, setBookings] = useState<ApiBooking[] | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  // Captured once at mount (not read fresh on every render) to keep this
  // component's render pure.
  const [now] = useState(() => Date.now());

  useEffect(() => {
    let isCancelled = false;

    fetch("/api/bookings/me")
      .then((response) => response.json())
      .then((data: ApiBooking[]) => {
        if (!isCancelled) setBookings(data);
      })
      .catch(() => {
        if (!isCancelled) setBookings([]);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  async function handlePayNow(bookingId: string) {
    setActionError(null);
    setPendingActionId(bookingId);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/checkout`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok || !data?.url) {
        setActionError(data?.error ?? "Couldn't start checkout.");
        setPendingActionId(null);
        return;
      }

      window.location.assign(data.url);
    } catch {
      setActionError("Couldn't start checkout. Please try again.");
      setPendingActionId(null);
    }
  }

  async function handleCancel(bookingId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );
    if (!confirmed) return;

    setActionError(null);
    setPendingActionId(bookingId);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });
      const data = await response.json();

      if (!response.ok) {
        setActionError(data?.error ?? "Couldn't cancel this booking.");
        setPendingActionId(null);
        return;
      }

      setBookings(
        (current) =>
          current?.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "CANCELLED" }
              : booking,
          ) ?? null,
      );
      window.alert(data.message);
    } catch {
      setActionError("Couldn't cancel this booking. Please try again.");
    } finally {
      setPendingActionId(null);
    }
  }

  if (bookings === null) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 w-full animate-pulse bg-soft-cream" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 border border-deep-espresso/15 px-6 py-16 text-center">
        <p className="font-sans text-sm text-muted-olive">
          You don&apos;t have any bookings yet.
        </p>
        <Link
          href="/#rooms"
          className="border border-deep-espresso px-6 py-2 font-sans text-xs font-medium uppercase tracking-[0.2em] text-deep-espresso transition-colors duration-300 ease-in-out hover:bg-deep-espresso hover:text-warm-ivory"
        >
          Browse Rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {actionError && (
        <p className="font-sans text-sm text-red-700">{actionError}</p>
      )}

      {bookings.map((booking) => {
        const canPay = booking.status === "PENDING";
        const canCancel =
          booking.status === "CONFIRMED" &&
          new Date(booking.checkIn).getTime() > now;
        const isBusy = pendingActionId === booking.id;

        return (
          <div
            key={booking.id}
            className="flex flex-col gap-4 border border-deep-espresso/15 p-4 sm:flex-row sm:items-center"
          >
            <Link
              href={`/booking/${booking.id}`}
              className="relative h-40 w-full shrink-0 overflow-hidden bg-soft-cream sm:h-24 sm:w-32"
            >
              {booking.room.images[0] && (
                <Image
                  src={booking.room.images[0]}
                  alt={`AURELIA ${booking.room.name}`}
                  fill
                  className="object-cover"
                />
              )}
            </Link>

            <div className="flex flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/booking/${booking.id}`}
                  className="font-heading text-xl uppercase tracking-wide text-deep-espresso hover:opacity-80"
                >
                  {booking.room.name}
                </Link>
                <span
                  className={`px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-[0.15em] ${STATUS_STYLES[booking.status]}`}
                >
                  {STATUS_LABELS[booking.status]}
                </span>
              </div>
              <p className="font-sans text-sm text-muted-olive">
                {dateFormatter.format(new Date(booking.checkIn))} –{" "}
                {dateFormatter.format(new Date(booking.checkOut))} ·{" "}
                {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
              </p>
              <p className="font-sans text-sm font-medium text-deep-espresso">
                €{booking.totalPrice}
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:w-40">
              {canPay && (
                <button
                  type="button"
                  onClick={() => handlePayNow(booking.id)}
                  disabled={isBusy}
                  className="border border-deep-espresso bg-deep-espresso px-4 py-2 font-sans text-xs font-medium uppercase tracking-[0.2em] text-warm-ivory transition-colors duration-300 ease-in-out hover:bg-transparent hover:text-deep-espresso disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? "Redirecting…" : "Pay Now"}
                </button>
              )}
              {canCancel && (
                <button
                  type="button"
                  onClick={() => handleCancel(booking.id)}
                  disabled={isBusy}
                  className="border border-deep-espresso/40 px-4 py-2 font-sans text-xs font-medium uppercase tracking-[0.2em] text-deep-espresso transition-colors duration-300 ease-in-out hover:border-deep-espresso disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? "Cancelling…" : "Cancel Booking"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
