/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        aura: {
          pink: '#ff2a85',
          violet: '#9d4edd',
          cyan: '#00f5d4',
          amber: '#ffbe0b',
        },
        editorial: {
          dark: '#090812',
          cardDark: '#121024',
          cardDarkBorder: '#262147',
          subtle: '#1a1635',
          light: '#faf8ff',
          grayText: '#64748b',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Merriweather', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
