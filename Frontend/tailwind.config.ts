import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1720",       // primary background — case-file navy-black
        paper: "#EDE8DC",     // primary foreground — aged paper
        verified: "#2F6F5E",  // confirmed / trust accent (teal-green)
        flagged: "#C2542A",   // disputed / warning accent (rust-amber)
        slate: "#5B6B75",     // secondary text / hairlines
        panel: "#161F2B",     // raised surface on ink
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        grain: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.035%22/></svg>')",
      },
    },
  },
  plugins: [],
};
export default config;
