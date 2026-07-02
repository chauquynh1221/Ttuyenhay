'use client'

import { useCallback, useEffect, useState } from 'react'

export type ReadingThemeKey = 'system' | 'paper' | 'sepia' | 'mint' | 'dark' | 'black'

export interface ReadingSettings {
  fontSize: number      // px
  lineHeight: number    // unitless
  fontFamily: string
  theme: ReadingThemeKey
  wide: boolean         // mở rộng chiều ngang vùng đọc
}

export const DEFAULT_READING_SETTINGS: ReadingSettings = {
  fontSize: 19,
  lineHeight: 1.85,
  fontFamily: 'Palatino Linotype',
  theme: 'system',
  wide: false,
}

export const READING_FONTS = [
  { value: 'Palatino Linotype', label: 'Palatino' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times' },
  { value: 'var(--font-inter)', label: 'Sans' },
] as const

/** Bảng màu vùng đọc. 'system' = null → dùng token theo theme site (sáng/tối). */
export const READING_THEMES: Record<
  ReadingThemeKey,
  { label: string; bg: string | null; fg: string | null; swatch: string }
> = {
  system: { label: 'Theo nền', bg: null, fg: null, swatch: 'linear-gradient(135deg,#fff 50%,#1a1a1a 50%)' },
  paper: { label: 'Trắng', bg: '#ffffff', fg: '#26221f', swatch: '#ffffff' },
  sepia: { label: 'Kem', bg: '#f5ecd9', fg: '#4a3f2e', swatch: '#f5ecd9' },
  mint: { label: 'Xanh', bg: '#e8f1e7', fg: '#22302a', swatch: '#e8f1e7' },
  dark: { label: 'Tối', bg: '#1b1d22', fg: '#cfcdc8', swatch: '#1b1d22' },
  black: { label: 'OLED', bg: '#000000', fg: '#c2c6ce', swatch: '#000000' },
}

const STORAGE_KEY = 'tf_reading_settings'

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function sanitize(raw: unknown): ReadingSettings {
  const s = (raw && typeof raw === 'object' ? raw : {}) as Partial<ReadingSettings>
  return {
    fontSize: clamp(Number(s.fontSize) || DEFAULT_READING_SETTINGS.fontSize, 14, 34),
    lineHeight: clamp(Number(s.lineHeight) || DEFAULT_READING_SETTINGS.lineHeight, 1.4, 2.6),
    fontFamily: typeof s.fontFamily === 'string' ? s.fontFamily : DEFAULT_READING_SETTINGS.fontFamily,
    theme: (s.theme && s.theme in READING_THEMES ? s.theme : DEFAULT_READING_SETTINGS.theme) as ReadingThemeKey,
    wide: Boolean(s.wide),
  }
}

/**
 * Hook quản lý cài đặt đọc, lưu localStorage và đồng bộ giữa các tab.
 * `ready` = true sau khi đã đọc xong giá trị lưu (để tránh nháy).
 */
export function useReadingSettings() {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_READING_SETTINGS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setSettings(sanitize(JSON.parse(stored)))
    } catch { }
    setReady(true)

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { setSettings(sanitize(JSON.parse(e.newValue))) } catch { }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const update = useCallback(<K extends keyof ReadingSettings>(key: K, value: ReadingSettings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { }
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setSettings(DEFAULT_READING_SETTINGS)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_READING_SETTINGS)) } catch { }
  }, [])

  return { settings, update, reset, ready }
}
