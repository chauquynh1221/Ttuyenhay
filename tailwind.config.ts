import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // KHÔNG dùng dark mode nữa
  darkMode: 'selector',
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
        // === Design System: TruyenFull Pro ===
        // Màu chủ đạo: Đỏ thẫm sang trọng (book/reading vibe)
        primary: '#C0392B',
        'primary-dark': '#96281B',
        'primary-light': '#E74C3C',
        'primary-bg': '#FEF2F2',

        // Màu nền
        'bg-page': '#F3F1EE',  // Nền tổng: trắng ngà ấm, như giấy
        'bg-card': '#FFFFFF',  // Nền card, panel
        'bg-alt': '#F8F7F5',  // Nền xen kẽ nhẹ

        // Màu header & nav (dark authoritative)
        'header-bg': '#1A1A1A',  // Gần đen, chuyên nghiệp như báo
        'nav-bg': '#2D2D2D',  // Xám than cho navigation

        // Màu text
        'text-main': '#1C1C1C',  // Text chính — deep charcoal
        'text-body': '#444444',  // Text body
        'text-muted': '#888888',  // Text phụ, metadata
        'text-light': '#AAAAAA',  // Text rất mờ

        // Màu viền & divider
        'border-base': '#E5E0D8',  // Border tổng (warm tone)
        'border-light': '#EEE9E0',  // Border mờ hơn

        // Badge colors — flat, không gradient
        'badge-hot': '#C0392B',
        'badge-full': '#27AE60',
        'badge-new': '#2980B9',

        // Legacy aliases
        'bg-light': '#F3F1EE',
        'bg-gray': '#F8F7F5',
        'bg-dark': '#1A1A1A',
        'text-default': '#444444',
        'link-blue': '#C0392B',
        'label-full': '#27AE60',
        'label-hot': '#C0392B',
        'label-new': '#2980B9',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-lexend)', 'var(--font-inter)', 'sans-serif'],
        roboto: ['"Roboto Condensed"', 'Tahoma', 'sans-serif'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '1.5' }],
        'sm': ['13px', { lineHeight: '1.5' }],
        'base': ['15px', { lineHeight: '1.6' }],
        'lg': ['17px', { lineHeight: '1.5' }],
        'xl': ['19px', { lineHeight: '1.4' }],
        '2xl': ['22px', { lineHeight: '1.3' }],
        '3xl': ['26px', { lineHeight: '1.2' }],
        '4xl': ['30px', { lineHeight: '1.1' }],
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'card': '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
        'sm': '0 1px 3px rgba(0,0,0,0.08)',
        'md': '0 2px 8px rgba(0,0,0,0.10)',
        'lg': '0 4px 20px rgba(0,0,0,0.12)',
        // Keep legacy names for compatibility
        'soft': '0 1px 4px rgba(0,0,0,0.08)',
        'soft-lg': '0 4px 16px rgba(0,0,0,0.12)',
        'glow': 'none',
        'glow-accent': 'none',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(6px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        scaleIn: { '0%': { transform: 'scale(0.97)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
export default config
