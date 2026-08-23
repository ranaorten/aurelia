"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HotelStory() {
  return (
    <section
      id="hotel-story"
      className="scroll-mt-24 overflow-hidden bg-soft-cream px-6 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-16 md:relative md:block md:h-[640px] md:gap-0">
        {/* Large image */}
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="relative aspect-[4/5] w-full overflow-hidden md:absolute md:inset-y-0 md:left-0 md:aspect-auto md:w-[58%]"
        >
          <Image
            src="/images/story-large.jpg"
            alt="AURELIA hotel exterior architecture, a stone farmhouse among olive trees"
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Text block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
          className="flex flex-col md:absolute md:top-1/2 md:right-0 md:w-[36%] md:-translate-y-1/2"
        >
          <h2 className="font-heading text-3xl uppercase tracking-wide text-deep-espresso sm:text-4xl md:text-5xl">
            A Place Shaped
            <br />
            By Nature.
          </h2>
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-muted-olive">
            Every detail of AURELIA, from its materials to its silence, was
            considered in conversation with the landscape that surrounds it.
          </p>
        </motion.div>

        {/* Small image, overlapping */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
          className="relative ml-auto aspect-square w-2/3 overflow-hidden shadow-xl md:absolute md:bottom-[-56px] md:left-[36%] md:ml-0 md:w-[22%]"
        >
          <Image
            src="/images/story-small.jpg"
            alt="AURELIA lounge interior with a fireplace and countryside view through an arched doorway"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
