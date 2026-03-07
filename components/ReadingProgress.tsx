'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgress() {
    const [progress, setProgress] = useState(0)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const el = document.documentElement
            const scrollTop = el.scrollTop || document.body.scrollTop
            const scrollHeight = el.scrollHeight - el.clientHeight
            const pct = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0

            setProgress(pct)
            setVisible(scrollTop > 100)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            {/* Progress bar — sticky top */}
            <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-[#E5E0D8]">
                <div
                    className="h-full bg-[#C0392B] transition-all duration-150"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Scroll-to-top button */}
            {visible && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-[#C0392B] text-white rounded-full shadow-lg hover:bg-[#96281B] transition-all flex items-center justify-center"
                    title="Lên đầu trang"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            )}

            {/* Progress % badge */}
            {visible && (
                <div className="fixed bottom-6 left-6 z-50 bg-black/60 text-white text-xs font-medium px-2.5 py-1.5 rounded-full">
                    {progress}%
                </div>
            )}
        </>
    )
}
