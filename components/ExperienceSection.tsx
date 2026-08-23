"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type ExperienceSectionProps = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
};

export default function ExperienceSection({
  title,
  description,
  image,
  imageAlt,
  imagePosition = "left",
}: ExperienceSectionProps) {
  return (
    <div
      className={`flex flex-col items-center gap-10 md:flex-row md:gap-16 ${
        imagePosition === "right" ? "md:flex-row-reverse" : ""
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.08 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative aspect-[4/3] w-full overflow-hidden md:w-1/2"
      >
        <Image src={image} alt={imageAlt} fill className="object-cover" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
        className="flex w-full flex-col text-center md:w-1/2 md:text-left"
      >
        <h3 className="font-heading text-3xl uppercase tracking-wide text-deep-espresso sm:text-4xl">
          {title}
        </h3>
        <p className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-muted-olive md:mx-0">
          {description}
        </p>
      </motion.div>
    </div>
  );
}
