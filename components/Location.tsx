"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";

const DISTANCES = [
  { label: "Airport", time: "35 Min" },
  { label: "City Center", time: "15 Min" },
  { label: "Historic District", time: "12 Min" },
];

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function Location() {
  return (
    <section className="bg-soft-cream px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-heading text-4xl uppercase tracking-wide text-deep-espresso sm:text-5xl md:text-6xl">
          Find Us.
        </h2>

        <div className="mt-16 flex flex-col-reverse items-center gap-12 md:mt-20 md:flex-row md:items-stretch md:gap-16">
          {/* Distance list */}
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={listVariants}
            className="flex w-full flex-col divide-y divide-muted-olive/20 md:w-2/5 md:justify-center"
          >
            {DISTANCES.map((distance) => (
              <motion.li
                key={distance.label}
                variants={itemVariants}
                className="flex items-baseline justify-between py-6"
              >
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-deep-espresso">
                  {distance.label}
                </span>
                <span className="font-heading text-2xl text-muted-olive">
                  {distance.time}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          {/* Illustrated map placeholder — real map integration coming later */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative aspect-[4/3] w-full overflow-hidden bg-warm-ivory md:w-3/5"
          >
            <Image
              src="/images/map-placeholder.jpg"
              alt="Illustrated map showing AURELIA's location among the olive groves, old village and countryside"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
