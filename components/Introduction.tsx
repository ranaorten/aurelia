"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Introduction() {
  return (
    <section className="bg-warm-ivory px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="font-heading text-4xl uppercase tracking-wide text-deep-espresso sm:text-5xl md:text-6xl"
        >
          Where Time Slows Down.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-olive md:text-lg"
        >
          Nestled among olive trees and rolling countryside, AURELIA offers a
          quiet escape shaped by nature, architecture and thoughtful
          hospitality.
        </motion.p>

        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="relative mt-16 aspect-[16/10] w-full overflow-hidden bg-soft-cream"
        >
          <Image
            src="/images/olivetree.jpeg"
            alt="AURELIA sunlit courtyard among olive trees"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
