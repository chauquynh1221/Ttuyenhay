'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface TruyenItem {
    _id: string
    title: string
    slug: string
    author: string
    genres: string[]
    status: string
    views: number
    totalChapters: number
    isHot: boolean
    isFull: boolean
    isNew: boolean
    coverImage?: string
    updatedAt: string
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    ongoing: { label: 'Đang ra', color: 'bg-green-50 text-green-700' },
    completed: { label: 'Hoàn thành', color: 'bg-blue-50 text-blue-700' },
    paused: { label: 'Tạm dừng', color: 'bg-yellow-50 text-yellow-700' },
}

export default function AdminTruyenPage() {
    const [data, setData] = useState<TruyenItem[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    const fetchData = useCallback(async () => {
        setLoading(true)
        const params = new URLSearchParams()
        if (search) params.set('q', search)
        if (statusFilter) params.set('status', statusFilter)
        params.set('page', String(page))
        params.set('limit', '15')

        const r = await fetch(`/api/admin/truyen?${params}`)
        const d = await r.json()
        if (d.success) {
            setData(d.data)
            setTotalPages(d.pagination.totalPages)
            setTotal(d.pagination.total)
        }
        setLoading(false)
    }, [search, statusFilter, page])

    useEffect(() => { fetchData() }, [fetchData])

    const handleToggle = async (id: string, field: string, current: boolean) => {
        await fetch('/api/admin/truyen', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, [field]: !current }),
        })
        setData(prev => prev.map(t => t._id === id ? { ...t, [field]: !current } : t))
    }

    const handleDelete = async (t: TruyenItem) => {
        if (!confirm(`Xóa truyện "${t.title}" và tất cả chương?\nHành động này không thể hoàn tác!`)) return
        const r = await fetch('/api/admin/truyen', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: t._id }),
        })
        if (r.ok) fetchData()
    }

    const formatViews = (v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v)

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">📚 Quản lý truyện</h1>
                    <p className="text-sm text-muted mt-0.5">{total} truyện trong hệ thống</p>
                </div>
                <Link href="/admin/truyen/new"
                    className="btn btn-primary btn-sm">
                    ➕ Thêm truyện mới
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-4">
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                    placeholder="Tìm kiếm truyện, tác giả, slug..."
                    className="form-control flex-1 max-w-sm" />
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
                    className="form-control w-auto">
                    <option value="">Tất cả trạng thái</option>
                    <option value="ongoing">Đang ra</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="paused">Tạm dừng</option>
                </select>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted-2 text-sm">Đang tải...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-surface-2">
                                        <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase">Truyện</th>
                                        <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase">Tác giả</th>
                                        <th className="text-center px-4 py-3 text-xs text-muted font-semibold uppercase">Trạng thái</th>
                                        <th className="text-center px-4 py-3 text-xs text-muted font-semibold uppercase">Chương</th>
                                        <th className="text-center px-4 py-3 text-xs text-muted font-semibold uppercase">Views</th>
                                        <th className="text-center px-4 py-3 text-xs text-muted font-semibold uppercase">Tags</th>
                                        <th className="text-right px-4 py-3 text-xs text-muted font-semibold uppercase">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {data.map(t => (
                                        <tr key={t._id} className="hover:bg-surface-2 transition-colors">
                                            <td className="px-4 py-3">
                                                <Link href={`/truyen/${t.slug}`} target="_blank"
                                                    className="font-medium text-foreground hover:text-primary line-clamp-1">{t.title}</Link>
                                                <p className="text-[10px] text-muted-2 font-mono mt-0.5">/{t.slug}</p>
                                            </td>
                                            <td className="px-4 py-3 text-foreground/90">{t.author}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_MAP[t.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                                                    {STATUS_MAP[t.status]?.label || t.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-muted">{t.totalChapters}</td>
                                            <td className="px-4 py-3 text-center text-muted">{formatViews(t.views)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button onClick={() => handleToggle(t._id, 'isHot', t.isHot)}
                                                        className={`text-xs px-1.5 py-0.5 rounded ${t.isHot ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'}`}
                                                        title="Toggle Hot">🔥</button>
                                                    <button onClick={() => handleToggle(t._id, 'isNew', t.isNew)}
                                                        className={`text-xs px-1.5 py-0.5 rounded ${t.isNew ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
                                                        title="Toggle New">🆕</button>
                                                    <button onClick={() => handleToggle(t._id, 'isFull', t.isFull)}
                                                        className={`text-xs px-1.5 py-0.5 rounded ${t.isFull ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}
                                                        title="Toggle Full">✅</button>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                <Link href={`/admin/truyen/${t.slug}/chapters`} className="text-xs text-purple-600 hover:underline mr-2">Chương</Link>
                                                <Link href={`/admin/truyen/${t.slug}/edit`} className="text-xs text-blue-600 hover:underline mr-2">Sửa</Link>
                                                <button onClick={() => handleDelete(t)} className="text-xs text-red-500 hover:underline">Xóa</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {data.length === 0 && (
                                        <tr><td colSpan={7} className="text-center py-8 text-muted-2">Không tìm thấy truyện nào</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-surface-2">
                                <span className="text-xs text-muted">Trang {page} / {totalPages} ({total} truyện)</span>
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
