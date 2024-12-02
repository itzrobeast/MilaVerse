module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}', // Include the `utils` directory if it has Tailwind-related files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2', // Example custom color
        secondary: '#14171A',
        accent: '#FFAD1F', // Add more custom colors as needed
        background: '#E5E5E5', // Light gray for background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Add custom font
        body: ['Roboto', 'sans-serif'], // Another example custom font
      },
      spacing: {
        128: '32rem', // Example custom spacing
        144: '36rem',
      },
      borderRadius: {
        xl: '1rem', // Example custom border radius
      },
    },
  },
  plugins: [],
};
