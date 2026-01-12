/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        retro: {
          purple: '#6B5B95',
          'purple-light': '#9B8FC4',
          'purple-dark': '#4A3F6B',
          pink: '#FFB6D9',
          'pink-light': '#FFC9E3',
          yellow: '#FFD93D',
          cream: '#FFF8DC',
          orange: '#FF8C42',
        }
      },
      fontFamily: {
        'display': ['Fredoka', 'Comic Sans MS', 'cursive'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
        'retro-lg': '6px 6px 0px 0px rgba(0, 0, 0, 1)',
        'retro-sm': '2px 2px 0px 0px rgba(0, 0, 0, 1)',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
};
