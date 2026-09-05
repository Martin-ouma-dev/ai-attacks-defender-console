/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#071426",
        panel: "#0d1d31",
        panel2: "#14283f",
        cyan: "#8ed5ff",
        electric: "#38bdf8",
        slate: "#bdc8d1",
        threat: "#ffb4ab",
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
