'use client'

import { useState, useEffect } from 'react'

interface RatingWidgetProps {
    truyenId: string
}

const LABELS: Record<number, string> = {
    1: 'Rất tệ', 2: 'Tệ', 3: 'Kém', 4: 'Dưới TB', 5: 'Trung bình',
    6: 'Khá', 7: 'Tốt', 8: 'Rất tốt', 9: 'Xuất sắc', 10: 'Tuyệt vời'
}

export default function RatingWidget({ truyenId }: RatingWidgetProps) {
    const [avg, setAvg] = useState(0)
    const [count, setCount] = useState(0)
    const [userScore, setUserScore] = useState<number | null>(null)
    const [hovered, setHovered] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        Promise.all([
            fetch('/api/auth/me').then(r => r.json()),
            fetch(`/api/rating?truyenId=${truyenId}`).then(r => r.json()),
        ]).then(([authData, ratingData]) => {
            setLoggedIn(!!authData.user)
            if (ratingData.success) {
                setAvg(ratingData.avg)
                setCount(ratingData.count)
                setUserScore(ratingData.userScore)
            }
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [truyenId])

    const handleRate = async (score: number) => {
        if (!loggedIn) { window.location.href = '/dang-nhap'; return }
        if (submitting) return
        setSubmitting(true)
        try {
            const res = await fetch('/api/rating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ truyenId, score }),
            })
            const data = await res.json()
            if (data.success) {
                setAvg(data.avg)
                setCount(data.count)
                setUserScore(data.userScore)
            }
        } catch (error) {
            console.error('Rating error:', error)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="h-20 bg-[#F8F7F5] rounded-lg animate-pulse" />

    const displayScore = hovered ?? userScore

    return (
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#1C1C1C]">⭐ Đánh giá truyện</h3>
                <div className="text-right">
                    <span className="text-xl font-bold text-[#C0392B]">{avg || '—'}</span>
                    <span className="text-xs text-[#AAA]">/10 ({count.toLocaleString()} đánh giá)</span>
                </div>
            </div>

            {/* Star bar (1-10) */}
            <div className="flex gap-1 mb-2" onMouseLeave={() => setHovered(null)}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(star => {
                    const filled = displayScore !== null ? star <= displayScore : star <= avg
                    return (
                        <button
                            key={star}
                            onMouseEnter={() => loggedIn && setHovered(star)}
                            onClick={() => handleRate(star)}
                            disabled={submitting}
                            className="flex-1 group"
                            title={LABELS[star]}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className={`w-full h-5 transition-colors ${filled
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-[#E5E0D8] fill-[#E5E0D8]'
                                    } ${loggedIn ? 'group-hover:text-yellow-300 group-hover:fill-yellow-300' : ''}`}
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </button>
                    )
                })}
            </div>

            {/* Label + user state */}
            <div className="text-center text-xs">
                {!loggedIn && (
                    <p className="text-[#AAA]">
                        <a href="/dang-nhap" className="text-[#C0392B] hover:underline">Đăng nhập</a> để đánh giá
                    </p>
                )}
                {loggedIn && userScore && !hovered && (
                    <p className="text-[#888]">Bạn đã đánh giá: <span className="font-semibold text-[#C0392B]">{userScore}/10</span> — {LABELS[userScore]}</p>
                )}
                {hovered && (
                    <p className="text-[#888]">{LABELS[hovered]} — <span className="font-semibold text-[#C0392B]">{hovered}/10</span></p>
                )}
                {loggedIn && !userScore && !hovered && (
                    <p className="text-[#AAA]">Di chuột để chọn điểm</p>
                )}
            </div>
        </div>
    )
}
