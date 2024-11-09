// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ceylon-pink': {
          50: '#FFF0F5',
          100: '#FFE0EB',
          200: '#FFC1D7',
          300: '#FFA2C3',
          400: '#FF83AF',
          500: '#FF649B',
          600: '#FF4587',
          700: '#FF2673',
          800: '#FF075F',
          900: '#E7004B',
        },
        'ceylon-blue': {
          50: '#E6F3FF',
          100: '#CCE7FF',
          200: '#99CFFF',
          300: '#66B7FF',
          400: '#339FFF',
          500: '#0087FF',
          600: '#006CCC',
          700: '#005199',
          800: '#003666',
          900: '#001B33',
        },
        pink: {
          100: '#ffe0f0',
          200: '#ffc0e0',
          300: '#ffa0d0',
          400: '#ff80c0',
          500: '#ff60b0',
          600: '#ff40a0',
        },
        red: {
          100: '#ffe0e0',
          200: '#ffc0c0',
          300: '#ffa0a0',
          400: '#ff8080',
          500: '#ff6060',
          600: '#ff4040',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  variants: {},
  plugins: [],
}