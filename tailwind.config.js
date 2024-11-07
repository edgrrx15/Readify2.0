module.exports = {
  content: [
    "./App.js",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**.{js,jsx,ts,tsx}", 
    "./navigation/**.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'color-blanco': '#fff6d9', 
        'color-negro': '#0B1215', 
        'input' : '#fff8e3',
        'naranja': '#e8c34d',
        'nav': '#f5eeda',
        'scroll' : '#48F56D',
      },
    },
  },
  plugins: [],
};
