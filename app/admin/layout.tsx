import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
        redirect('/dang-nhap?redirect=/admin')
    }

    return (
        <div className="min-h-screen bg-[#F3F1EE]">
            {/* Admin Header */}
            <div className="bg-[#1C1C1C] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
                        ← Về trang chủ
                    </Link>
                    <span className="text-white/20">|</span>
                    <span className="font-bold text-sm">⚙️ Admin Panel</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-white/60 text-sm">👤 {user.name}</span>
                    <span className="px-2 py-0.5 bg-[#C0392B] rounded text-[10px] font-bold uppercase">Admin</span>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Content */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    )
}
