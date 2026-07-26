/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          900: '#0a0b10', // Deep midnight blue for background
          800: '#13151f', // Slightly lighter for sidebar/navbar
          700: '#1c1f2e', // Card backgrounds
          600: '#25293c', // Hover states
        },
        accent: {
          purple: '#8b5cf6', // Violet/Purple
          indigo: '#6366f1', // Indigo
          cyan: '#06b6d4',   // Cyan glow
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.4)',
        'glow-purple': '0 0 20px -5px rgba(139, 92, 246, 0.4)',
        'glow-indigo': '0 0 20px -5px rgba(99, 102, 241, 0.4)',
      },
    },
  },
  plugins: [],
}
