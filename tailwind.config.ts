import type { Config } from 'tailwindcss'

/**
 * Bongmeow — Design System 2026
 * Token-based, full dark-mode support via CSS variables (RGB triplets → alpha-aware).
 * Components dùng class semantic: bg-bg / bg-surface / text-foreground / border-border ...
 * Đổi theme = đổi biến CSS trong globals.css (:root vs .dark), không cần sửa component.
 */

const withAlpha = (cssVar: string) => `rgb(var(${cssVar}) / <alpha-value>)`

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // === Semantic tokens (đổi theo light/dark) ===
        bg: withAlpha('--bg'),
        surface: withAlpha('--surface'),
        'surface-2': withAlpha('--surface-2'),
        'surface-3': withAlpha('--surface-3'),
        foreground: withAlpha('--foreground'),
        muted: withAlpha('--muted'),
        'muted-2': withAlpha('--muted-2'),
        border: withAlpha('--border'),
        'border-strong': withAlpha('--border-strong'),
        header: withAlpha('--header'),
        'header-foreground': withAlpha('--header-foreground'),
        primary: {
          DEFAULT: withAlpha('--primary'),
          fg: withAlpha('--primary-foreground'),
          soft: withAlpha('--primary-soft'),
          hover: withAlpha('--primary-hover'),
        },
        accent: {
          DEFAULT: withAlpha('--accent'),
          soft: withAlpha('--accent-soft'),
        },
        success: withAlpha('--success'),
        info: withAlpha('--info'),
        warning: withAlpha('--warning'),

        // Legacy aliases (giữ để component cũ chưa refactor không vỡ)
        'bg-page': withAlpha('--bg'),
        'bg-card': withAlpha('--surface'),
        'bg-alt': withAlpha('--surface-2'),
        'text-main': withAlpha('--foreground'),
        'text-body': withAlpha('--foreground'),
        'text-muted': withAlpha('--muted'),
        'border-base': withAlpha('--border'),
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-lexend)', 'var(--font-inter)', 'sans-serif'],
        reading: ['var(--reading-font)', 'Georgia', 'serif'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '1.5' }],
        'sm': ['13px', { lineHeight: '1.5' }],
        'base': ['15px', { lineHeight: '1.6' }],
        'lg': ['17px', { lineHeight: '1.5' }],
        'xl': ['19px', { lineHeight: '1.4' }],
        '2xl': ['22px', { lineHeight: '1.3' }],
        '3xl': ['26px', { lineHeight: '1.2' }],
        '4xl': ['32px', { lineHeight: '1.1' }],
      },
      borderRadius: {
        'sm': '6px',
        DEFAULT: '8px',
        'md': '10px',
        'lg': '14px',
        'xl': '18px',
        '2xl': '22px',
      },
      boxShadow: {
        // Bóng đổ nhiều lớp (ambient + key light) — tinh tế, có chiều sâu
        'xs': '0 1px 2px rgb(0 0 0 / 0.05)',
        'card': '0 1px 2px rgb(0 0 0 / 0.04), 0 4px 12px rgb(0 0 0 / 0.05)',
        'card-hover': '0 2px 4px rgb(0 0 0 / 0.06), 0 12px 28px rgb(0 0 0 / 0.13)',
        'pop': '0 4px 10px rgb(0 0 0 / 0.10), 0 18px 46px rgb(0 0 0 / 0.20)',
        // legacy
        'soft': '0 1px 3px rgb(0 0 0 / 0.08)',
        'soft-lg': '0 8px 24px rgb(0 0 0 / 0.12)',
      },
      maxWidth: {
        'container': '1240px',
        'reading': '720px',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.22s cubic-bezier(0.16,1,0.3,1)',
        'slide-down': 'slideDown 0.22s cubic-bezier(0.16,1,0.3,1)',
        'scale-in': 'scaleIn 0.16s cubic-bezier(0.16,1,0.3,1)',
        'shimmer': 'shimmer 1.4s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(8px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { '0%': { transform: 'translateY(-8px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        scaleIn: { '0%': { transform: 'scale(0.96)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
export default config
