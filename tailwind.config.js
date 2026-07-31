/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#09090B',
        surface: {
          DEFAULT: '#111217',
          elevated: '#181A20',
        },
        card: '#1E2128',
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.15)',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
        },
        brand: {
          // Primary Accent: Cyan (#22D3EE)
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          
          // Secondary Accent: Purple (#A855F7)
          secondary: '#A855F7',
          secondaryHover: '#9333EA',
          secondaryDark: '#7E22CE',
        },
        // We redefine status colors to adhere to the 3-color theme + neutrals
        emerald: {
          400: '#22D3EE', // Map success to primary accent
          500: '#06B6D4',
          50: '#22D3EE20'
        },
        red: {
          400: '#A855F7', // Map errors/warnings to secondary accent
          500: '#9333EA',
          50: '#A855F720'
        },
        amber: {
          400: '#94A3B8', // Map warnings/pendings to neutral gray
          500: '#64748B',
          50: '#94A3B820'
        },
        blue: {
          400: '#22D3EE', // Map info to primary accent
          500: '#06B6D4',
          50: '#22D3EE20'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      boxShadow: {
        'pds': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'pds-elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.05) inset',
      }
    },
  },
  plugins: [],
}
