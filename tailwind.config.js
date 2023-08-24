const { SlowBuffer } = require("buffer")

module.exports = {
    content: [    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './constants/**/*.{js,ts,jsx,tsx,mdx}'
  ],
    theme: {
      extend: {
        boxShadow: {
          'inner-lg': 'inset 0 0 15px 1px',
          'inner-md': 'inset 0 0 10px 1px',
          'inner-sm': 'inset 0 0 5px 1px',
        },
        keyframes: {
          wiggle: {
            '0%, 100%': { transform: 'rotate(-6deg)' },
            '50%': { transform: 'rotate(6deg)' },
          }
        },
        animation: {
          wiggle: 'wiggle 0.5s ease-in-out infinite',
          'spin-slow': 'spin 3s linear infinite',
        }
      },
    },
    plugins: [
        
    ],
  }