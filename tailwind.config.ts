import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        "deep-espresso": "#3B3026",
        "muted-olive": "#77765A",
        "warm-ivory": "#F4EFE5",
        "soft-cream": "#EAE1D2",
        "charcoal-brown": "#29241F",
        "antique-gold": "#A58A55",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        sans: ["var(--font-body)"],
      },
    },
  },
};

export default config;
