// Trang trí nền: mèo minh hoạ + blob pastel, cố định phía sau nội dung (giống hình nền theme).
// Đặt -z-10 + mờ nên chỉ hiện ở phần lề, không cản đọc.

function Cat({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" fill="currentColor" className={className} aria-hidden>
      {/* tai */}
      <path d="M55 42 L44 4 L92 34 Z" />
      <path d="M145 42 L156 4 L108 34 Z" />
      {/* đầu */}
      <circle cx="100" cy="72" r="50" />
      {/* thân (ngồi) */}
      <path d="M58 110 C46 140 44 175 46 195 C47 208 60 210 100 210 C140 210 153 208 154 195 C156 175 154 140 142 110 Z" />
      {/* đuôi cuộn */}
      <path d="M150 190 C185 188 195 150 175 128 C168 120 158 126 164 135 C178 152 168 178 138 182 C126 184 132 194 150 190 Z" />
      {/* nơ trên đầu */}
      <path d="M100 32 l-15 -9 v18 z" />
      <path d="M100 32 l15 -9 v18 z" />
      <circle cx="100" cy="32" r="4.5" />
    </svg>
  )
}

export default function BackgroundDecor() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* blob pastel */}
      <div className="absolute -top-28 -left-28 w-[26rem] h-[26rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute top-1/2 -right-28 w-[26rem] h-[26rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[22rem] h-[22rem] rounded-full bg-primary/[0.06] blur-3xl" />

      {/* mèo lớn góc dưới-phải */}
      <Cat className="absolute -bottom-4 right-2 w-72 text-primary/[0.13]" />
      {/* mèo nhỏ góc trên-trái */}
      <Cat className="absolute top-28 -left-4 w-40 -rotate-12 text-accent/[0.16]" />
    </div>
  )
}
