"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

type BookingPaymentPanelProps = {
  bookingId: string;
  status: BookingStatus;
  checkIn: string;
  showSuccessBanner: boolean;
  showCanceledBanner: boolean;
};

export default function BookingPaymentPanel({
  bookingId,
  status,
  checkIn,
  showSuccessBanner,
  showCanceledBanner,
}: BookingPaymentPanelProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Captured once at mount (not read fresh on every render) to keep this
  // component's render pure.
  const [now] = useState(() => Date.now());

  const canCancel =
    (currentStatus === "PENDING" || currentStatus === "CONFIRMED") &&
    new Date(checkIn).getTime() > now;

  async function handlePayNow() {
    setError(null);
    setIsRedirecting(true);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/checkout`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok || !data?.url) {
        setError(data?.error ?? "Couldn't start checkout. Please try again.");
        setIsRedirecting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Couldn't start checkout. Please try again.");
      setIsRedirecting(false);
    }
  }

  async function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );
    if (!confirmed) return;

    setError(null);
    setIsCancelling(true);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Couldn't cancel this booking.");
        setIsCancelling(false);
        return;
      }

      setCurrentStatus("CANCELLED");
      window.alert(data.message);
      router.refresh();
    } catch {
      setError("Couldn't cancel this booking. Please try again.");
      setIsCancelling(false);
    }
  }

  return (
    <div className="mt-8">
      {showSuccessBanner && currentStatus === "PENDING" && (
        <p className="mb-6 border border-antique-gold/40 bg-antique-gold/10 px-4 py-3 text-center font-sans text-sm text-deep-espresso">
          Payment received — confirming your booking…
        </p>
      )}

      {showCanceledBanner && (
        <p className="mb-6 border border-deep-espresso/15 bg-soft-cream px-4 py-3 text-center font-sans text-sm text-deep-espresso">
          Payment canceled. You can try again below.
        </p>
      )}

      {error && <p className="mb-4 font-sans text-sm text-red-700">{error}</p>}

      {currentStatus === "CONFIRMED" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-3 border border-antique-gold/40 bg-antique-gold/10 px-6 py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-antique-gold"
          >
            <Check className="h-6 w-6 text-warm-ivory" strokeWidth={2.5} />
          </motion.div>
          <p className="font-heading text-xl uppercase tracking-wide text-deep-espresso">
            Payment Confirmed
          </p>
          <p className="text-center font-sans text-sm text-muted-olive">
            Your stay at AURELIA is confirmed. We look forward to welcoming
            you.
          </p>
        </motion.div>
      ) : currentStatus === "PENDING" ? (
        <button
          type="button"
          onClick={handlePayNow}
          disabled={isRedirecting}
          className="w-full border border-deep-espresso bg-deep-espresso px-8 py-3 font-sans text-xs font-medium uppercase tracking-[0.25em] text-warm-ivory transition-colors duration-300 ease-in-out hover:bg-transparent hover:text-deep-espresso disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRedirecting ? "Redirecting…" : "Pay Now"}
        </button>
      ) : (
        <p className="text-center font-sans text-sm text-muted-olive">
          This booking is {currentStatus.toLowerCase()}.
        </p>
      )}

      {canCancel && (
        <button
          type="button"
          onClick={handleCancel}
          disabled={isCancelling}
          className="mt-4 w-full border border-deep-espresso/40 px-8 py-3 font-sans text-xs font-medium uppercase tracking-[0.25em] text-deep-espresso transition-colors duration-300 ease-in-out hover:border-deep-espresso disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCancelling ? "Cancelling…" : "Cancel Booking"}
        </button>
      )}
    </div>
  );
}
