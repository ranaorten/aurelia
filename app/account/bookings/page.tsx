import { redirect } from "next/navigation";
import { auth } from "@/auth";
import MyBookingsList from "@/components/MyBookingsList";

export default async function MyBookingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account/bookings");
  }

  return (
    <main className="min-h-screen bg-warm-ivory px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-4xl uppercase tracking-wide text-deep-espresso sm:text-5xl">
          My Bookings
        </h1>
        <p className="mt-3 font-sans text-sm text-muted-olive">
          Every stay you&apos;ve reserved at AURELIA, in one place.
        </p>

        <div className="mt-10">
          <MyBookingsList />
        </div>
      </div>
    </main>
  );
}
