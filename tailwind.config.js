/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#0C6B38",
          greenLight: "#15883F",
          blue: "#1B4F8A",
          blueLight: "#2563EB",
          gold: "#E8A020",
          mint: "#EBF7F1",
          sky: "#EEF4FF",
        },
      },
      fontFamily: {
        sans: ["'Segoe UI'", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
