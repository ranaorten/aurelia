"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HERO_IMAGE = "/images/hero.jpg";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-charcoal-brown">
      {/* Background image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src={HERO_IMAGE}
          alt="AURELIA boutique hotel exterior"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
            className="font-heading text-5xl leading-tight font-medium uppercase tracking-wide text-warm-ivory sm:text-6xl md:text-7xl lg:text-8xl"
          >
            A Quiet Place
            <br />
            To Remember.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.9, ease: "easeOut" }}
            className="mt-10"
          >
            <Link
              href="/booking"
              className="inline-block border border-warm-ivory px-8 py-3 text-xs font-sans font-medium uppercase tracking-[0.25em] text-warm-ivory transition-colors duration-300 ease-in-out hover:bg-warm-ivory hover:text-deep-espresso"
            >
              Book Your Stay
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.3 }}
        className="absolute inset-x-0 bottom-8 z-10 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-7 w-7 text-warm-ivory/80" />
        </motion.div>
      </motion.div>
    </section>
  );
}
