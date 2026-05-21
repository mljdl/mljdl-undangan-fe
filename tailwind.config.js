/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Wedding watercolor palette (untuk template renderer)
        cream: '#fff8ec',
        'cream-warm': '#f9ebdd',
        'cream-soft': '#fff2dc',
        'cream-deep': '#f9e8c3',
        'peach-soft': '#f5d9c4',
        peach: '#e8b095',
        'rose-dust': '#c97862',
        terracotta: '#a85a48',
        'brown-deep': '#6b3a2c',
        'brown-ink': '#3d1f15',
        gold: '#b8915a',
        'gold-light': '#d4b27a',
        'leaf-green': '#8a8a5b',

        // Neobrutalism soft palette (untuk CMS/admin/discovery)
        ink: '#2a2622',
        'ink-soft': '#5a524a',
        accent: '#ff8b5e',
        'accent-warm': '#ffd166',
        'accent-deep': '#c96940',
        success: '#7fb069',
        warning: '#f4a259',
        error: '#e57373',
        info: '#6db4d4',
      },
      fontFamily: {
        // Wedding aesthetic
        display: ['Italiana', 'serif'],
        serif: ['"Cormorant Garamond"', '"Cormorant SC"', 'serif'],
        arabic: ['Amiri', 'serif'],
        script: ['Tangerine', 'cursive'],
        // CMS/admin aesthetic
        brutal: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 12px 32px -8px rgba(107, 58, 44, 0.12)',
        'soft-lg': '0 24px 48px -8px rgba(107, 58, 44, 0.22)',
        'soft-sm': '0 6px 16px -4px rgba(107, 58, 44, 0.06)',
        brutal: '4px 4px 0 0 #2a2622',
        'brutal-sm': '2px 2px 0 0 #2a2622',
        'brutal-lg': '6px 6px 0 0 #2a2622',
        'brutal-xl': '8px 8px 0 0 #2a2622',
      },
      borderWidth: { '3': '3px' },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'petal-fall': 'petalFall 12s linear infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
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
        slideUp: {
          '0%': { opacity: '0', transform: 'translate(-50%, 12px)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      spacing: {
        'section-y': 'clamp(5rem, 14vw, 9rem)',
        'container-x': 'clamp(1.25rem, 5vw, 3rem)',
      },
    },
  },
  plugins: [],
}
