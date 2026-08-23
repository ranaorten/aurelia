"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import RoomCard from "@/components/RoomCard";

type ApiRoom = {
  id: string;
  name: string;
  size: number;
  capacity: number;
  bedType: string;
  basePrice: string;
  images: string[];
};

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Rooms() {
  const [rooms, setRooms] = useState<ApiRoom[] | null>(null);

  useEffect(() => {
    let isCancelled = false;

    fetch("/api/rooms")
      .then((response) => response.json())
      .then((data: ApiRoom[]) => {
        if (!isCancelled) {
          setRooms(data);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setRooms([]);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section
      id="rooms"
      className="scroll-mt-24 bg-warm-ivory px-6 py-28 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="font-heading text-center text-4xl uppercase tracking-wide text-deep-espresso sm:text-5xl md:text-6xl">
          Stay Your Way.
        </h2>

        {rooms === null ? (
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-20 md:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[3/4] w-full animate-pulse bg-soft-cream"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={gridVariants}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-20 md:gap-6"
          >
            {rooms.map((room) => (
              <motion.div key={room.id} variants={cardVariants}>
                <RoomCard
                  id={room.id}
                  name={room.name}
                  size={`${room.size}m²`}
                  guests={`${room.capacity} Guests · ${room.bedType}`}
                  price={`€${room.basePrice}/night`}
                  image={room.images[0]}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
