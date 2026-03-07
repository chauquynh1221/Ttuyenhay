'use client'

import { useState, useEffect, useCallback } from 'react'

interface UserItem {
    _id: string
    name: string
    email: string
    role: string
    googleId?: string
    avatar?: string
    createdAt: string
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserItem[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    const fetchData = useCallback(async () => {
        setLoading(true)
        const params = new URLSearchParams({ page: String(page), limit: '20' })
        if (search) params.set('q', search)
        const r = await fetch(`/api/admin/users?${params}`)
        const d = await r.json()
        if (d.success) {
            setUsers(d.users)
            setTotal(d.pagination.total)
            setTotalPages(d.pagination.totalPages)
        }
        setLoading(false)
    }, [search, page])

    useEffect(() => { fetchData() }, [fetchData])

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!confirm(`Đổi role thành "${newRole}"?`)) return
        await fetch('/api/admin/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, role: newRole }),
        })
        fetchData()
    }

    const ROLE_COLORS: Record<string, string> = {
        admin: 'bg-red-100 text-red-700',
        vip: 'bg-yellow-100 text-yellow-700',
        user: 'bg-gray-100 text-gray-600',
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            <h1 className="text-2xl font-bold text-[#1C1C1C] mb-1">👥 Quản lý người dùng</h1>
            <p className="text-sm text-[#888] mb-6">{total} người dùng</p>

            <div className="mb-4">
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                    placeholder="Tìm theo tên hoặc email..."
                    className="w-full max-w-sm px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B]" />
            </div>

            <div className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-[#AAA] text-sm">Đang tải...</div>
                ) : (
                    <>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#E5E0D8] bg-[#F8F7F5]">
                                    <th className="text-left px-4 py-3 text-xs text-[#888] font-semibold uppercase">User</th>
                                    <th className="text-left px-4 py-3 text-xs text-[#888] font-semibold uppercase">Email</th>
                                    <th className="text-center px-4 py-3 text-xs text-[#888] font-semibold uppercase">Login</th>
                                    <th className="text-center px-4 py-3 text-xs text-[#888] font-semibold uppercase">Role</th>
                                    <th className="text-center px-4 py-3 text-xs text-[#888] font-semibold uppercase">Ngày ĐK</th>
                                    <th className="text-right px-4 py-3 text-xs text-[#888] font-semibold uppercase">Đổi role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F1EE]">
                                {users.map(u => (
                                    <tr key={u._id} className="hover:bg-[#F8F7F5]">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {u.avatar ? (
                                                    <img src={u.avatar} alt="" className="w-7 h-7 rounded-full" />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-[#C0392B] flex items-center justify-center text-white text-xs font-bold">
                                                        {u.name[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="font-medium text-[#1C1C1C]">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[#888] text-xs">{u.email}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${u.googleId ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'}`}>
                                                {u.googleId ? '🔵 Google' : '📧 Email'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role] || 'bg-gray-100'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-[#888] text-xs">
                                            {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}
                                                className="text-xs px-2 py-1 border border-[#D8D3CB] rounded focus:outline-none">
                                                <option value="user">user</option>
                                                <option value="vip">vip</option>
                                                <option value="admin">admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E0D8] bg-[#F8F7F5]">
                                <span className="text-xs text-[#888]">Trang {page} / {totalPages}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                        className="px-3 py-1 text-xs border rounded hover:bg-white disabled:opacity-50">← Trước</button>
                                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                        className="px-3 py-1 text-xs border rounded hover:bg-white disabled:opacity-50">Sau →</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
