'use client'

import { useState } from 'react'
import { useToast } from '@/components/Toast'

export default function GopYForm() {
    const toast = useToast()
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (form.message.trim().length < 5) { toast('Nội dung góp ý quá ngắn', 'error'); return }
        setLoading(true)
        const r = await fetch('/api/feedback', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
        setLoading(false)
        if (r.ok) { setSent(true); toast('Cảm ơn góp ý của bạn!') }
        else { const d = await r.json(); toast(d.error || 'Gửi thất bại', 'error') }
    }

    if (sent) {
        return (
            <div className="p-6 bg-surface-2 border border-border rounded-lg text-center">
                <div className="text-3xl mb-2">🐾</div>
                <p className="text-foreground font-semibold">Đã gửi góp ý!</p>
                <p className="text-sm text-muted mt-1">Cảm ơn bạn đã giúp Bongmeow tốt hơn.</p>
            </div>
        )
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground/90 mb-1.5">Tên (không bắt buộc)</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-control" placeholder="Tên của bạn" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground/90 mb-1.5">Email (không bắt buộc)</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-control" placeholder="Để chúng tôi phản hồi" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-foreground/90 mb-1.5">Nội dung góp ý</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5} maxLength={2000}
                    className="form-control !h-auto py-3 resize-y" placeholder="Chia sẻ góp ý, đề xuất tính năng, hoặc báo lỗi..." />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Đang gửi...' : 'Gửi góp ý'}</button>
        </form>
    )
}
