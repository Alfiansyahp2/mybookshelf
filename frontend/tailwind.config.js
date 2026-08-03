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
        
        // Cozy Night Mode Colors
        night: {
            base: '#1a100b',     /* Sangat gelap, espresso (hampir hitam tapi coklat) */
            surface: '#2a1a10',  /* Sedikit lebih terang, warna kayu gelap */
            accent: '#3d2516',   /* Aksen coklat tua */
            text: '#f2e8d9',     /* Putih cream untuk teks */
            muted: '#a38d78'     /* Abu-abu hangat */
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
