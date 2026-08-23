"use client";

import { motion } from "framer-motion";

export default function BookingCTA() {
  return (
    <section
      id="booking"
      className="scroll-mt-24 bg-charcoal-brown px-6 py-28 md:px-10 md:py-36"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <h2 className="font-heading text-4xl font-light uppercase tracking-wide text-warm-ivory sm:text-5xl md:text-6xl">
          Your Stay Begins Here.
        </h2>

        {/* Static booking form UI — no logic yet */}
        <form className="mt-14 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3">
          <div className="flex flex-col text-left">
            <label
              htmlFor="check-in"
              className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-warm-ivory/70"
            >
              Check-in
            </label>
            <input
              id="check-in"
              type="date"
              className="border border-warm-ivory/30 bg-transparent px-4 py-3 font-sans text-sm text-warm-ivory placeholder:text-warm-ivory/50 focus:border-antique-gold focus:outline-none"
            />
          </div>

          <div className="flex flex-col text-left">
            <label
              htmlFor="check-out"
              className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-warm-ivory/70"
            >
              Check-out
            </label>
            <input
              id="check-out"
              type="date"
              className="border border-warm-ivory/30 bg-transparent px-4 py-3 font-sans text-sm text-warm-ivory placeholder:text-warm-ivory/50 focus:border-antique-gold focus:outline-none"
            />
          </div>

          <div className="flex flex-col text-left">
            <label
              htmlFor="guests"
              className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-warm-ivory/70"
            >
              Guests
            </label>
            <select
              id="guests"
              defaultValue="2"
              className="border border-warm-ivory/30 bg-transparent px-4 py-3 font-sans text-sm text-warm-ivory focus:border-antique-gold focus:outline-none"
            >
              <option className="text-deep-espresso" value="1">
                1 Guest
              </option>
              <option className="text-deep-espresso" value="2">
                2 Guests
              </option>
              <option className="text-deep-espresso" value="3">
                3 Guests
              </option>
              <option className="text-deep-espresso" value="4">
                4 Guests
              </option>
            </select>
          </div>

          <button
            type="button"
            className="mt-4 w-full border border-warm-ivory px-8 py-3 font-sans text-xs font-medium uppercase tracking-[0.25em] text-warm-ivory transition-colors duration-300 ease-in-out hover:bg-warm-ivory hover:text-deep-espresso sm:col-span-3"
          >
            Check Availability
          </button>
        </form>
      </motion.div>
    </section>
  );
}
