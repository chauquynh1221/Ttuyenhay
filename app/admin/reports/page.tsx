'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/Toast'

// Khớp enum trong models/ChapterReport.ts
const REPORT_TYPES: Record<string, string> = {
    thieu_noi_dung: 'Thiếu nội dung',
    sai_noi_dung: 'Nội dung sai',
    loi_font: 'Lỗi font',
    khac: 'Khác',
}

export default function AdminReportsPage() {
    const [reports, setReports] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState('pending')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const toast = useToast()

    const fetchData = useCallback(async () => {
        setLoading(true)
        const params = new URLSearchParams()
        if (statusFilter) params.set('status', statusFilter)
        params.set('page', String(page))
        const r = await fetch(`/api/admin/reports?${params}`)
        const d = await r.json()
        if (d.success) { setReports(d.reports); setTotal(d.pagination.total) }
        setLoading(false)
    }, [statusFilter, page])

    useEffect(() => { fetchData() }, [fetchData])

    const handleResolve = async (id: string, resolved: boolean) => {
        setBusy(id)
        const r = await fetch('/api/admin/reports', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, resolved }),
        })
        setBusy(null)
        if (r.ok) { toast(resolved ? 'Đã đánh dấu xử lý' : 'Đã mở lại'); fetchData() }
        else toast('Thao tác thất bại', 'error')
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Xóa báo lỗi này?')) return
        setBusy(id)
        const r = await fetch('/api/admin/reports', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        setBusy(null)
        if (r.ok) { toast('Đã xóa'); fetchData() }
        else toast('Xóa thất bại', 'error')
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            <h1 className="text-2xl font-bold text-foreground mb-1">🚨 Báo lỗi chương</h1>
            <p className="text-sm text-muted mb-6">{total} báo lỗi {statusFilter === 'pending' ? 'chờ xử lý' : statusFilter === 'resolved' ? 'đã xử lý' : ''}</p>

            <div className="flex gap-2 mb-4">
                {['pending', 'resolved', ''].map(s => (
                    <button key={s || 'all'} onClick={() => { setStatusFilter(s); setPage(1) }}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors
                            ${statusFilter === s ? 'bg-primary text-primary-fg border-primary' : 'border-border hover:border-primary'}`}>
                        {s === 'pending' ? '⏳ Chờ xử lý' : s === 'resolved' ? '✅ Đã xử lý' : '📋 Tất cả'}
                    </button>
                ))}
            </div>

            <div className="card overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center text-muted-2 text-sm">Đang tải...</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-surface-2">
                                <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase">Truyện</th>
                                <th className="text-center px-4 py-3 text-xs text-muted font-semibold uppercase">Chương</th>
                                <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase">Loại lỗi</th>
                                <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase">Chi tiết</th>
                                <th className="text-center px-4 py-3 text-xs text-muted font-semibold uppercase">Ngày</th>
                                <th className="text-right px-4 py-3 text-xs text-muted font-semibold uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {reports.map(r => (
                                <tr key={r._id} className="hover:bg-surface-2">
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        <a href={`/truyen/${r.truyenSlug}`} target="_blank" className="hover:text-primary">{r.truyenTitle || r.truyenSlug || '—'}</a>
                                    </td>
                                    <td className="px-4 py-3 text-center text-muted">
                                        {r.chapterNumber ? <a href={`/truyen/${r.truyenSlug}/${r.chapterNumber}`} target="_blank" className="hover:text-primary">{r.chapterNumber}</a> : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 bg-primary-soft text-primary rounded text-xs whitespace-nowrap">{REPORT_TYPES[r.type] || r.type}</span>
                                    </td>
                                    <td className="px-4 py-3 text-foreground/90 text-xs max-w-[240px] truncate" title={r.message}>{r.message || '—'}</td>
                                    <td className="px-4 py-3 text-center text-muted text-xs whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        {r.resolved ? (
                                            <button disabled={busy === r._id} onClick={() => handleResolve(r._id, false)} className="text-xs text-muted hover:underline mr-3 disabled:opacity-50">↩ Mở lại</button>
                                        ) : (
                                            <button disabled={busy === r._id} onClick={() => handleResolve(r._id, true)} className="text-xs text-[rgb(var(--success))] hover:underline mr-3 disabled:opacity-50">✅ Xong</button>
                                        )}
                                        <button disabled={busy === r._id} onClick={() => handleDelete(r._id)} className="text-xs text-red-500 hover:underline disabled:opacity-50">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                            {reports.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-8 text-muted-2">Không có báo lỗi nào</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
