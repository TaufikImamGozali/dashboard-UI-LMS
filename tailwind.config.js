/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          muted: 'rgb(var(--color-surface-muted) / <alpha-value>)',
          subtle: 'rgb(var(--color-surface-subtle) / <alpha-value>)',
          elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
        },
        content: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
          inverse: 'rgb(var(--color-text-inverse) / <alpha-value>)',
        },
        outline: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          subtle: 'rgb(var(--color-border-subtle) / <alpha-value>)',
          strong: 'rgb(var(--color-border-strong) / <alpha-value>)',
        },
        overlay: 'rgb(var(--color-overlay) / <alpha-value>)',
        slate: {
          50: 'rgb(var(--color-surface-muted) / <alpha-value>)',
          100: 'rgb(var(--color-border-subtle) / <alpha-value>)',
          200: 'rgb(var(--color-border) / <alpha-value>)',
          900: 'rgb(var(--color-text-primary) / <alpha-value>)',
        },
        rose: {
          50: 'rgb(var(--color-danger-soft) / <alpha-value>)',
          100: 'rgb(var(--color-danger-muted) / <alpha-value>)',
          200: 'rgb(var(--color-danger-border) / <alpha-value>)',
          400: 'rgb(var(--color-danger-light) / <alpha-value>)',
          500: 'rgb(var(--color-danger) / <alpha-value>)',
          600: 'rgb(var(--color-danger-strong) / <alpha-value>)',
        },
        emerald: {
          50: 'rgb(var(--color-success-soft) / <alpha-value>)',
          100: 'rgb(var(--color-success-muted) / <alpha-value>)',
          200: 'rgb(var(--color-success-border) / <alpha-value>)',
          400: 'rgb(var(--color-success-light) / <alpha-value>)',
          500: 'rgb(var(--color-success) / <alpha-value>)',
          600: 'rgb(var(--color-success-strong) / <alpha-value>)',
        },
        brand: {
          50: 'rgb(var(--color-brand-50) / <alpha-value>)',
          100: 'rgb(var(--color-brand-100) / <alpha-value>)',
          200: 'rgb(var(--color-brand-200) / <alpha-value>)',
          300: 'rgb(var(--color-brand-300) / <alpha-value>)',
          400: '#A78BFA',
          500: '#6C5CE7',
          600: '#5A4AD1',
          700: '#4C3EB8',
          dark: '#141126',
          bg: 'rgb(var(--color-app-bg) / <alpha-value>)',
          card: 'rgb(var(--color-surface) / <alpha-value>)',
          surface: 'rgb(var(--color-surface-muted) / <alpha-value>)',
        },
        category: {
          frontend: {
            bg: 'rgb(var(--color-category-frontend-bg) / <alpha-value>)',
            text: 'rgb(var(--color-category-frontend-text) / <alpha-value>)',
            icon: '#0EA5E9',
          },
          design: {
            bg: 'rgb(var(--color-category-design-bg) / <alpha-value>)',
            text: 'rgb(var(--color-category-design-text) / <alpha-value>)',
            icon: '#8B5CF6',
          },
          branding: {
            bg: 'rgb(var(--color-category-branding-bg) / <alpha-value>)',
            text: 'rgb(var(--color-category-branding-text) / <alpha-value>)',
            icon: '#EC4899',
          },
        },
        slateText: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
          light: 'rgb(var(--color-text-light) / <alpha-value>)',
        }
      },
      fontSize: {
        micro: ['0.625rem', { lineHeight: '0.875rem' }],
        meta: ['0.6875rem', { lineHeight: '1rem' }],
      },
      spacing: {
        '4.5': '1.125rem',
        touch: '2.75rem',
        'chat-header': '4.75rem',
        'sidebar-compact': '5rem',
        'sidebar-wide': '15rem',
        'contact-panel': '17.5rem',
        'chat-drawer': '26.25rem',
        'course-card': '16.875rem',
        'course-card-wide': '17.8125rem',
      },
      maxWidth: {
        app: '90rem',
        auth: '67.5rem',
        'contact-panel': '17.5rem',
        'chat-drawer': '26.25rem',
      },
      minHeight: {
        app: '57.5rem',
        auth: '41.25rem',
        empty: '32.5rem',
        chat: '40rem',
        dropzone: '12.5rem',
      },
      maxHeight: {
        inbox: '50rem',
      },
      gridTemplateColumns: {
        'task-table': '2fr 1fr 1fr 1fr 1fr 2.5rem',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
        card: '1.5rem',
        shell: '1.75rem',
        'shell-lg': '2.25rem',
      },
      zIndex: {
        content: '10',
        tooltip: '20',
        sticky: '40',
        popover: '50',
        drawer: '70',
        overlay: '80',
        modal: '90',
        toast: '100',
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
