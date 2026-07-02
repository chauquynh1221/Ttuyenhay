// Mascot Bongmeow — dùng chung ảnh mèo thương hiệu (public/bongmeow-cat.png)
// thay bộ SVG hồng cũ. Giữ prop `pose` để tương thích các chỗ gọi cũ
// (ảnh tĩnh nên mọi pose hiển thị như nhau).
type Pose = 'wave' | 'sleep' | 'confused' | 'celebrate' | 'read'

export default function Mascot({ pose = 'wave', className = '' }: { pose?: Pose; className?: string }) {
  return (
    <img
      src="/bongmeow-cat.png"
      alt=""
      aria-hidden
      draggable={false}
      className={`object-contain select-none ${className}`}
    />
  )
}
