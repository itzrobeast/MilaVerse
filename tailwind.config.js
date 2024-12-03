module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}', // Include the `utils` directory if it has Tailwind-related files
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5', // Indigo for buttons
        secondary: '#6b7280', // Neutral gray for text
        gradientStart: '#1E3A8A', // Gradient starting color
        gradientEnd: '#9333EA', // Gradient ending color
        background: '#E5E5E5', // Light gray for background
        white: '#FFFFFF',
        dark: '#111827', // Dark theme for backgrounds
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Add custom font
        body: ['Roboto', 'sans-serif'], // Another example custom font
      },
      spacing: {
        128: '32rem', // Example custom spacing
        144: '36rem',
        160: '40rem', // For larger containers or sections
        192: '48rem',
      },
      borderRadius: {
        xl: '1rem', // Example custom border radius
        '2xl': '1.5rem',
      },
      backgroundImage: {
        'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
