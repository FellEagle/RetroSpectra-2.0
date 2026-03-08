/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B132B",
        gold: "#C9A227",
        accent: "#3A86FF",
        soft: "#F5F5F5"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(circle at top, rgba(58,134,255,0.35), transparent 60%), radial-gradient(circle at bottom, rgba(201,162,39,0.25), transparent 55%)"
      },
      boxShadow: {
        glass: "0 24px 60px rgba(0,0,0,0.55)"
      }
    }
  },
  plugins: []
};

