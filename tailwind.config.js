/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a12',
          surface: '#12121f',
          card: '#1a1a2e',
          hover: '#22223a'
        },
        accent: {
          violet: '#8b5cf6',
          orange: '#f97316',
          blue: '#3b82f6'
        },
        temp: {
          ice: '#3b82f6',
          cold: '#06b6d4',
          cool: '#22c55e',
          warm: '#f97316',
          hot: '#ef4444',
          fire: '#a855f7',
          bingo: '#eab308'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'bingo': 'bingo 0.6s ease-out'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(234, 179, 8, 0.6)' }
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'bingo': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
}
