"use client";

import Image from "next/image";
import Link from "next/link";

type RoomCardProps = {
  id: string;
  name: string;
  size: string;
  guests: string;
  price: string;
  image: string;
};

export default function RoomCard({
  id,
  name,
  size,
  guests,
  price,
  image,
}: RoomCardProps) {
  return (
    <div className="group relative aspect-[3/4] w-full overflow-hidden bg-soft-cream">
      <Image
        src={image}
        alt={`AURELIA ${name}`}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col justify-end bg-charcoal-brown/0 p-8 opacity-0 transition-all duration-500 ease-out group-hover:bg-charcoal-brown/50 group-hover:opacity-100">
        <h3 className="font-heading text-2xl uppercase tracking-wide text-warm-ivory">
          {name}
        </h3>
        <p className="mt-2 font-sans text-xs uppercase tracking-[0.2em] text-warm-ivory/80">
          {size} &middot; {guests}
        </p>
        <Link
          href={`/rooms/${id}`}
          className="mt-4 inline-block font-sans text-xs font-medium uppercase tracking-[0.2em] text-warm-ivory transition-opacity hover:opacity-70"
        >
          View Room →
        </Link>
      </div>

      {/* Always-visible price tag */}
      <div className="absolute top-0 left-0 bg-warm-ivory px-4 py-2 font-sans text-xs uppercase tracking-[0.15em] text-deep-espresso">
        {price}
      </div>
    </div>
  );
}
