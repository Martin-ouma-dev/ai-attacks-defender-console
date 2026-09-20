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
        sans: ["JetBrains Mono", "ui-monospace", "monospace"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px color-mix(in srgb, var(--accent) 22%, transparent)",
      },
    },
  },
  plugins: [],
};
