const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        volter: ["Illumina Volter"],
        volter_bold: ["Illumina Volter Bold"],
     },
    },
  },
  plugins: [],
}
