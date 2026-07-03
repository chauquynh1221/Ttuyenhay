'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/Toast'

interface UserItem {
    _id: string
    name: string
    email: string
    role: string
    googleId?: string
    avatar?: string
    isBanned?: boolean
    createdAt: string
}

export default function AdminUsersPage() {
    const toast = useToast()
    const [users, setUsers] = useState<UserItem[]>([])
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState<string | null>(null)
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

    const call = async (method: string, body: any, okMsg: string) => {
        setBusy(body.id)
        const r = await fetch('/api/admin/users', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        const d = await r.json().catch(() => ({}))
        setBusy(null)
        if (r.ok) { toast(okMsg); fetchData() }
        else toast(d.error || 'Thao tác thất bại', 'error')
    }

    const handleRoleChange = (userId: string, newRole: string) => {
        if (!confirm(`Đổi quyền thành "${newRole}"?`)) return
        call('PUT', { id: userId, role: newRole }, 'Đã đổi quyền')
    }
    const handleBan = (u: UserItem) => {
        if (!confirm(u.isBanned ? `Mở khóa ${u.name}?` : `Khóa tài khoản ${u.name}?`)) return
        call('PATCH', { id: u._id, isBanned: !u.isBanned }, u.isBanned ? 'Đã mở khóa' : 'Đã khóa')
    }
    const handleDelete = (u: UserItem) => {
        if (!confirm(`Xóa vĩnh viễn tài khoản ${u.name}? Không thể hoàn tác.`)) return
        call('DELETE', { id: u._id }, 'Đã xóa')
    }

    const ROLE_COLORS: Record<string, string> = {
        admin: 'bg-primary-soft text-primary',
        user: 'bg-surface-2 text-muted',
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            <h1 className="text-2xl font-bold text-foreground mb-1">👥 Quản lý người dùng</h1>
            <p className="text-sm text-muted mb-6">{total} người dùng</p>

            <div className="mb-4">
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                    placeholder="Tìm theo tên hoặc email..."
                    className="form-control w-full max-w-sm" />
            </div>

            <div className="card overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center text-muted-2 text-sm">Đang tải...</div>
                ) : (
                    <>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-surface-2">
                                    <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase">User</th>
                                    <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase">Email</th>
                                    <th className="text-center px-4 py-3 text-xs text-muted font-semibold uppercase">Login</th>
                                    <th className="text-center px-4 py-3 text-xs text-muted font-semibold uppercase">Quyền</th>
                                    <th className="text-right px-4 py-3 text-xs text-muted font-semibold uppercase">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.map(u => (
                                    <tr key={u._id} className={`hover:bg-surface-2 ${u.isBanned ? 'opacity-60' : ''}`}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {u.avatar ? (
                                                    <img src={u.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-fg text-xs font-bold">
                                                        {u.name[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="font-medium text-foreground">{u.name}</span>
                                                {u.isBanned && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-500">Đã khóa</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted text-xs">{u.email}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 text-muted">
                                                {u.googleId ? '🔵 Google' : '📧 Email'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <select value={u.role} disabled={busy === u._id} onChange={e => handleRoleChange(u._id, e.target.value)}
                                                className={`rounded-full text-xs font-semibold px-2 py-1 border border-border ${ROLE_COLORS[u.role] || ''}`}>
                                                <option value="user">user</option>
                                                <option value="admin">admin</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <button disabled={busy === u._id} onClick={() => handleBan(u)} className="text-xs text-[rgb(var(--warning))] hover:underline mr-3 disabled:opacity-50">
                                                {u.isBanned ? 'Mở khóa' : 'Khóa'}
                                            </button>
                                            <button disabled={busy === u._id} onClick={() => handleDelete(u)} className="text-xs text-red-500 hover:underline disabled:opacity-50">Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-surface-2">
                                <span className="text-xs text-muted">Trang {page} / {totalPages}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                        className="btn btn-default btn-sm">← Trước</button>
                                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                        className="btn btn-default btn-sm">Sau →</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
