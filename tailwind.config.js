/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(0, 0%, 98%)',
        accent: 'hsl(170, 80%, 50%)',
        primary: 'hsl(130, 70%, 45%)',
        surface: 'hsl(0, 0%, 100%)',
        'text-primary': 'hsl(0, 0%, 15%)',
        'text-secondary': 'hsl(0, 0%, 45%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'sm': '0 2px 6px hsla(0, 0%, 0%, 0.08)',
        'md': '0 8px 24px hsla(0, 0%, 0%, 0.12)',
        'lg': '0 16px 48px hsla(0, 0%, 0%, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}