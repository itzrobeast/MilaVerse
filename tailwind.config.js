module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // Include all files in the pages directory
    './components/**/*.{js,ts,jsx,tsx}', // Include all files in the components directory
    './utils/**/*.{js,ts,jsx,tsx}', // Include the utils directory if it contains Tailwind classes
    './styles/**/*.{css}', // Include CSS files in the styles directory
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5', // Indigo for primary buttons or highlights
        secondary: '#6b7280', // Neutral gray for secondary text
        gradientStart: '#1E3A8A', // Starting color for gradients
        gradientEnd: '#9333EA', // Ending color for gradients
        background: '#E5E5E5', // Light gray for overall background
        white: '#FFFFFF',
        dark: '#111827', // Dark color for backgrounds or themes
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Add the Inter font for sans-serif styles
        body: ['Roboto', 'sans-serif'], // Use Roboto for body text
        heading: ['Poppins', 'sans-serif'], // Add Poppins for headings
      },
      spacing: {
        128: '32rem', // Large spacing for containers or sections
        144: '36rem',
        160: '40rem', // Custom spacing for large elements
        192: '48rem',
        256: '64rem', // Extremely large container spacing
      },
      borderRadius: {
        xl: '1rem', // Custom large border radius
        '2xl': '1.5rem',
        '3xl': '2rem', // Additional border radius for extra round corners
      },
      backgroundImage: {
        'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))', // Diagonal gradient
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))', // Radial gradient
        'gradient-conic': 'conic-gradient(from 180deg, var(--tw-gradient-stops))', // Conic gradient
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out', // Smooth fade-in animation
        slideIn: 'slideIn 0.5s ease-out', // Slide-in animation
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
      boxShadow: {
        '3xl': '0 10px 50px rgba(0, 0, 0, 0.25)', // Custom box shadow
        glow: '0 0 15px rgba(79, 70, 229, 0.8)', // Glowing shadow
      },
      width: {
        '1/7': '14.2857143%', // Custom fractional width
        '1/8': '12.5%',
      },
      height: {
        128: '32rem', // Custom height for larger elements
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Tailwind CSS Forms Plugin
    // require('@tailwindcss/typography'), // Tailwind CSS Typography Plugin
   // require('@tailwindcss/aspect-ratio'), // Tailwind CSS Aspect Ratio Plugin
  ],
};
