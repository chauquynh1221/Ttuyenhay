// Logo Bongmeow — mèo bờm vàng kim (ảnh PNG nền trong suốt do người dùng chọn).
// Truyền size qua className; object-contain để không méo hình.
export default function CatLogo({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <img
      src="/bongmeow-cat.png"
      alt="Bongmeow"
      className={`object-contain ${className}`}
      style={style}
    />
  )
}
