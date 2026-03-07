'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stats {
    truyenCount: number
    userCount: number
    commentCount: number
    chapterCount: number
    totalViews: number
    newUsers: number
}

function StatCard({ label, value, icon, sub }: { label: string; value: string | number; icon: string; sub?: string }) {
    return (
        <div className="bg-white border border-[#E5E0D8] rounded-xl p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-[#888] font-medium uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-bold text-[#1C1C1C] mt-1">
                        {typeof value === 'number' && value >= 1000000
                            ? `${(value / 1000000).toFixed(1)}M`
                            : typeof value === 'number' && value >= 1000
                                ? `${(value / 1000).toFixed(1)}K`
                                : value}
                    </p>
                    {sub && <p className="text-xs text-[#AAA] mt-0.5">{sub}</p>}
                </div>
                <span className="text-3xl">{icon}</span>
            </div>
        </div>
    )
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [topViews, setTopViews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    setStats(d.stats)
                    setTopViews(d.topViews)
                }
            })
            .finally(() => setLoading(false))
    }, [])

    const adminLinks = [
        { href: '/admin/truyen', label: '📚 Quản lý truyện', desc: 'Thêm, sửa, xóa truyện' },
        { href: '/admin/truyen/new', label: '➕ Thêm truyện mới', desc: 'Import truyện vào hệ thống' },
        { href: '/admin/users', label: '👥 Quản lý người dùng', desc: 'Xem và phân quyền user' },
        { href: '/admin/comments', label: '💬 Kiểm duyệt bình luận', desc: 'Xóa comment vi phạm' },
    ]

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1C1C1C]">⚙️ Bảng điều khiển Admin</h1>
                <p className="text-sm text-[#888] mt-1">Quản lý toàn bộ website truyện</p>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-24 bg-[#F3F1EE] rounded-xl animate-pulse" />)}
                </div>
            ) : stats && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <StatCard label="Tổng truyện" value={stats.truyenCount} icon="📚" />
                    <StatCard label="Người dùng" value={stats.userCount} icon="👥" sub={`+${stats.newUsers} tuần này`} />
                    <StatCard label="Bình luận" value={stats.commentCount} icon="💬" />
                    <StatCard label="Tổng chương" value={stats.chapterCount} icon="📄" />
                    <StatCard label="Tổng lượt xem" value={stats.totalViews} icon="👁" />
                    <StatCard label="New users (7 ngày)" value={stats.newUsers} icon="🆕" />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick links */}
                <div className="lg:col-span-1">
                    <h2 className="text-base font-bold text-[#1C1C1C] mb-3">⚡ Thao tác nhanh</h2>
                    <div className="space-y-2">
                        {adminLinks.map(link => (
                            <Link key={link.href} href={link.href}
                                className="flex items-start gap-3 p-3 bg-white border border-[#E5E0D8] rounded-lg hover:border-[#C0392B] hover:bg-[#FEF2F2] transition-all group">
                                <div>
                                    <p className="text-sm font-semibold text-[#1C1C1C] group-hover:text-[#C0392B]">{link.label}</p>
                                    <p className="text-xs text-[#AAA]">{link.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Top viewed */}
                <div className="lg:col-span-2">
                    <h2 className="text-base font-bold text-[#1C1C1C] mb-3">🔥 Top 5 lượt xem</h2>
                    <div className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden">
                        {topViews.length === 0 ? (
                            <p className="text-center text-[#AAA] text-sm py-6">Đang tải...</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[#E5E0D8] bg-[#F8F7F5]">
                                        <th className="text-left px-4 py-2.5 text-xs text-[#888] font-semibold uppercase">Truyện</th>
                                        <th className="text-right px-4 py-2.5 text-xs text-[#888] font-semibold uppercase">Views</th>
                                        <th className="text-right px-4 py-2.5 text-xs text-[#888] font-semibold uppercase">Chương</th>
                                        <th className="text-right px-4 py-2.5 text-xs text-[#888] font-semibold uppercase">Rating</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F3F1EE]">
                                    {topViews.map((t: any) => (
                                        <tr key={t._id} className="hover:bg-[#F8F7F5] transition-colors">
                                            <td className="px-4 py-3">
                                                <Link href={`/truyen/${t.slug}`} className="font-medium text-[#C0392B] hover:underline line-clamp-1">
                                                    {t.title}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-right text-[#888]">
                                                {t.views >= 1000000 ? `${(t.views / 1000000).toFixed(1)}M` : `${(t.views / 1000).toFixed(0)}K`}
                                            </td>
                                            <td className="px-4 py-3 text-right text-[#888]">{t.totalChapters}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="text-yellow-500 font-semibold">{Number(t.rating).toFixed(1)}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
