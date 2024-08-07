/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./atoms/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    require('@tailwindcss/forms'),
  ],
  darkMode: "class",
  theme: {

    extend: {
      boxShadow: {
        signUp: "0px 5px 10px rgba(4, 10, 34, 0.2)",
        one: "0px 2px 3px rgba(7, 7, 77, 0.05)",
        sticky: "inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)",
      },
      maxHeight: {
        '128': '46rem'
      },
      width: {
        '128': '46rem'
      },
      colors: {
        
        current: "currentColor",
        transparent: "transparent",
        secondary: "#090E34",
        dark: "#1D2144",
        primary: "#4A6CF7",
        yellow: "#FBB040",
        "body-color": "#959CB1",
        red: '#EB4335',
      },
      
      container: {
        center: true,
        padding: "1rem",
      },
      
      screens: {
        xs: "450px",
        // => @media (min-width: 450px) { ... }
  
        sm: "575px",
        // => @media (min-width: 576px) { ... }
  
        md: "768px",
        // => @media (min-width: 768px) { ... }
  
        lg: "992px",
        // => @media (min-width: 992px) { ... }
  
        xl: "1200px",
        // => @media (min-width: 1200px) { ... }
  
        "2xl": "1400px",
        // => @media (min-width: 1400px) { ... }
      },
    },
  },
};
