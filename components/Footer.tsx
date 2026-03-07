import Link from 'next/link'

const genres = [
  'Tiên Hiệp', 'Kiếm Hiệp', 'Ngôn Tình', 'Đô Thị', 'Huyền Huyễn',
  'Xuyên Không', 'Trọng Sinh', 'Cung Đấu', 'Nữ Cường', 'Điền Văn',
  'Đam Mỹ', 'Bách Hợp', 'Hài Hước', 'Trinh Thám', 'Võng Du',
  'Khoa Huyễn', 'Hệ Thống', 'Linh Dị', 'Quân Sự', 'Lịch Sử',
]

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white/70 mt-8">
      <div className="container mx-auto px-3 sm:px-4 py-8">

        {/* Top: Logo + Mô tả ngắn */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-64 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-[#C0392B] rounded flex items-center justify-center">
                <svg className="text-white" viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px' }}>
                  <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">ĐỌC TRUYỆN</span>
            </div>
            <p className="text-sm leading-relaxed text-white/50">
              Nền tảng đọc truyện online miễn phí. Cập nhật liên tục, giao diện thân thiện trên mọi thiết bị.
            </p>
          </div>

          {/* Links */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-3">Liên kết</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/danh-sach/truyen-hot" className="hover:text-white transition-colors">Truyện Hot</Link></li>
                <li><Link href="/danh-sach/truyen-full" className="hover:text-white transition-colors">Truyện Full</Link></li>
                <li><Link href="/danh-sach/truyen-moi" className="hover:text-white transition-colors">Mới cập nhật</Link></li>
                <li><Link href="/gop-y" className="hover:text-white transition-colors">Góp ý - Báo lỗi</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-3">Thể loại</h4>
              <ul className="space-y-2 text-sm">
                {genres.slice(0, 8).map(genre => (
                  <li key={genre}>
                    <Link href={`/the-loai/${genre.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-white transition-colors">
                      {genre}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-3">Liên hệ</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: contact@truyenfull.com</li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Facebook</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tất cả thể loại */}
        <div className="border-t border-white/10 pt-6 mb-6">
          <h4 className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-3">Tất cả thể loại</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {genres.map(genre => (
              <Link
                key={genre}
                href={`/the-loai/${genre.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs text-white/50 hover:text-white transition-colors"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© 2024 TruyenFull Clone. Tất cả các quyền được bảo lưu.</p>
          <div className="flex items-center gap-3">
            <Link href="/dieu-khoan" className="hover:text-white/70 transition-colors">Điều khoản</Link>
            <span>·</span>
            <Link href="/chinh-sach" className="hover:text-white/70 transition-colors">Bảo mật</Link>
            <span>·</span>
            <Link href="/dmca" className="hover:text-white/70 transition-colors">DMCA</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
