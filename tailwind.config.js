module.exports = {
  purge: ["./pages/**/*.tsx", "./components/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#CCC",
        secondary: "#46C9E5",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
