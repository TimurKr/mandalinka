colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/flowbite/**/*.js',
    './lib/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#ffefe7',
          200: '#ffdfcf',
          300: '#ffcfb7',
          400: '#ffbf9f',
          DEFAULT: '#ffaf87',
          600: '#cc8c6c',
          700: '#996951',
          800: '#664636',
          900: '#33231b',
        },
        secondary: {
          100: '#f2f0e6',
          200: '#e6e1cc',
          300: '#d9d3b3',
          400: '#cdc499',
          DEFAULT: '#c0b580',
          600: '#9a9166',
          700: '#736d4d',
          800: '#4d4833',
          900: '#26241a',
        },
        warning: {
          100: '#fff5cc',
          200: '#ffeb99',
          300: '#ffe066',
          400: '#ffd633',
          DEFAULT: '#ffcc00',
          600: '#cca300',
          700: '#997a00',
          800: '#665200',
          900: '#332900',
        },
        success: {
          100: '#d6ebcc',
          200: '#add699',
          300: '#85c266',
          400: '#5cad33',
          DEFAULT: '#339900',
          600: '#297a00',
          700: '#1f5c00',
          800: '#143d00',
          900: '#0a1f00',
        },
        danger: {
          100: '#f5cccc',
          200: '#eb9999',
          300: '#e06666',
          400: '#d63333',
          DEFAULT: '#cc0000',
          600: '#a30000',
          700: '#7a0000',
          800: '#520000',
          900: '#290000',
        },
      },
      keyframes: {
        'move-left-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(10px)' },
        },
      },
      animation: {
        'move-left-right': 'move-left-right 1s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [
    require('prettier-plugin-tailwindcss'),
    require('flowbite/plugin'),
    // require("@tailwindcss/forms"),
  ],
};
