'use client'

import { useState } from 'react'

interface ReportButtonProps {
    truyenSlug: string
    chapterId: string
    chapterNumber: number
}

const REPORT_TYPES = [
    { value: 'thieu_noi_dung', label: '📄 Thiếu nội dung / bị cắt' },
    { value: 'sai_noi_dung', label: '❌ Nội dung sai / bị lệch chương' },
    { value: 'loi_font', label: '🔤 Lỗi font / ký tự bị vỡ' },
    { value: 'khac', label: '💬 Lỗi khác' },
]

export default function ReportButton({ truyenSlug, chapterId, chapterNumber }: ReportButtonProps) {
    const [open, setOpen] = useState(false)
    const [type, setType] = useState('thieu_noi_dung')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    const submit = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/report/chapter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ truyenSlug, chapterId, chapterNumber, type, message }),
            })
            if (res.ok) {
                setDone(true)
                setTimeout(() => { setOpen(false); setDone(false) }, 2000)
            }
        } catch { }
        finally { setLoading(false) }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                title="Báo lỗi chương này"
                className="flex items-center gap-1 text-xs text-[#AAA] hover:text-orange-500 transition-colors px-2 py-1 rounded border border-transparent hover:border-orange-200 hover:bg-orange-50"
            >
                <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Báo lỗi
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setOpen(false)}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-[#1C1C1C]">⚠️ Báo lỗi Chương {chapterNumber}</h3>
                            <button onClick={() => setOpen(false)} className="text-[#AAA] hover:text-[#555] text-lg leading-none">×</button>
                        </div>

                        {done ? (
                            <div className="py-6 text-center">
                                <div className="text-4xl mb-2">✅</div>
                                <p className="text-green-600 font-semibold">Cảm ơn bạn đã báo lỗi!</p>
                                <p className="text-sm text-[#888] mt-1">Chúng tôi sẽ kiểm tra sớm nhất có thể.</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2 mb-4">
                                    {REPORT_TYPES.map(t => (
                                        <label key={t.value} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all
                      ${type === t.value ? 'border-[#C0392B] bg-[#FEF2F2]' : 'border-[#E5E0D8] hover:border-[#C0392B]/50'}`}>
                                            <input type="radio" name="type" value={t.value}
                                                checked={type === t.value} onChange={() => setType(t.value)}
                                                className="accent-[#C0392B]" />
                                            <span className="text-sm">{t.label}</span>
                                        </label>
                                    ))}
                                </div>

                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder="Mô tả thêm (không bắt buộc)..."
                                    rows={2}
                                    className="w-full px-3 py-2 text-sm border border-[#D8D3CB] rounded-lg focus:outline-none focus:border-[#C0392B] resize-none mb-4"
                                />

                                <div className="flex gap-2">
                                    <button onClick={() => setOpen(false)}
                                        className="flex-1 py-2 text-sm border border-[#D8D3CB] rounded-lg hover:bg-gray-50 transition-colors">
                                        Hủy
                                    </button>
                                    <button onClick={submit} disabled={loading}
                                        className="flex-1 py-2 text-sm bg-[#C0392B] text-white rounded-lg hover:bg-[#96281B] disabled:opacity-50 transition-colors font-semibold">
                                        {loading ? 'Đang gửi...' : 'Gửi báo lỗi'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
