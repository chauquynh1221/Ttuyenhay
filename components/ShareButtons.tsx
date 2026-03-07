'use client'

import { useState, useEffect } from 'react'

interface ShareButtonsProps {
    url: string
    title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false)
    // Khởi tạo bằng relative URL để server và client render giống nhau
    // useEffect sẽ cập nhật lên full URL sau khi hydration xong
    const [fullUrl, setFullUrl] = useState(url)

    useEffect(() => {
        setFullUrl(window.location.origin + url)
    }, [url])

    const encodedUrl = encodeURIComponent(fullUrl)
    const encodedTitle = encodeURIComponent(title)

    const copyLink = () => {
        navigator.clipboard.writeText(fullUrl).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-[#888] font-medium">Chia sẻ:</span>

            {/* Facebook */}
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Chia sẻ lên Facebook"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:bg-[#1565E0] transition-colors text-xs font-bold"
                suppressHydrationWarning
            >
                f
            </a>

            {/* Twitter/X */}
            <a
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Chia sẻ lên X/Twitter"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:bg-[#0c85d0] transition-colors"
                suppressHydrationWarning
            >
                <svg style={{ width: 14, height: 14 }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            </a>

            {/* Copy link */}
            <button
                onClick={copyLink}
                title="Sao chép liên kết"
                className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all
          ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-white text-[#555] border-[#D8D3CB] hover:border-[#C0392B] hover:text-[#C0392B]'}`}
            >
                {copied ? (
                    <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                )}
            </button>
        </div>
    )
}
