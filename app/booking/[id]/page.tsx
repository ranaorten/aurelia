import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BookingPaymentPanel from "@/components/BookingPaymentPanel";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function BookingConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const { id } = await params;
  const { success, canceled } = await searchParams;
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/booking/${id}`)}`);
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { room: true },
  });

  if (!booking || booking.userId !== session.user.id) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-warm-ivory px-6 py-24">
      <div className="w-full max-w-md border border-deep-espresso/15 p-8 md:p-10">
        <p className="text-center font-sans text-xs uppercase tracking-[0.2em] text-antique-gold">
          Booking {booking.status === "PENDING" ? "Pending" : booking.status}
        </p>
        <h1 className="mt-3 text-center font-heading text-3xl uppercase tracking-wide text-deep-espresso sm:text-4xl">
          Thank You
        </h1>
        <p className="mt-2 text-center font-sans text-sm text-muted-olive">
          Your reservation at AURELIA has been received.
        </p>

        <dl className="mt-10 flex flex-col divide-y divide-deep-espresso/10 font-sans text-sm">
          <div className="flex justify-between py-3">
            <dt className="text-muted-olive">Reference</dt>
            <dd className="text-deep-espresso">
              {booking.id.slice(0, 8).toUpperCase()}
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-muted-olive">Room</dt>
            <dd className="text-deep-espresso">{booking.room.name}</dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-muted-olive">Check-in</dt>
            <dd className="text-deep-espresso">
              {dateFormatter.format(booking.checkIn)}
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-muted-olive">Check-out</dt>
            <dd className="text-deep-espresso">
              {dateFormatter.format(booking.checkOut)}
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-muted-olive">Guests</dt>
            <dd className="text-deep-espresso">{booking.guests}</dd>
          </div>
          <div className="flex justify-between py-3 font-medium">
            <dt className="text-deep-espresso">Total</dt>
            <dd className="text-deep-espresso">
              €{booking.totalPrice.toString()}
            </dd>
          </div>
        </dl>

        <BookingPaymentPanel
          bookingId={booking.id}
          status={booking.status}
          checkIn={booking.checkIn.toISOString()}
          showSuccessBanner={success === "true"}
          showCanceledBanner={canceled === "true"}
        />

        <Link
          href="/"
          className="mt-8 block w-full border border-deep-espresso px-8 py-3 text-center font-sans text-xs font-medium uppercase tracking-[0.25em] text-deep-espresso transition-colors duration-300 ease-in-out hover:bg-deep-espresso hover:text-warm-ivory"
        >
          Back to AURELIA
        </Link>
      </div>
    </main>
  );
}
