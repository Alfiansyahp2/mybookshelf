/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // MyBookshelf Custom Colors
        cream: 'rgb(var(--color-cream-rgb) / <alpha-value>)',
        darkBrown: 'rgb(var(--color-dark-brown-rgb) / <alpha-value>)',
        walnut: 'rgb(var(--color-walnut-rgb) / <alpha-value>)',
        gold: 'rgb(var(--color-gold-rgb) / <alpha-value>)',
        beige: 'rgb(var(--color-beige-rgb) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
