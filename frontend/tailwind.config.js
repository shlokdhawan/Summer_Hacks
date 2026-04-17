/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "curator": {
          "bg": "#0D0D0D",
          "card": "#1A1A1A",
          "teal": "#00D4B4",
          "red": "#EF4444",
          "amber": "#F59E0B",
          "green": "#10B981",
          "border": "#2A2A2A",
          "text": {
            "primary": "#FFFFFF",
            "secondary": "#9CA3AF"
          }
        },
        "on-error": "#690005",
        "outline": "#2A2A2A",
        "on-surface": "#FFFFFF",
        "on-surface-variant": "#9CA3AF",
        "primary": "#00D4B4",
        "secondary": "#F59E0B",
        "surface": "#0D0D0D",
        "background": "#0D0D0D",
        "error": "#EF4444",
        "success": "#10B981",
        "surface-container-lowest": "#0D0D0D",
        "surface-container-low": "#131313",
        "surface-container": "#1A1A1A",
        "surface-container-high": "#242424",
        "surface-container-highest": "#2A2A2A",
        "outline-variant": "#2A2A2A",
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
