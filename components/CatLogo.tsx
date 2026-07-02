// Logo Bongmeow — mèo silhouette tối giản trên huy hiệu gradient hổ phách.
// SVG thuần (thay PNG kawaii cũ) để sắc nét mọi kích thước và hợp tông cinematic.
export default function CatLogo({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 48 48" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id="bm-badge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFC46A" />
          <stop offset="100%" stopColor="#E08A2E" />
        </linearGradient>
      </defs>

      {/* Huy hiệu */}
      <rect x="1.5" y="1.5" width="45" height="45" rx="14" fill="url(#bm-badge)" />

      {/* Đầu mèo (silhouette tối) — tai là 2 tam giác hòa vào khối đầu */}
      <path d="M13.5 21 L11.5 7.5 L23 13 Z" fill="#221607" />
      <path d="M34.5 21 L36.5 7.5 L25 13 Z" fill="#221607" />
      <circle cx="24" cy="27" r="12" fill="#221607" />

      {/* Mắt cười */}
      <path d="M17 26 q2.5 3 5 0" stroke="#FFC46A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M26 26 q2.5 3 5 0" stroke="#FFC46A" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Mũi */}
      <path d="M22.7 31 h2.6 L24 32.8 Z" fill="#FFC46A" />
    </svg>
  )
}
