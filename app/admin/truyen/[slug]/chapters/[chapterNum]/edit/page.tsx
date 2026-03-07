'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminEditChapterPage({ params }: { params: Promise<{ slug: string; chapterNum: string }> }) {
    const { slug, chapterNum } = use(params)
    const router = useRouter()
    const searchParams = useSearchParams()
    const chapterId = searchParams.get('id')

    const [form, setForm] = useState({ title: '', content: '', chapterNumber: Number(chapterNum) })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!chapterId) return
        fetch(`/api/admin/chapters/${chapterId}`).then(r => r.json()).then(d => {
            if (d.success) {
                setForm({
                    title: d.chapter.title || '',
                    content: d.chapter.content || '',
                    chapterNumber: d.chapter.chapterNumber,
                })
            }
            setLoading(false)
        })
    }, [chapterId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSaving(true)
        const r = await fetch('/api/admin/chapters', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: chapterId, ...form }),
        })
        const d = await r.json()
        if (!r.ok) { setError(d.error || 'Lỗi cập nhật'); setSaving(false); return }
        router.push(`/admin/truyen/${slug}/chapters`)
    }

    if (loading) return <div className="p-8 text-center text-[#AAA]">Đang tải...</div>

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            <h1 className="text-2xl font-bold text-[#1C1C1C] mb-1">✏️ Sửa chương {form.chapterNumber}</h1>
            <p className="text-sm text-[#888] mb-6">{slug}</p>

            <form onSubmit={handleSubmit} className="bg-white border border-[#E5E0D8] rounded-xl p-6 space-y-4">
                {error && <div className="px-4 py-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#444] mb-1">Số chương</label>
                        <input type="number" value={form.chapterNumber}
                            onChange={e => setForm({ ...form, chapterNumber: Number(e.target.value) })}
                            className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#444] mb-1">Tiêu đề</label>
                        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B]" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[#444] mb-1">Nội dung</label>
                    <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                        rows={20}
                        className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B] resize-y font-mono" />
                    <p className="text-[10px] text-[#AAA] mt-1">{form.content.length.toLocaleString()} ký tự</p>
                </div>
                <div className="flex gap-3">
                    <button type="submit" disabled={saving}
                        className="px-6 py-2.5 bg-[#C0392B] text-white font-semibold rounded-lg hover:bg-[#96281B] disabled:opacity-50 text-sm">
                        {saving ? 'Đang lưu...' : '💾 Cập nhật'}
                    </button>
                    <button type="button" onClick={() => router.back()}
                        className="px-6 py-2.5 text-sm border border-[#D8D3CB] rounded-lg hover:bg-gray-50">Hủy</button>
                </div>
            </form>
        </div>
    )
}
