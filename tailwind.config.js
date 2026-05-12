/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Wedding palette (warm watercolor)
        cream: '#fdf6ee',
        'cream-warm': '#f9ebdd',
        'peach-soft': '#f5d9c4',
        peach: '#e8b095',
        'rose-dust': '#c97862',
        terracotta: '#a85a48',
        'brown-deep': '#6b3a2c',
        'brown-ink': '#3d1f15',
        gold: '#b8915a',
        'gold-light': '#d4b27a',
        'leaf-green': '#8a8a5b',
      },
      fontFamily: {
        display: ['Italiana', 'serif'],
        serif: ['"Cormorant Garamond"', '"Cormorant SC"', 'serif'],
        arabic: ['Amiri', 'serif'],
        script: ['Tangerine', 'cursive'],
      },
      boxShadow: {
        soft: '0 12px 32px -8px rgba(107, 58, 44, 0.12)',
        'soft-lg': '0 24px 48px -8px rgba(107, 58, 44, 0.22)',
        'soft-sm': '0 6px 16px -4px rgba(107, 58, 44, 0.06)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'petal-fall': 'petalFall 12s linear infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        petalFall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.7' },
          '90%': { opacity: '0.5' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
      },
      spacing: {
        'section-y': 'clamp(5rem, 14vw, 9rem)',
        'container-x': 'clamp(1.25rem, 5vw, 3rem)',
      },
    },
  },
  plugins: [],
};
