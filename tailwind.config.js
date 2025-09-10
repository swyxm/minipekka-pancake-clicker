/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'clash': ['Supercell-Magic', 'cursive'],
        'clash-bold': ['Supercell-Magic-Bold', 'cursive'],
        'orbitron': ['Orbitron', 'monospace'],
      },
      colors: {
        'pekka-navy': '#121b41',          // deep armor navy
        'pekka-navy-light': '#31448c',    // lighter panel blue
        'pekka-navy-dark': '#0f111c',     // shadowy inner plating
        'pekka-blue': '#78c2e6',          // glowing blue highlight
        'pekka-cyan': '#4db7d8',          // softer blue glow accent
        'pekka-silver': '#aab5c5',        // muted steel/metal
        'pekka-gray': '#5a6b80',          // worn metal shadow
        'pekka-dark': '#101321',          // almost black navy
        'pekka-darker': '#0a0c14',        // true black-steel base
        'pekka-accent': '#ff4f7d',        // hot pink eye/glow accent
        'pekka-success': '#4caf70',       // green for UI feedback
        'pekka-warning': '#ff9f40',       // warm orange warning
        'pekka-error': '#e84c4c',         // sharper red
        'pekka-text': '#dce8f8',          // icy off-white text
        'pekka-text-secondary': '#8a94ad',// muted steel text
        'pekka-border': '#2a3350',        // armored edge outline
        'pekka-hover': '#1f2a45',         // hover state, deepened navy
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'glow-blue': 'glow-blue 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'mechanical': 'mechanical 0.1s ease-in-out',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'glow-blue': {
          '0%': { boxShadow: '0 0 5px #2196f3' },
          '100%': { boxShadow: '0 0 20px #2196f3, 0 0 30px #2196f3' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'mechanical': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
        },
      },
      boxShadow: {
        'pekka': '0 4px 20px rgba(26, 35, 126, 0.3)',
        'pekka-glow': '0 0 20px rgba(33, 150, 243, 0.4)',
        'pekka-inset': 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
