/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f6f4ef',
        ink: '#1a1a1a',
        teal: {
          DEFAULT: '#0d6e6e',
          dark: '#0a5555',
          light: '#e8f2f2',
        },
        muted: '#5c5c5c',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};