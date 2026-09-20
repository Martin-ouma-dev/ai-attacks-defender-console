/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--surface-0)",
        panel: "var(--surface-2)",
        panel2: "var(--surface-3)",
        cyan: "var(--text-primary)",
        electric: "#aab7bd",
        slate: "var(--text-secondary)",
        threat: "#a16f69",
      },
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 28px rgba(56, 189, 248, .24)",
      },
    },
  },
  plugins: [],
};
