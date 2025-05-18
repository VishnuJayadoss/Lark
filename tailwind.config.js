/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-headingclr":"#5b5555",
        "theme-primary":"#000",//black
        "theme-secondary":"#fff",//white
      },
      fontFamily: {
        primaryfont: ["georgia", "serif"],
        headingfont: ["Helvetica", "serif"],
        themefont: ["AvenirHeavy", "serif"],
      },
    },
  },
  plugins: [],
});
