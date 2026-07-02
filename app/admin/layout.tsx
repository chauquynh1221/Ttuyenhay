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
        <div className="min-h-screen bg-bg">
            {/* Admin Header */}
            <div className="bg-header text-header-foreground px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-muted hover:text-header-foreground text-sm transition-colors">
                        ← Về trang chủ
                    </Link>
                    <span className="text-muted">|</span>
                    <span className="font-bold text-sm">⚙️ Admin Panel</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-muted text-sm">👤 {user.name}</span>
                    <span className="px-2 py-0.5 bg-primary text-primary-fg rounded text-[10px] font-bold uppercase">Admin</span>
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
