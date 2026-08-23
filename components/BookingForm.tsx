"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { calculateNights, calculateTotalPrice } from "@/lib/pricing";

type BookingFormProps = {
  roomId: string;
  basePrice: string;
  capacity: number;
};

type AvailabilityState = "idle" | "checking" | "available" | "unavailable" | "error";

export default function BookingForm({
  roomId,
  basePrice,
  capacity,
}: BookingFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status: sessionStatus } = useSession();

  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [availability, setAvailability] = useState<AvailabilityState>("idle");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const nights =
    range?.from && range?.to ? calculateNights(range.from, range.to) : 0;

  const pricing = useMemo(
    () =>
      nights > 0 ? calculateTotalPrice(Number(basePrice), nights) : null,
    [nights, basePrice],
  );

  useEffect(() => {
    if (!range?.from || !range?.to || nights <= 0) {
      return;
    }

    let isCancelled = false;
    const checkin = range.from.toISOString();
    const checkout = range.to.toISOString();

    const timeoutId = setTimeout(() => {
      if (isCancelled) return;
      setAvailability("checking");

      fetch(
        `/api/rooms/${roomId}/availability?checkin=${encodeURIComponent(
          checkin,
        )}&checkout=${encodeURIComponent(checkout)}`,
      )
        .then((response) => response.json())
        .then((data: { available?: boolean }) => {
          if (isCancelled) return;
          setAvailability(data.available ? "available" : "unavailable");
        })
        .catch(() => {
          if (!isCancelled) setAvailability("error");
        });
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [range?.from, range?.to, nights, roomId]);

  // A valid range is required for a previous check's result to still apply —
  // this avoids storing a redundant "idle" reset inside the effect above.
  const effectiveAvailability = nights > 0 ? availability : "idle";
  const canBook = effectiveAvailability === "available" && !isBooking;

  async function handleBookNow() {
    if (!canBook || !range?.from || !range?.to) return;

    setBookingError(null);

    if (sessionStatus !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsBooking(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          checkIn: range.from.toISOString(),
          checkOut: range.to.toISOString(),
          guests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setBookingError(data?.error ?? "Something went wrong.");
        setIsBooking(false);
        return;
      }

      router.push(`/booking/${data.id}`);
    } catch {
      setBookingError("Something went wrong. Please try again.");
      setIsBooking(false);
    }
  }

  return (
    <div className="border border-deep-espresso/15 bg-warm-ivory p-6 md:p-8">
      <h3 className="font-heading text-2xl uppercase tracking-wide text-deep-espresso">
        Check Availability
      </h3>

      <div className="mt-6 flex justify-center [--rdp-accent-color:#A58A55] [--rdp-accent-background-color:#EAE1D2] [--rdp-today-color:#A58A55]">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          disabled={{ before: new Date() }}
          numberOfMonths={1}
        />
      </div>

      <div className="mt-6 flex flex-col text-left">
        <label
          htmlFor="guests"
          className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-deep-espresso/70"
        >
          Guests
        </label>
        <select
          id="guests"
          value={guests}
          onChange={(event) => setGuests(Number(event.target.value))}
          className="border border-deep-espresso/30 bg-transparent px-4 py-3 font-sans text-sm text-deep-espresso focus:border-antique-gold focus:outline-none"
        >
          {Array.from({ length: capacity }, (_, index) => index + 1).map(
            (count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "Guest" : "Guests"}
              </option>
            ),
          )}
        </select>
      </div>

      {effectiveAvailability === "checking" && (
        <p className="mt-4 font-sans text-sm text-muted-olive">
          Checking availability…
        </p>
      )}

      {effectiveAvailability === "unavailable" && (
        <p className="mt-4 font-sans text-sm text-red-700">
          Not available for these dates.
        </p>
      )}

      {effectiveAvailability === "error" && (
        <p className="mt-4 font-sans text-sm text-red-700">
          Couldn&apos;t check availability. Please try again.
        </p>
      )}

      {pricing && effectiveAvailability === "available" && (
        <div className="mt-6 flex flex-col gap-2 border-t border-deep-espresso/15 pt-4 font-sans text-sm text-deep-espresso">
          <div className="flex justify-between">
            <span className="text-muted-olive">
              €{basePrice} × {nights} {nights === 1 ? "night" : "nights"}
            </span>
            <span>€{pricing.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-olive">Tax (10%)</span>
            <span>€{pricing.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>€{pricing.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {bookingError && (
        <p className="mt-4 font-sans text-sm text-red-700">{bookingError}</p>
      )}

      <button
        type="button"
        onClick={handleBookNow}
        disabled={!canBook}
        className="mt-6 w-full border border-deep-espresso px-8 py-3 font-sans text-xs font-medium uppercase tracking-[0.25em] text-deep-espresso transition-colors duration-300 ease-in-out hover:bg-deep-espresso hover:text-warm-ivory disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-deep-espresso"
      >
        {isBooking ? "Booking…" : "Book Now"}
      </button>
    </div>
  );
}
