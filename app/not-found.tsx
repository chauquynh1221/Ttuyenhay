import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center">
                <div className="text-8xl font-black text-[#E5E0D8] mb-4">404</div>
                <div className="text-4xl mb-4">📚</div>
                <h1 className="text-2xl font-bold text-[#1C1C1C] mb-2">Không tìm thấy trang</h1>
                <p className="text-[#888] text-sm mb-6 max-w-sm mx-auto">
                    Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa. Hãy thử tìm truyện khác!
                </p>
                <div className="flex gap-3 justify-center">
                    <Link href="/" className="px-5 py-2.5 bg-[#C0392B] text-white font-semibold rounded-lg hover:bg-[#96281B] transition-colors text-sm">
                        🏠 Về trang chủ
                    </Link>
                    <Link href="/danh-sach/truyen-hot" className="px-5 py-2.5 border border-[#E5E0D8] text-[#444] font-semibold rounded-lg hover:border-[#C0392B] hover:text-[#C0392B] transition-colors text-sm">
                        🔥 Truyện hot
                    </Link>
                </div>
            </div>
        </div>
    )
}
