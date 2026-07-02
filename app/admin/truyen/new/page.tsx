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
            <h1 className="text-2xl font-bold text-foreground mb-1">➕ Thêm truyện mới</h1>
            <p className="text-sm text-muted mb-6">Nhập thông tin truyện vào hệ thống</p>

            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground/90 mb-1">Tên truyện *</label>
                        <input value={form.title} onChange={e => handleTitleChange(e.target.value)}
                            placeholder="VD: Đấu Phá Thương Khung"
                            className="form-control" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground/90 mb-1">Slug *</label>
                        <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                            placeholder="dau-pha-thuong-khung"
                            className="form-control font-mono text-xs" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground/90 mb-1">Tác giả *</label>
                        <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                            placeholder="Thiên Tàm Thổ Đậu"
                            className="form-control" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground/90 mb-1">Ảnh bìa (URL)</label>
                        <input value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })}
                            placeholder="https://..."
                            className="form-control" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground/90 mb-1">Mô tả *</label>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Tóm tắt nội dung truyện..."
                        rows={4}
                        className="form-control h-auto py-2 resize-none" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground/90 mb-2">Thể loại</label>
                    <div className="flex flex-wrap gap-2">
                        {genres.map(g => (
                            <button key={g._id} type="button" onClick={() => toggleGenre(g.name)}
                                className={`px-3 py-1 text-xs rounded-full border transition-colors
                                    ${form.genres.includes(g.name)
                                        ? 'bg-primary text-primary-fg border-primary'
                                        : 'bg-surface text-foreground/90 border-border hover:border-primary'}`}>
                                {g.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground/90 mb-1">Trạng thái</label>
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                            className="form-control">
                            <option value="ongoing">Đang ra</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="paused">Tạm dừng</option>
                        </select>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer mt-6">
                        <input type="checkbox" checked={form.isHot} onChange={e => setForm({ ...form, isHot: e.target.checked })}
                            className="accent-primary" />
                        <span className="text-sm">🔥 Hot</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer mt-6">
                        <input type="checkbox" checked={form.isNew} onChange={e => setForm({ ...form, isNew: e.target.checked })}
                            className="accent-primary" />
                        <span className="text-sm">🆕 Mới</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer mt-6">
                        <input type="checkbox" checked={form.isFull} onChange={e => setForm({ ...form, isFull: e.target.checked })}
                            className="accent-primary" />
                        <span className="text-sm">✅ Full</span>
                    </label>
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving}
                        className="btn btn-primary">
                        {saving ? 'Đang lưu...' : '💾 Lưu truyện'}
                    </button>
                    <button type="button" onClick={() => router.back()}
                        className="btn btn-default">
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    )
}
