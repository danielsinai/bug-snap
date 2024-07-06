module.exports = {
  content: ['./src/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        solid: {
          primary: {
            main: '#313338',
            dark: '#1e1f22',
            light: '#e8eaeb'
          }
        }
      }
    }
  },
  variants: {
    extend: {},
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui']
    }
  },
  plugins: []
};
