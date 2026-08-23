"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
  { label: "HOTEL", href: "/#hotel-story" },
  { label: "ROOMS", href: "/#rooms" },
  { label: "EXPERIENCES", href: "/#experiences" },
  { label: "GALLERY", href: "/#gallery" },
  { label: "CONTACT", href: "/#contact" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.1 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-in-out ${
        scrolled ? "bg-warm-ivory shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        {/* Logo */}
        <Link
          href="/"
          className={`font-heading text-2xl font-medium uppercase tracking-[0.15em] transition-colors duration-300 ease-in-out ${
            scrolled ? "text-deep-espresso" : "text-warm-ivory"
          }`}
        >
          Aurelia
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-xs font-sans font-medium uppercase tracking-[0.2em] transition-colors duration-300 ease-in-out hover:opacity-70 ${
                scrolled ? "text-deep-espresso" : "text-warm-ivory"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Account */}
          {status === "authenticated" ? (
            <div className="flex items-center gap-4">
              <Link
                href="/account/bookings"
                className={`text-xs font-sans font-medium uppercase tracking-[0.2em] transition-colors duration-300 ease-in-out hover:opacity-70 ${
                  scrolled ? "text-deep-espresso" : "text-warm-ivory"
                }`}
              >
                {session.user?.name}
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className={`text-xs font-sans font-medium uppercase tracking-[0.2em] transition-colors duration-300 ease-in-out hover:opacity-70 ${
                  scrolled ? "text-deep-espresso" : "text-warm-ivory"
                }`}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={`text-xs font-sans font-medium uppercase tracking-[0.2em] transition-colors duration-300 ease-in-out hover:opacity-70 ${
                scrolled ? "text-deep-espresso" : "text-warm-ivory"
              }`}
            >
              Login
            </Link>
          )}

          <Link
            href="/#booking"
            className={`border px-5 py-2 text-xs font-sans font-medium uppercase tracking-[0.2em] transition-colors duration-300 ease-in-out ${
              scrolled
                ? "border-deep-espresso text-deep-espresso hover:bg-deep-espresso hover:text-warm-ivory"
                : "border-warm-ivory text-warm-ivory hover:bg-warm-ivory hover:text-deep-espresso"
            }`}
          >
            Book Your Stay
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((open) => !open)}
          className={`transition-colors duration-300 ease-in-out md:hidden ${
            scrolled ? "text-deep-espresso" : "text-warm-ivory"
          }`}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="flex flex-col items-center gap-6 bg-warm-ivory px-6 py-8 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-sans font-medium uppercase tracking-[0.2em] text-deep-espresso"
            >
              {link.label}
            </Link>
          ))}

          {/* Account */}
          {status === "authenticated" ? (
            <div className="flex flex-col items-center gap-3">
              <Link
                href="/account/bookings"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-sans font-medium uppercase tracking-[0.2em] text-deep-espresso"
              >
                {session.user?.name}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  signOut();
                }}
                className="text-sm font-sans font-medium uppercase tracking-[0.2em] text-deep-espresso"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-sans font-medium uppercase tracking-[0.2em] text-deep-espresso"
            >
              Login
            </Link>
          )}

          <Link
            href="/#booking"
            onClick={() => setMobileOpen(false)}
            className="border border-deep-espresso px-6 py-2 text-xs font-sans font-medium uppercase tracking-[0.2em] text-deep-espresso"
          >
            Book Your Stay
          </Link>
        </div>
      )}
    </motion.header>
  );
}
