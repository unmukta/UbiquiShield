/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00BFFF",
        background: "#050505",
        panel: "#0A0F1C",
      },
    },
  },
  plugins: [],
}