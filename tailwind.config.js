/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--surface-0)",
        panel: "var(--surface-2)",
        panel2: "var(--surface-3)",
        cyan: "var(--accent-soft)",
        electric: "var(--accent)",
        slate: "var(--text-secondary)",
        threat: "var(--critical)",
      },
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px color-mix(in srgb, var(--accent) 22%, transparent)",
      },
    },
  },
  plugins: [],
};
