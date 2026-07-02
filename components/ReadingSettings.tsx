'use client'

import { useState } from 'react'
import {
  READING_FONTS,
  READING_THEMES,
  type ReadingSettings as Settings,
  type ReadingThemeKey,
} from '@/lib/useReadingSettings'

// Re-export để các file cũ `import { ReadingSettings }` vẫn chạy
export type { ReadingSettings } from '@/lib/useReadingSettings'

interface Props {
  settings: Settings
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  reset: () => void
}

export default function ReadingSettings({ settings, update, reset }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        aria-label="Tùy chỉnh đọc"
        title="Tùy chỉnh hiển thị"
        className="grid place-items-center w-10 h-10 rounded-md border border-border bg-surface text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/40 sm:bg-transparent" onClick={() => setOpen(false)} />
          {/* Mobile: bottom sheet · Desktop: popover */}
          <div className="fixed sm:absolute z-[70] left-0 right-0 bottom-0 sm:left-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-2
                          w-full sm:w-[340px] bg-surface border-t sm:border border-border sm:rounded-lg shadow-pop
                          rounded-t-2xl p-5 animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">Tùy chỉnh đọc</h3>
              <div className="flex items-center gap-1">
                <button onClick={reset} className="text-xs text-muted hover:text-primary px-2 py-1 rounded transition-colors">Mặc định</button>
                <button onClick={() => setOpen(false)} className="grid place-items-center w-8 h-8 text-muted hover:text-foreground rounded transition-colors" aria-label="Đóng">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Cỡ chữ */}
            <Field label="Cỡ chữ" value={`${settings.fontSize}px`}>
              <Stepper
                onMinus={() => update('fontSize', Math.max(14, settings.fontSize - 1))}
                onPlus={() => update('fontSize', Math.min(34, settings.fontSize + 1))}
              >
                <input
                  type="range" min={14} max={34} step={1}
                  value={settings.fontSize}
                  onChange={(e) => update('fontSize', parseInt(e.target.value))}
                  className="flex-1 accent-primary cursor-pointer"
                />
              </Stepper>
            </Field>

            {/* Giãn dòng */}
            <Field label="Giãn dòng" value={`${Math.round(settings.lineHeight * 100)}%`}>
              <Stepper
                onMinus={() => update('lineHeight', Math.max(1.4, +(settings.lineHeight - 0.1).toFixed(2)))}
                onPlus={() => update('lineHeight', Math.min(2.6, +(settings.lineHeight + 0.1).toFixed(2)))}
              >
                <input
                  type="range" min={1.4} max={2.6} step={0.1}
                  value={settings.lineHeight}
                  onChange={(e) => update('lineHeight', parseFloat(e.target.value))}
                  className="flex-1 accent-primary cursor-pointer"
                />
              </Stepper>
            </Field>

            {/* Font */}
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-muted mb-2">Font chữ</label>
              <div className="grid grid-cols-2 gap-1.5">
                {READING_FONTS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => update('fontFamily', f.value)}
                    style={{ fontFamily: f.value }}
                    className={`h-10 px-3 text-[13px] rounded-md border transition-colors ${
                      settings.fontFamily === f.value
                        ? 'border-primary bg-primary-soft text-primary font-semibold'
                        : 'border-border bg-surface text-foreground hover:border-primary'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Màu nền */}
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-muted mb-2">Màu nền</label>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(READING_THEMES) as ReadingThemeKey[]).map((key) => {
                  const t = READING_THEMES[key]
                  const active = settings.theme === key
                  return (
                    <button
                      key={key}
                      onClick={() => update('theme', key)}
                      title={t.label}
                      aria-label={t.label}
                      className={`h-11 rounded-md border-2 transition-all ${active ? 'border-primary scale-105' : 'border-border hover:border-primary'}`}
                      style={{ background: t.swatch }}
                    />
                  )
                })}
              </div>
            </div>

            {/* Chiều rộng */}
            <button
              onClick={() => update('wide', !settings.wide)}
              className="w-full flex items-center justify-between gap-3 p-3 bg-surface-2 border border-border rounded-md text-[13px] font-medium text-foreground"
            >
              <span>Mở rộng chiều ngang</span>
              <span className={`relative inline-block w-10 h-6 rounded-full transition-colors ${settings.wide ? 'bg-primary' : 'bg-border-strong'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.wide ? 'translate-x-4' : ''}`} />
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function Field({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[13px] font-medium text-muted">{label}</label>
        <span className="text-[13px] font-bold text-primary">{value}</span>
      </div>
      {children}
    </div>
  )
}

function Stepper({ onMinus, onPlus, children }: { onMinus: () => void; onPlus: () => void; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onMinus} className="grid place-items-center w-9 h-9 rounded-md border border-border bg-surface text-foreground hover:bg-surface-2 text-lg leading-none flex-shrink-0">−</button>
      {children}
      <button onClick={onPlus} className="grid place-items-center w-9 h-9 rounded-md border border-border bg-surface text-foreground hover:bg-surface-2 text-lg leading-none flex-shrink-0">+</button>
    </div>
  )
}
