'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/Toast'

export default function AdminFeedbackPage() {
    const toast = useToast()
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)

    const fetchData = useCallback(async () => {
        setLoading(true)
        const r = await fetch('/api/feedback')
        const d = await r.json()
        if (d.success) { setItems(d.items); setTotal(d.pagination.total) }
        setLoading(false)
    }, [])

    useEffect(() => { fetchData() }, [fetchData])

    const handleDelete = async (id: string) => {
        if (!confirm('Xóa góp ý này?')) return
        const r = await fetch('/api/feedback', {
            method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
        })
        if (r.ok) { toast('Đã xóa'); fetchData() } else toast('Xóa thất bại', 'error')
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            <h1 className="text-2xl font-bold text-foreground mb-1">💬 Góp ý người dùng</h1>
            <p className="text-sm text-muted mb-6">{total} góp ý</p>

            {loading ? (
                <div className="card p-8 text-center text-muted-2 text-sm">Đang tải...</div>
            ) : items.length === 0 ? (
                <div className="card p-8 text-center text-muted-2 text-sm">Chưa có góp ý nào</div>
            ) : (
                <div className="space-y-3">
                    {items.map((f) => (
                        <div key={f._id} className="card p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-foreground">{f.name || 'Ẩn danh'}
                                        {f.email && <span className="ml-2 text-xs text-muted font-normal">{f.email}</span>}
                                    </p>
                                    <p className="text-xs text-muted-2 mt-0.5">{new Date(f.createdAt).toLocaleString('vi-VN')}</p>
                                </div>
                                <button onClick={() => handleDelete(f._id)} className="text-xs text-red-500 hover:underline flex-shrink-0">Xóa</button>
                            </div>
                            <p className="text-sm text-foreground/90 mt-2 whitespace-pre-line">{f.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
