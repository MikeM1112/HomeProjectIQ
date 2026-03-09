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
          light: 'var(--accent-lt)',
          medium: 'var(--accent-md)',
        },
        surface: {
          base: 'var(--bg)',
          card: 'var(--card)',
          muted: 'var(--muted)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          sub: 'var(--ink-sub)',
          dim: 'var(--ink-dim)',
        },
        success: {
          DEFAULT: 'var(--green)',
          light: 'var(--green-lt)',
        },
        danger: {
          DEFAULT: 'var(--red)',
          light: 'var(--red-lt)',
        },
        warning: {
          DEFAULT: 'var(--yellow)',
          light: 'var(--yellow-lt)',
        },
        info: {
          DEFAULT: 'var(--blue)',
          light: 'var(--blue-lt)',
        },
        border: {
          DEFAULT: 'var(--border)',
          focus: 'var(--border-focus)',
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
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
