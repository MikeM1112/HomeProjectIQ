import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--accent)',
          light: 'var(--accent-soft)',
          medium: 'var(--accent-glow)',
          soft: 'var(--accent-soft)',
          glow: 'var(--accent-glow)',
          midnight: 'var(--midnight)',
          cobalt: 'var(--cobalt)',
          teal: 'var(--teal)',
          aqua: 'var(--aqua)',
          frost: 'var(--frost)',
          slate: 'var(--slate)',
        },
        surface: {
          base: 'var(--bg)',
          deep: 'var(--bg-deep)',
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
          card: 'var(--surface-2)',
          muted: 'var(--surface-3)',
        },
        ink: {
          DEFAULT: 'var(--text)',
          sub: 'var(--text-sub)',
          dim: 'var(--text-dim)',
        },
        success: {
          DEFAULT: 'var(--emerald)',
          light: 'var(--emerald-soft)',
          soft: 'var(--emerald-soft)',
          glow: 'var(--emerald-glow)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          light: 'var(--danger-soft)',
          soft: 'var(--danger-soft)',
        },
        warning: {
          DEFAULT: 'var(--gold)',
          light: 'var(--gold-soft)',
          soft: 'var(--gold-soft)',
          glow: 'var(--gold-glow)',
        },
        info: {
          DEFAULT: 'var(--info)',
          light: 'var(--info-soft)',
          soft: 'var(--info-soft)',
        },
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
          focus: 'var(--accent)',
        },
      },
      fontFamily: {
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        sm: 'var(--shadow)',
        md: 'var(--shadow-lg)',
        lg: 'var(--shadow-xl)',
        glass: 'var(--glass-shadow)',
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
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-120px) rotate(720deg)', opacity: '0' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        rise: 'rise 0.4s ease forwards',
        pop: 'pop 0.3s ease forwards',
        fade: 'fade 0.3s ease forwards',
        slideUp: 'slideUp 0.3s ease forwards',
        xpIn: 'xpIn 1s ease forwards',
        barGrow: 'barGrow 0.6s ease forwards',
        shimmer: 'shimmer 2s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        confetti: 'confetti 0.8s ease forwards',
        spin: 'spin 1.2s linear infinite',
        pulse: 'pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
