import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#C05E14',
          light: '#FFF3EB',
          medium: '#E8974C',
        },
        surface: {
          base: '#F7F5F2',
          card: '#FFFFFF',
          muted: '#F0EDE8',
        },
        ink: {
          DEFAULT: '#2C2C2C',
          sub: '#6B6B6B',
          dim: '#9B9B9B',
        },
        success: {
          DEFAULT: '#2D8A4E',
          light: '#E8F5E9',
        },
        danger: {
          DEFAULT: '#D32F2F',
          light: '#FFEBEE',
        },
        warning: {
          DEFAULT: '#F9A825',
          light: '#FFF8E1',
        },
        info: {
          DEFAULT: '#1565C0',
          light: '#E3F2FD',
        },
        border: {
          DEFAULT: '#E5E0DB',
          focus: '#C05E14',
        },
      },
      fontFamily: {
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.08)',
        md: '0 4px 12px rgba(0,0,0,0.1)',
        lg: '0 8px 24px rgba(0,0,0,0.12)',
      },
      keyframes: {
        rise: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        xpIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '50%': { transform: 'translateY(-30px)', opacity: '1' },
          '100%': { transform: 'translateY(-50px)', opacity: '0' },
        },
        barGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        rise: 'rise 0.4s ease forwards',
        pop: 'pop 0.3s ease forwards',
        fade: 'fade 0.3s ease forwards',
        slideUp: 'slideUp 0.3s ease forwards',
        xpIn: 'xpIn 1s ease forwards',
        barGrow: 'barGrow 0.6s ease forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
