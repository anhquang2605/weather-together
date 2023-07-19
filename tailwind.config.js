module.exports = {
    content: [    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
      extend: {
        boxShadow: {
          'inner-lg': 'inset 0 0 20px 5ypx',
        }
      },
    },
    plugins: [
        
    ],
  }