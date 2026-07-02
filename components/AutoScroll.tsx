'use client'

import { useEffect, useState } from 'react'
import { Play } from './icons'

export default function AutoScroll() {
  const [on, setOn] = useState(false)
  const [speed, setSpeed] = useState(2) // px mỗi nhịp

  useEffect(() => {
    if (!on) return
    const id = window.setInterval(() => {
      window.scrollBy(0, speed)
      // Dừng khi chạm đáy
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) setOn(false)
    }, 24)
    return () => clearInterval(id)
  }, [on, speed])

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setOn((v) => !v)}
        title={on ? 'Dừng tự cuộn' : 'Tự cuộn'}
        aria-label="Tự cuộn"
        className={`grid place-items-center w-10 h-10 rounded-md border transition-colors ${on ? 'bg-primary text-primary-fg border-primary' : 'bg-surface text-muted border-border hover:text-foreground hover:bg-surface-2'}`}
      >
        {on ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
        ) : (
          <Play className="w-4 h-4" />
        )}
      </button>
      {on && (
        <div className="flex items-center gap-1 rounded-md border border-border bg-surface px-1 h-10">
          <button onClick={() => setSpeed((s) => Math.max(1, s - 1))} className="w-6 h-8 text-muted hover:text-foreground text-lg leading-none">−</button>
          <span className="w-3 text-center text-xs font-bold text-foreground">{speed}</span>
          <button onClick={() => setSpeed((s) => Math.min(9, s + 1))} className="w-6 h-8 text-muted hover:text-foreground text-lg leading-none">+</button>
        </div>
      )}
    </div>
  )
}
