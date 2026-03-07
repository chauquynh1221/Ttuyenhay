'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navGroups = [
    {
        title: 'TỔNG QUAN',
        items: [
            { href: '/admin', label: 'Dashboard', icon: '📊' },
        ]
    },
    {
        title: 'NỘI DUNG',
        items: [
            { href: '/admin/truyen', label: 'Quản lý truyện', icon: '📚' },
            { href: '/admin/truyen/new', label: 'Thêm truyện mới', icon: '➕' },
        ]
    },
    {
        title: 'MASTER DATA',
        items: [
            { href: '/admin/the-loai', label: 'Thể loại', icon: '🏷️' },
        ]
    },
    {
        title: 'CỘNG ĐỒNG',
        items: [
            { href: '/admin/users', label: 'Người dùng', icon: '👥' },
            { href: '/admin/comments', label: 'Bình luận', icon: '💬' },
            { href: '/admin/reports', label: 'Báo lỗi', icon: '🚨' },
        ]
    },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin'
        return pathname.startsWith(href)
    }

    return (
        <aside className="w-56 flex-shrink-0 min-h-[calc(100vh-48px)] bg-white border-r border-[#E5E0D8] overflow-y-auto">
            <nav className="py-3">
                {navGroups.map((group) => (
                    <div key={group.title} className="mb-3">
                        <p className="px-4 py-1.5 text-[10px] font-bold text-[#AAA] uppercase tracking-wider">
                            {group.title}
                        </p>
                        {group.items.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-all
                                    ${isActive(item.href)
                                        ? 'bg-[#FEF2F2] text-[#C0392B] font-semibold border-r-2 border-[#C0392B]'
                                        : 'text-[#555] hover:bg-[#F8F7F5] hover:text-[#1C1C1C]'
                                    }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
    )
}
