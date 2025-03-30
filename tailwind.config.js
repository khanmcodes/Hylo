/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: '#4A90E2',
        secondary: '#FF8C42',

        dark: {
          100: '#292929',
          200: '#1e1e1e',
          300: '#121212',
        },
        light: {
          100: '#ffffff',
          200: '#F8F9FA',
        },

        icon: '#a0a0a0',

      }
    },
  },
  plugins: [],
}

