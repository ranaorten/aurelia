import Link from "next/link";
import { Mail, Phone } from "lucide-react";

// lucide-react doesn't ship brand/social logos, so Instagram is a small inline icon.
function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-7.914 1.174A4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "HOTEL", href: "/hotel" },
  { label: "ROOMS", href: "/rooms" },
  { label: "EXPERIENCES", href: "/experiences" },
  { label: "GALLERY", href: "/gallery" },
  { label: "CONTACT", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="scroll-mt-24 bg-charcoal-brown px-6 pt-20 pb-8 md:px-10"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 text-center md:flex-row md:items-start md:justify-between md:text-left">
        {/* Logo + tagline */}
        <div className="flex flex-col items-center md:items-start">
          <span className="font-heading text-3xl uppercase tracking-[0.15em] text-warm-ivory">
            Aurelia
          </span>
          <span className="mt-2 font-sans text-xs uppercase tracking-[0.3em] text-warm-ivory/60">
            Boutique Hotel
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col items-center gap-4 md:items-start">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-sans text-xs uppercase tracking-[0.2em] text-warm-ivory/80 transition-colors hover:text-antique-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Social / contact */}
        <div className="flex flex-col items-center gap-4 md:items-start">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-warm-ivory/80 transition-colors hover:text-antique-gold"
          >
            <InstagramIcon size={16} />
            @aurelia.hotel
          </a>
          <a
            href="mailto:stay@aurelia-hotel.com"
            className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-warm-ivory/80 transition-colors hover:text-antique-gold"
          >
            <Mail size={16} />
            stay@aurelia-hotel.com
          </a>
          <a
            href="tel:+900000000000"
            className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-warm-ivory/80 transition-colors hover:text-antique-gold"
          >
            <Phone size={16} />
            +90 000 000 00 00
          </a>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-warm-ivory/10 pt-8 text-center md:flex-row md:text-left">
        <span className="font-sans text-xs uppercase tracking-[0.15em] text-warm-ivory/50">
          © {new Date().getFullYear()} AURELIA. All rights reserved.
        </span>
        <div className="flex items-center gap-6">
          {LEGAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-xs uppercase tracking-[0.15em] text-warm-ivory/50 transition-colors hover:text-antique-gold"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
