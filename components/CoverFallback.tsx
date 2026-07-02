import { Paw } from './icons'

// Bìa dự phòng (khi không có/hỏng ảnh): gradient trầm cinematic theo tên truyện.
// Vì nhiều nguồn ảnh gốc đã chết, đây là "mặt tiền" chính → phải đẹp và đồng bộ dark.
function hashHue(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360
  return h
}

export default function CoverFallback({ title }: { title: string }) {
  const hue = hashHue(title || 'meow')
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center overflow-hidden"
      style={{ background: `linear-gradient(155deg, hsl(${hue} 45% 36%), hsl(${(hue + 40) % 360} 52% 16%))` }}
    >
      <Paw className="absolute -right-2 -bottom-3 w-16 h-16 text-white/10" />
      <span className="relative font-display text-white/95 font-bold text-[13px] leading-snug line-clamp-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
        {title}
      </span>
    </div>
  )
}
