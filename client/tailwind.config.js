/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--bg-main)',
          surface: 'var(--bg-surface)',
          card: 'var(--bg-card)',
          border: 'var(--border-color)',
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          accent: 'var(--color-accent)',
          text: 'var(--text-main)',
          muted: 'var(--text-muted)'
        }
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px var(--glow-primary)',
        'glow-card': '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px 0 var(--glow-primary)',
        'steam-lift': '0 20px 30px -10px rgba(0,0,0,0.6), 0 0 20px -2px var(--glow-primary)'
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'floatSlow 4s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
