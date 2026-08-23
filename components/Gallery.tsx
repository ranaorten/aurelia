"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";

const GALLERY_IMAGES = [
  { src: "/gallery/galeri1.jpeg", span: "md:col-span-4 md:row-span-2" },
  { src: "/gallery/galeri2.jpeg", span: "md:col-span-2 md:row-span-1" },
  { src: "/gallery/galeri3.jpeg", span: "md:col-span-2 md:row-span-1" },
  { src: "/gallery/galeri4.jpeg", span: "md:col-span-2 md:row-span-2" },
  { src: "/gallery/galeri5.jpeg", span: "md:col-span-3 md:row-span-1" },
  { src: "/gallery/galeri6.jpeg", span: "md:col-span-3 md:row-span-1" },
  { src: "/gallery/galeri7.jpeg", span: "md:col-span-3 md:row-span-2" },
  { src: "/gallery/galeri8.jpeg", span: "md:col-span-3 md:row-span-1" },
] as const;

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.08, clipPath: "inset(8% 8% 8% 8%)" },
  visible: {
    opacity: 1,
    scale: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

export default function Gallery() {
  return (
    <section
      id="gallery"
      className="scroll-mt-24 bg-warm-ivory py-28 md:py-36"
    >
      <h2 className="px-6 text-center font-heading text-4xl uppercase tracking-wide text-deep-espresso sm:text-5xl md:px-10 md:text-6xl">
        Gallery.
      </h2>

      {/* Desktop / tablet: asymmetric editorial grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={gridVariants}
        className="mx-auto mt-16 hidden max-w-7xl grid-cols-6 gap-4 px-6 md:mt-20 md:grid md:auto-rows-[180px] md:grid-flow-dense md:px-10 lg:auto-rows-[220px]"
      >
        {GALLERY_IMAGES.map((image, index) => (
          <motion.div
            key={image.src}
            variants={imageVariants}
            className={`relative col-span-3 row-span-1 overflow-hidden bg-soft-cream ${image.span}`}
          >
            <Image
              src={image.src}
              alt={`AURELIA hotel gallery photo ${index + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile: horizontal swipeable scroll */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={gridVariants}
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:hidden"
      >
        {GALLERY_IMAGES.map((image, index) => (
          <motion.div
            key={image.src}
            variants={imageVariants}
            className="relative aspect-[4/5] w-[75vw] shrink-0 snap-center overflow-hidden bg-soft-cream"
          >
            <Image
              src={image.src}
              alt={`AURELIA hotel gallery photo ${index + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
