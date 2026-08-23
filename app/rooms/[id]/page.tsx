import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingForm from "@/components/BookingForm";

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await prisma.room.findUnique({ where: { id } });

  if (!room) {
    notFound();
  }

  const [mainImage, ...otherImages] = room.images;

  return (
    <main className="min-h-screen bg-warm-ivory px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#rooms"
          className="font-sans text-xs uppercase tracking-[0.2em] text-muted-olive transition-colors hover:text-deep-espresso"
        >
          ← All Rooms
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-16">
          {/* Gallery + details */}
          <div className="md:col-span-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-soft-cream">
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={`AURELIA ${room.name}`}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>

            {otherImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {otherImages.map((image) => (
                  <div
                    key={image}
                    className="relative aspect-square overflow-hidden bg-soft-cream"
                  >
                    <Image
                      src={image}
                      alt={`AURELIA ${room.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <h1 className="mt-10 font-heading text-4xl uppercase tracking-wide text-deep-espresso sm:text-5xl">
              {room.name}
            </h1>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-sans text-xs uppercase tracking-[0.2em] text-muted-olive">
              <span>{room.size}m²</span>
              <span>{room.capacity} Guests</span>
              <span>{room.bedType}</span>
            </div>

            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-deep-espresso/80">
              {room.description}
            </p>

            {room.amenities.length > 0 && (
              <div className="mt-10">
                <h2 className="font-heading text-xl uppercase tracking-wide text-deep-espresso">
                  Amenities
                </h2>
                <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                  {room.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="font-sans text-sm text-deep-espresso/80"
                    >
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-10 font-heading text-3xl text-deep-espresso">
              €{room.basePrice.toString()}{" "}
              <span className="font-sans text-sm text-muted-olive">
                / night
              </span>
            </p>
          </div>

          {/* Booking form */}
          <div className="md:col-span-2">
            <div className="md:sticky md:top-28">
              <BookingForm
                roomId={room.id}
                basePrice={room.basePrice.toString()}
                capacity={room.capacity}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
