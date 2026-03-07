'use client'

import { useState, useEffect, useCallback } from 'react'

const REPORT_TYPES: Record<string, string> = {
    wrong_content: 'Nội dung sai',
    missing_content: 'Thiếu nội dung',
    duplicate: 'Chương trùng',
    wrong_order: 'Sai thứ tự',
    other: 'Khác',
}

export default function AdminReportsPage() {
    const [reports, setReports] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('pending')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

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

    const handleResolve = async (id: string) => {
        await fetch('/api/admin/reports', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: 'resolved' }),
        })
        fetchData()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Xóa báo lỗi này?')) return
        await fetch('/api/admin/reports', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        fetchData()
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            <h1 className="text-2xl font-bold text-[#1C1C1C] mb-1">🚨 Báo lỗi chương</h1>
            <p className="text-sm text-[#888] mb-6">{total} báo lỗi {statusFilter === 'pending' ? 'chờ xử lý' : ''}</p>

            <div className="flex gap-2 mb-4">
                {['pending', 'resolved', ''].map(s => (
                    <button key={s || 'all'} onClick={() => { setStatusFilter(s); setPage(1) }}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors
                            ${statusFilter === s ? 'bg-[#C0392B] text-white border-[#C0392B]' : 'border-[#D8D3CB] hover:border-[#C0392B]'}`}>
                        {s === 'pending' ? '⏳ Chờ xử lý' : s === 'resolved' ? '✅ Đã xử lý' : '📋 Tất cả'}
                    </button>
                ))}
            </div>

            <div className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-[#AAA] text-sm">Đang tải...</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#E5E0D8] bg-[#F8F7F5]">
                                <th className="text-left px-4 py-3 text-xs text-[#888] font-semibold uppercase">Truyện</th>
                                <th className="text-center px-4 py-3 text-xs text-[#888] font-semibold uppercase">Chương</th>
                                <th className="text-left px-4 py-3 text-xs text-[#888] font-semibold uppercase">Loại lỗi</th>
                                <th className="text-left px-4 py-3 text-xs text-[#888] font-semibold uppercase">Chi tiết</th>
                                <th className="text-center px-4 py-3 text-xs text-[#888] font-semibold uppercase">Ngày</th>
                                <th className="text-right px-4 py-3 text-xs text-[#888] font-semibold uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F1EE]">
                            {reports.map(r => (
                                <tr key={r._id} className="hover:bg-[#F8F7F5]">
                                    <td className="px-4 py-3 font-medium text-[#1C1C1C]">{r.truyenId?.title || '—'}</td>
                                    <td className="px-4 py-3 text-center text-[#888]">{r.chapterNumber || '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs">{REPORT_TYPES[r.reportType] || r.reportType}</span>
                                    </td>
                                    <td className="px-4 py-3 text-[#666] text-xs max-w-[200px] truncate">{r.description || '—'}</td>
                                    <td className="px-4 py-3 text-center text-[#888] text-xs">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        {r.status !== 'resolved' && (
                                            <button onClick={() => handleResolve(r._id)} className="text-xs text-green-600 hover:underline mr-2">✅ Xong</button>
                                        )}
                                        <button onClick={() => handleDelete(r._id)} className="text-xs text-red-500 hover:underline">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                            {reports.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-8 text-[#AAA]">Không có báo lỗi nào</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
