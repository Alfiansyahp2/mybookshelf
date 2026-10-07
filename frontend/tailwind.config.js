/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
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
        
        // Cosmic Night Sky Colors
        night: {
            base: '#0a0e1a',     /* Deep Celestial Midnight */
            surface: '#131b2e',  /* Cosmic Navy Surface */
            accent: '#1e293b',   /* Deep Starlight Accent */
            text: '#f1f5f9',     /* Clean Star White */
            muted: '#94a3b8'     /* Cosmic Muted Gray */
        }
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
