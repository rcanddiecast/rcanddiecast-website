/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      animation: { 'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite', },
      colors: {
        dark: {
          900: '#050505', // Vantablack deep
          800: '#0a0a0a',
          700: '#141414',
        },
        brand: {
          orange: '#ff3300', // Electric premium orange
          hover: '#cc2900',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Syncopate', 'sans-serif'], // Ultra-premium wide font
        impact: ['Bebas Neue', 'sans-serif'], // Massive typography
      },
      cursor: {
        none: 'none',
      }
    },
  },
  plugins: [],
}
