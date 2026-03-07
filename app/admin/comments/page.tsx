'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

export default function AdminCommentsPage() {
    const [comments, setComments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [deleting, setDeleting] = useState<string | null>(null)      // ID đang chờ xác nhận xóa
    const [bulkConfirm, setBulkConfirm] = useState(false)

    const fetchData = useCallback(async () => {
        setLoading(true)
        const params = new URLSearchParams({ page: String(page), limit: '20' })
        if (search) params.set('q', search)
        const r = await fetch(`/api/admin/comments?${params}`)
        const d = await r.json()
        if (d.success) {
            setComments(d.comments)
            setTotal(d.pagination.total)
            setTotalPages(d.pagination.totalPages)
        }
        setLoading(false)
        setSelected(new Set())
    }, [search, page])

    useEffect(() => { fetchData() }, [fetchData])

    const doDelete = async (id: string) => {
        const r = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
        const d = await r.json()
        if (!r.ok) { alert(d.error || 'Lỗi xóa bình luận'); return }
    }

    const handleDelete = (id: string) => {
        setDeleting(id)
    }

    const confirmDelete = async () => {
        if (!deleting) return
        await doDelete(deleting)
        setDeleting(null)
        fetchData()
    }

    const handleBulkDelete = () => {
        if (selected.size === 0) return
        setBulkConfirm(true)
    }

    const confirmBulkDelete = async () => {
        await Promise.all(Array.from(selected).map(id => doDelete(id)))
        setBulkConfirm(false)
        fetchData()
    }

    const toggleSelect = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const toggleAll = () => {
        if (selected.size === comments.length) {
            setSelected(new Set())
        } else {
            setSelected(new Set(comments.map(c => c._id)))
        }
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            <h1 className="text-2xl font-bold text-[#1C1C1C] mb-1">💬 Kiểm duyệt bình luận</h1>
            <p className="text-sm text-[#888] mb-6">{total} bình luận trong hệ thống</p>

            <div className="flex items-center gap-3 mb-4">
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                    placeholder="Tìm theo nội dung, tên user..."
                    className="flex-1 max-w-sm px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B]" />
                {selected.size > 0 && (
                    <button onClick={handleBulkDelete}
                        className="px-3 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors">
                        🗑 Xóa {selected.size} đã chọn
                    </button>
                )}
            </div>

            <div className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-[#AAA] text-sm">Đang tải...</div>
                ) : (
                    <>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#E5E0D8] bg-[#F8F7F5]">
                                    <th className="px-4 py-3 w-8">
                                        <input type="checkbox" checked={selected.size === comments.length && comments.length > 0}
                                            onChange={toggleAll} className="accent-[#C0392B]" />
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs text-[#888] font-semibold uppercase">User</th>
                                    <th className="text-left px-4 py-3 text-xs text-[#888] font-semibold uppercase">Nội dung</th>
                                    <th className="text-left px-4 py-3 text-xs text-[#888] font-semibold uppercase">Truyện</th>
                                    <th className="text-center px-4 py-3 text-xs text-[#888] font-semibold uppercase">Ngày</th>
                                    <th className="text-right px-4 py-3 text-xs text-[#888] font-semibold uppercase">Xóa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F1EE]">
                                {comments.map(c => (
                                    <tr key={c._id} className={`hover:bg-[#F8F7F5] ${selected.has(c._id) ? 'bg-red-50' : ''}`}>
                                        <td className="px-4 py-3">
                                            <input type="checkbox" checked={selected.has(c._id)}
                                                onChange={() => toggleSelect(c._id)} className="accent-[#C0392B]" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-[#1C1C1C] text-xs">{c.userName}</span>
                                            {!c.userId && <span className="ml-1 text-[10px] bg-gray-100 text-gray-500 px-1 rounded">Khách</span>}
                                        </td>
                                        <td className="px-4 py-3 text-[#444] text-xs max-w-[300px] truncate">{c.content}</td>
                                        <td className="px-4 py-3">
                                            {c.truyenSlug ? (
                                                <Link href={`/truyen/${c.truyenSlug}`} target="_blank" className="text-xs text-[#C0392B] hover:underline">
                                                    {c.truyenTitle || c.truyenSlug}
                                                </Link>
                                            ) : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-center text-[#888] text-xs">
                                            {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => handleDelete(c._id)}
                                                className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded hover:bg-red-100 transition-colors font-medium">
                                                🗑 Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {comments.length === 0 && (
                                    <tr><td colSpan={6} className="text-center py-8 text-[#AAA]">Không có bình luận nào</td></tr>
                                )}
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

            {/* Modal xác nhận xóa 1 comment */}
            {deleting && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setDeleting(null)}>
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-base font-bold text-[#1C1C1C] mb-2">🗑 Xóa bình luận?</h3>
                        <p className="text-sm text-[#666] mb-5">Hành động này không thể hoàn tác.</p>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setDeleting(null)}
                                className="px-4 py-2 text-sm border border-[#D8D3CB] rounded-lg hover:bg-gray-50">Hủy</button>
                            <button onClick={confirmDelete}
                                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold">Xóa</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal xác nhận xóa nhiều */}
            {bulkConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setBulkConfirm(false)}>
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-base font-bold text-[#1C1C1C] mb-2">🗑 Xóa {selected.size} bình luận?</h3>
                        <p className="text-sm text-[#666] mb-5">Tất cả bình luận đã chọn sẽ bị xóa vĩnh viễn.</p>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setBulkConfirm(false)}
                                className="px-4 py-2 text-sm border border-[#D8D3CB] rounded-lg hover:bg-gray-50">Hủy</button>
                            <button onClick={confirmBulkDelete}
                                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold">Xóa tất cả</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
