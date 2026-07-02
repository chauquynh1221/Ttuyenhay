'use client'

import { createContext, useCallback, useContext, useState } from 'react'

type ToastType = 'success' | 'error' | 'info'
interface ToastItem { id: number; message: string; type: ToastType }

const ToastContext = createContext<(message: string, type?: ToastType) => void>(() => { })

export function useToast() {
  return useContext(ToastContext)
}

let counter = 0

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++counter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-16 inset-x-0 z-[200] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id}
            className={`pointer-events-auto flex items-center gap-2 max-w-sm w-full sm:w-auto px-4 py-2.5 rounded-lg shadow-pop text-sm font-medium animate-slide-down
              ${t.type === 'error'
                ? 'bg-primary text-primary-fg'
                : t.type === 'info'
                  ? 'bg-foreground text-surface'
                  : 'bg-surface border border-border text-foreground'}`}
          >
            <span className="flex-shrink-0">
              {t.type === 'error' ? '⚠️' : t.type === 'info' ? 'ℹ️' : '✓'}
            </span>
            <span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
