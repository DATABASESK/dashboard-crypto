/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        glitter: {
          "0%": { opacity: 1, filter: "brightness(1)" },
          "50%": { opacity: 0.5, filter: "brightness(1.5)" },
          "100%": { opacity: 1, filter: "brightness(1)" },
        },
        spin: {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        glitter: "glitter 1s infinite",
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [],
};
