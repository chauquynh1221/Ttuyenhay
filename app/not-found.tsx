import Link from 'next/link'
import Mascot from '@/components/Mascot'

export default function NotFound() {
  return (
    <div className="container py-20 flex flex-col items-center text-center">
      <Mascot pose="confused" className="w-36 h-36" />
      <p className="mt-5 text-5xl font-extrabold text-primary tracking-tight">404</p>
      <h1 className="mt-2 text-2xl font-bold text-foreground">Meo~ Lạc đường mất rồi!</h1>
      <p className="mt-2 text-muted max-w-sm">
        Trang bạn tìm đã đi lạc như một chú mèo con. Quay về nhà với Bongmeow nhé.
      </p>
      <div className="flex items-center gap-2 mt-6">
        <Link href="/" className="btn btn-primary">🏠 Về trang chủ</Link>
        <Link href="/tim-kiem" className="btn btn-default">🔍 Tìm truyện</Link>
      </div>
    </div>
  )
}
