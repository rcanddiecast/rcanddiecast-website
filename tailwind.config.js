/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}", "./blog/*.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#ff3d00',
          hover: '#e53700',
        },
        surface: {
          950: '#000000',
          900: '#050505',
          850: '#0a0a0a',
          800: '#111111',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'hero-vignette': 'linear-gradient(to top, #000 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)',
        'app-glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
