/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        oranges: '#fc5200',
      },
      fontFamily: {
        title: ["Poppins"],
        custom: [
          "Boathouse",
          "Segoe UI",
          "Helvetica Neue",
          "-apple-system",
          "system-ui",
          "BlinkMacSystemFont",
          "Roboto",
          "Arial",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
        ],
      },
    },
  },
  plugins: [require('daisyui')],
};
