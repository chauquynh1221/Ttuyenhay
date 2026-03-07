'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminNewTruyenPage() {
    const router = useRouter()
    const [genres, setGenres] = useState<{ _id: string; name: string }[]>([])
    const [form, setForm] = useState({
        title: '', slug: '', author: '', description: '', coverImage: '',
        genres: [] as string[], status: 'ongoing', isHot: false, isFull: false, isNew: true,
    })
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetch('/api/admin/genres').then(r => r.json()).then(d => {
            if (d.success) setGenres(d.genres)
        })
    }, [])

    const generateSlug = (title: string) =>
        title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd')
            .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const handleTitleChange = (title: string) => {
        setForm(prev => ({ ...prev, title, slug: generateSlug(title) }))
    }

    const toggleGenre = (name: string) => {
        setForm(prev => ({
            ...prev,
            genres: prev.genres.includes(name)
                ? prev.genres.filter(g => g !== name)
                : [...prev.genres, name],
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!form.title || !form.slug || !form.author || !form.description) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc')
            return
        }
        setSaving(true)
        const r = await fetch('/api/admin/truyen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
        const d = await r.json()
        if (!r.ok) { setError(d.error || 'Lỗi tạo truyện'); setSaving(false); return }
        router.push('/admin/truyen')
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-3xl">
            <h1 className="text-2xl font-bold text-[#1C1C1C] mb-1">➕ Thêm truyện mới</h1>
            <p className="text-sm text-[#888] mb-6">Nhập thông tin truyện vào hệ thống</p>

            <form onSubmit={handleSubmit} className="bg-white border border-[#E5E0D8] rounded-xl p-6 space-y-4">
                {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#444] mb-1">Tên truyện *</label>
                        <input value={form.title} onChange={e => handleTitleChange(e.target.value)}
                            placeholder="VD: Đấu Phá Thương Khung"
                            className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#444] mb-1">Slug *</label>
                        <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                            placeholder="dau-pha-thuong-khung"
                            className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B] font-mono text-xs" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#444] mb-1">Tác giả *</label>
                        <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                            placeholder="Thiên Tàm Thổ Đậu"
                            className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#444] mb-1">Ảnh bìa (URL)</label>
                        <input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B]" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#444] mb-1">Mô tả *</label>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Tóm tắt nội dung truyện..."
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B] resize-none" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#444] mb-2">Thể loại</label>
                    <div className="flex flex-wrap gap-2">
                        {genres.map(g => (
                            <button key={g._id} type="button" onClick={() => toggleGenre(g.name)}
                                className={`px-3 py-1 text-xs rounded-full border transition-colors
                                    ${form.genres.includes(g.name)
                                        ? 'bg-[#C0392B] text-white border-[#C0392B]'
                                        : 'bg-white text-[#666] border-[#D8D3CB] hover:border-[#C0392B]'}`}>
                                {g.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#444] mb-1">Trạng thái</label>
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B]">
                            <option value="ongoing">Đang ra</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="paused">Tạm dừng</option>
                        </select>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer mt-6">
                        <input type="checkbox" checked={form.isHot} onChange={e => setForm({ ...form, isHot: e.target.checked })}
                            className="accent-[#C0392B]" />
                        <span className="text-sm">🔥 Hot</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer mt-6">
                        <input type="checkbox" checked={form.isNew} onChange={e => setForm({ ...form, isNew: e.target.checked })}
                            className="accent-[#C0392B]" />
                        <span className="text-sm">🆕 Mới</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer mt-6">
                        <input type="checkbox" checked={form.isFull} onChange={e => setForm({ ...form, isFull: e.target.checked })}
                            className="accent-[#C0392B]" />
                        <span className="text-sm">✅ Full</span>
                    </label>
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving}
                        className="px-6 py-2.5 bg-[#C0392B] text-white font-semibold rounded-lg hover:bg-[#96281B] disabled:opacity-50 transition-colors text-sm">
                        {saving ? 'Đang lưu...' : '💾 Lưu truyện'}
                    </button>
                    <button type="button" onClick={() => router.back()}
                        className="px-6 py-2.5 text-sm border border-[#D8D3CB] rounded-lg hover:bg-gray-50 transition-colors">
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    )
}
