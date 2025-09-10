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
        // Mini Pekka Navy Blue Theme
        'pekka-navy': '#1a237e',
        'pekka-navy-light': '#3949ab',
        'pekka-navy-dark': '#0d1421',
        'pekka-blue': '#2196f3',
        'pekka-cyan': '#00bcd4',
        'pekka-silver': '#b0bec5',
        'pekka-gray': '#607d8b',
        'pekka-dark': '#263238',
        'pekka-darker': '#1a1a1a',
        'pekka-accent': '#ff4081',
        'pekka-success': '#4caf50',
        'pekka-warning': '#ff9800',
        'pekka-error': '#f44336',
        'pekka-text': '#e3f2fd',
        'pekka-text-secondary': '#90a4ae',
        'pekka-border': '#37474f',
        'pekka-hover': '#2c3e50',
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
