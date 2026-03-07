'use client'

import { useState, useEffect, useCallback } from 'react'

interface Genre {
    _id: string
    name: string
    slug: string
    description: string
    storyCount: number
}

export default function AdminGenresPage() {
    const [genres, setGenres] = useState<Genre[]>([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({ name: '', slug: '', description: '' })
    const [editingId, setEditingId] = useState<string | null>(null)
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    const fetchGenres = useCallback(async () => {
        setLoading(true)
        const r = await fetch('/api/admin/genres')
        const d = await r.json()
        if (d.success) setGenres(d.genres)
        setLoading(false)
    }, [])

    useEffect(() => { fetchGenres() }, [fetchGenres])

    const generateSlug = (name: string) => {
        return name
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd')
            .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    const handleNameChange = (name: string) => {
        setForm(prev => ({
            ...prev,
            name,
            slug: editingId ? prev.slug : generateSlug(name),
        }))
    }

    const handleSave = async () => {
        if (!form.name.trim() || !form.slug.trim()) { setError('Tên và slug không được để trống'); return }
        setError('')
        setSaving(true)

        const method = editingId ? 'PUT' : 'POST'
        const body = editingId ? { id: editingId, ...form } : form
        const r = await fetch('/api/admin/genres', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        const d = await r.json()
        if (!r.ok) { setError(d.error || 'Lỗi'); setSaving(false); return }

        setForm({ name: '', slug: '', description: '' })
        setEditingId(null)
        setSaving(false)
        fetchGenres()
    }

    const handleEdit = (g: Genre) => {
        setEditingId(g._id)
        setForm({ name: g.name, slug: g.slug, description: g.description || '' })
        setError('')
    }

    const handleDelete = async (g: Genre) => {
        if (!confirm(`Xóa thể loại "${g.name}"?`)) return
        const r = await fetch('/api/admin/genres', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: g._id }),
        })
        const d = await r.json()
        if (!r.ok) { alert(d.error || 'Lỗi xóa'); return }
        fetchGenres()
    }

    const cancelEdit = () => {
        setEditingId(null)
        setForm({ name: '', slug: '', description: '' })
        setError('')
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            <h1 className="text-2xl font-bold text-[#1C1C1C] mb-1">🏷️ Quản lý thể loại</h1>
            <p className="text-sm text-[#888] mb-6">Master data — Quản lý danh mục thể loại truyện</p>

            {/* Form thêm/sửa */}
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-5 mb-6">
                <h2 className="text-sm font-bold text-[#1C1C1C] mb-3">
                    {editingId ? '✏️ Sửa thể loại' : '➕ Thêm thể loại mới'}
                </h2>
                {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-[#666] mb-1">Tên thể loại *</label>
                        <input value={form.name} onChange={e => handleNameChange(e.target.value)}
                            placeholder="VD: Tiên Hiệp"
                            className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B]" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[#666] mb-1">Slug *</label>
                        <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                            placeholder="tien-hiep"
                            className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B]" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[#666] mb-1">Mô tả</label>
                        <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="Mô tả ngắn..."
                            className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B]" />
                    </div>
                </div>
                <div className="flex gap-2 mt-3">
                    <button onClick={handleSave} disabled={saving}
                        className="px-4 py-2 bg-[#C0392B] text-white text-sm font-semibold rounded-lg hover:bg-[#96281B] disabled:opacity-50 transition-colors">
                        {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                    {editingId && (
                        <button onClick={cancelEdit}
                            className="px-4 py-2 text-sm border border-[#D8D3CB] rounded-lg hover:bg-gray-50 transition-colors">
                            Hủy
                        </button>
                    )}
                </div>
            </div>

            {/* Bảng */}
            <div className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-[#AAA] text-sm">Đang tải...</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#E5E0D8] bg-[#F8F7F5]">
                                <th className="text-left px-4 py-3 text-xs text-[#888] font-semibold uppercase">#</th>
                                <th className="text-left px-4 py-3 text-xs text-[#888] font-semibold uppercase">Tên</th>
                                <th className="text-left px-4 py-3 text-xs text-[#888] font-semibold uppercase">Slug</th>
                                <th className="text-left px-4 py-3 text-xs text-[#888] font-semibold uppercase">Mô tả</th>
                                <th className="text-center px-4 py-3 text-xs text-[#888] font-semibold uppercase">Số truyện</th>
                                <th className="text-right px-4 py-3 text-xs text-[#888] font-semibold uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F1EE]">
                            {genres.map((g, i) => (
                                <tr key={g._id} className="hover:bg-[#F8F7F5] transition-colors">
                                    <td className="px-4 py-3 text-[#AAA]">{i + 1}</td>
                                    <td className="px-4 py-3 font-medium text-[#1C1C1C]">{g.name}</td>
                                    <td className="px-4 py-3 text-[#888] font-mono text-xs">{g.slug}</td>
                                    <td className="px-4 py-3 text-[#888] truncate max-w-[200px]">{g.description || '—'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">{g.storyCount}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => handleEdit(g)} className="text-xs text-blue-600 hover:underline mr-3">Sửa</button>
                                        <button onClick={() => handleDelete(g)} className="text-xs text-red-500 hover:underline"
                                            disabled={g.storyCount > 0} title={g.storyCount > 0 ? 'Không thể xóa — có truyện liên kết' : ''}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {genres.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-8 text-[#AAA]">Chưa có thể loại nào</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
