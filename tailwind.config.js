/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#6C5CE7',
          600: '#5A4AD1',
          700: '#4C3EB8',
          dark: '#141126',
          bg: '#EEF1F6',
          card: '#FFFFFF',
          surface: '#F6F7FA',
        },
        category: {
          frontend: {
            bg: '#E2F4FE',
            text: '#0284C7',
            icon: '#0EA5E9',
          },
          design: {
            bg: '#F0EDFE',
            text: '#7C3AED',
            icon: '#8B5CF6',
          },
          branding: {
            bg: '#FDECF4',
            text: '#DB2777',
            icon: '#EC4899',
          },
        },
        slateText: {
          primary: '#1E1B39',
          secondary: '#69687C',
          muted: '#9E9DAE',
          light: '#BCBBC7',
        }
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(20, 20, 40, 0.04)',
        'card': '0 10px 30px -4px rgba(24, 23, 42, 0.04), 0 2px 8px -2px rgba(24, 23, 42, 0.02)',
        'container': '0 20px 40px -10px rgba(30, 27, 57, 0.06)',
        'purple-glow': '0 8px 24px -4px rgba(108, 92, 231, 0.35)',
      }
    },
  },
  plugins: [],
}
