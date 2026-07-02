// Logo Bongmeow — dùng ảnh trong public/bongmeow-logo.png (đã là badge tròn sẵn).
// Truyền size + hiệu ứng qua className; style cho animationDelay nếu cần.
export default function CatLogo({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <img
      src="/bongmeow-logo.png"
      alt="Bongmeow"
      className={`rounded-full object-cover ${className}`}
      style={style}
    />
  )
}
