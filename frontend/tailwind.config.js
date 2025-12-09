/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'github-dark': {
          bg: '#0d1117',
          'bg-secondary': '#161b22',
          'bg-tertiary': '#21262d',
          border: '#30363d',
          'border-muted': '#21262d',
          text: '#c9d1d9',
          'text-secondary': '#8b949e',
          'text-link': '#58a6ff',
          'accent-emphasis': '#1f6feb',
          'accent-muted': 'rgba(56,139,253,0.4)',
          success: '#238636',
          danger: '#da3633',
          warning: '#9e6a03',
        }
      }
    },
  },
  plugins: [],
}

