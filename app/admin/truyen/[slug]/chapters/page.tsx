'use client'

import { useState, useEffect, use, useCallback } from 'react'
import Link from 'next/link'

export default function AdminChaptersPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const [truyen, setTruyen] = useState<any>(null)
    const [chapters, setChapters] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    // Form thêm chương
    const [showForm, setShowForm] = useState(false)
    const [chForm, setChForm] = useState({ chapterNumber: 0, title: '', content: '' })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const fetchData = useCallback(async () => {
        setLoading(true)
        // Lấy thông tin truyện theo slug (chính xác, không phải "hack" search)
        const tr = await fetch(`/api/admin/truyen/${slug}`).then(r => r.json())
        if (tr.success && tr.truyen) {
            const t = tr.truyen
            setTruyen(t)

            // Lấy chương
            const cr = await fetch(`/api/admin/chapters?truyenId=${t._id}&page=${page}&limit=50`).then(r => r.json())
            if (cr.success) {
                setChapters(cr.chapters)
                setTotalPages(cr.pagination.totalPages)
                // Gợi ý số chương kế tiếp dựa trên tổng số chương thực (đúng kể cả >50 chương)
                setChForm(prev => ({ ...prev, chapterNumber: (t.totalChapters || 0) + 1 }))
            }
        }
        setLoading(false)
    }, [slug, page])

    useEffect(() => { fetchData() }, [fetchData])

    const handleAddChapter = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!chForm.content.trim()) { setError('Nội dung chương không được để trống'); return }
        setError('')
        setSaving(true)
        const r = await fetch('/api/admin/chapters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ truyenId: truyen._id, ...chForm }),
        })
        const d = await r.json()
        if (!r.ok) { setError(d.error || 'Lỗi'); setSaving(false); return }
        setSaving(false)
        setChForm({ chapterNumber: chForm.chapterNumber + 1, title: '', content: '' })
        setShowForm(false)
        fetchData()
    }

    const handleDeleteChapter = async (ch: any) => {
        if (!confirm(`Xóa chương ${ch.chapterNumber}?`)) return
        await fetch('/api/admin/chapters', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: ch._id, truyenId: truyen._id }),
        })
        fetchData()
    }

    if (loading) return <div className="p-8 text-center text-muted-2">Đang tải...</div>
    if (!truyen) return <div className="p-8 text-center text-red-500">Không tìm thấy truyện</div>

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/truyen" className="text-xs text-muted-2 hover:text-primary">← Danh sách truyện</Link>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">📖 {truyen.title}</h1>
                    <p className="text-sm text-muted mt-0.5">{truyen.totalChapters} chương • {truyen.author}</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary btn-sm">
                    {showForm ? '✕ Đóng' : '➕ Thêm chương'}
                </button>
            </div>

            {/* Form thêm chương */}
            {showForm && (
                <form onSubmit={handleAddChapter} className="card p-5 mb-6 space-y-3">
                    <h2 className="text-sm font-bold text-foreground">➕ Thêm chương mới</h2>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-foreground/90 mb-1">Số chương *</label>
                            <input type="number" value={chForm.chapterNumber} onChange={e => setChForm({ ...chForm, chapterNumber: Number(e.target.value) })}
                                className="form-control" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-foreground/90 mb-1">Tiêu đề chương</label>
                            <input value={chForm.title} onChange={e => setChForm({ ...chForm, title: e.target.value })}
                                placeholder={`Chương ${chForm.chapterNumber}`}
                                className="form-control" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-foreground/90 mb-1">Nội dung chương *</label>
                        <textarea value={chForm.content} onChange={e => setChForm({ ...chForm, content: e.target.value })}
                            placeholder="Paste nội dung chương vào đây..."
                            rows={12}
                            className="form-control h-auto py-2 resize-y font-mono" />
                        <p className="text-[10px] text-muted-2 mt-1">{chForm.content.length.toLocaleString()} ký tự</p>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" disabled={saving}
                            className="btn btn-primary btn-sm">
                            {saving ? 'Đang lưu...' : '💾 Lưu chương'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)}
                            className="btn btn-default btn-sm">Hủy</button>
                    </div>
                </form>
            )}

            {/* Bảng chương */}
            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border bg-surface-2">
                            <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase w-20">Chương</th>
                            <th className="text-left px-4 py-3 text-xs text-muted font-semibold uppercase">Tiêu đề</th>
                            <th className="text-center px-4 py-3 text-xs text-muted font-semibold uppercase">Độ dài</th>
                            <th className="text-center px-4 py-3 text-xs text-muted font-semibold uppercase">Ngày tạo</th>
                            <th className="text-right px-4 py-3 text-xs text-muted font-semibold uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {chapters.map(ch => (
                            <tr key={ch._id} className="hover:bg-surface-2 transition-colors">
                                <td className="px-4 py-3 font-semibold text-primary">{ch.chapterNumber}</td>
                                <td className="px-4 py-3 text-foreground/90">{ch.title || `Chương ${ch.chapterNumber}`}</td>
                                <td className="px-4 py-3 text-center text-muted text-xs">{ch.contentLength?.toLocaleString()} ký tự</td>
                                <td className="px-4 py-3 text-center text-muted text-xs">{new Date(ch.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td className="px-4 py-3 text-right">
                                    <Link href={`/truyen/${slug}/chuong-${ch.chapterNumber}`} target="_blank"
                                        className="text-xs text-muted hover:underline mr-2">Xem</Link>
                                    <Link href={`/admin/truyen/${slug}/chapters/${ch.chapterNumber}/edit?id=${ch._id}`}
                                        className="text-xs text-blue-600 hover:underline mr-2">Sửa</Link>
                                    <button onClick={() => handleDeleteChapter(ch)} className="text-xs text-red-500 hover:underline">Xóa</button>
                                </td>
                            </tr>
                        ))}
                        {chapters.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-8 text-muted-2">Chưa có chương nào</td></tr>
                        )}
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
            </div>
        </div>
    )
}
