import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        turquesa: "#12B5B0", oceano: "#0E5A8A", coral: "#FF8A6B", lima: "#C5E063",
        arena: "#FFF4DF", tinta: "#0F2A3A",
      },
      fontFamily: { display: ["var(--font-fraunces)", "serif"], sans: ["var(--font-dm)", "sans-serif"] },
      borderRadius: { card: "20px" },
    },
  },
  plugins: [],
} satisfies Config;
