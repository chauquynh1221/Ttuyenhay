import { Paw } from './icons'

// Bìa dự phòng (khi không có/hỏng ảnh): gradient tươi theo tên + dấu chân mèo + tên truyện.
// Vì nhiều nguồn ảnh gốc đã chết, đây là "mặt tiền" chính → thiết kế cho đẹp & nhận diện Bongmeow.
function hashHue(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360
  return h
}

export default function CoverFallback({ title }: { title: string }) {
  const hue = hashHue(title || 'meow')
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center p-2.5 text-center overflow-hidden"
      style={{ background: `linear-gradient(150deg, hsl(${hue} 62% 60%), hsl(${(hue + 35) % 360} 58% 44%))` }}
    >
      <Paw className="absolute -right-2 -bottom-3 w-16 h-16 text-white/20" />
      <Paw className="absolute -left-3 -top-3 w-9 h-9 text-white/15 rotate-12" />
      <span className="relative text-white font-bold text-[12px] leading-snug line-clamp-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
        {title}
      </span>
    </div>
  )
}
