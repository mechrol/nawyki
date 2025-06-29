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
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.25)',
          dark: 'rgba(255, 255, 255, 0.1)',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'fire': 'fire 0.5s ease-in-out infinite alternate',
        'level-up': 'levelUp 0.8s ease-out',
      },
      keyframes: {
        fire: {
          '0%': { transform: 'scale(1) rotate(-2deg)' },
          '100%': { transform: 'scale(1.1) rotate(2deg)' },
        },
        levelUp: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
