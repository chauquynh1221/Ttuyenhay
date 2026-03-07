'use client'

import { useState } from 'react'

interface ReadingSettingsProps {
  onSettingsChange: (settings: ReadingSettings) => void
}

export interface ReadingSettings {
  fontSize: number
  fontFamily: string
  backgroundColor: string
  lineHeight: number
  fullWidth: boolean
}

const fontFamilies = [
  { value: 'Palatino Linotype', label: 'Palatino' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times' },
  { value: 'Verdana', label: 'Verdana' },
]

const backgroundColors = [
  { value: '#ffffff', label: 'Trắng', textColor: '#292522', preview: '#fff' },
  { value: '#F5F0E8', label: 'Kem', textColor: '#2D2520', preview: '#F5F0E8' },
  { value: '#F0F4E8', label: 'Xanh lá', textColor: '#252D20', preview: '#F0F4E8' },
  { value: '#2A2520', label: 'Tối', textColor: '#D4C9B8', preview: '#2A2520' },
]

export default function ReadingSettings({ onSettingsChange }: ReadingSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: 20,
    fontFamily: 'Palatino Linotype',
    backgroundColor: '#ffffff',
    lineHeight: 1.8,
    fullWidth: false,
  })

  const update = <K extends keyof ReadingSettings>(key: K, value: ReadingSettings[K]) => {
    const next = { ...settings, [key]: value }
    setSettings(next)
    onSettingsChange(next)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-[#555] hover:text-[#1C1C1C] hover:bg-[#F3F1EE] border border-[#E5E0D8] bg-white transition-colors"
        aria-label="Tùy chỉnh đọc"
        title="Tùy chỉnh"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Panel */}
          <div className="absolute top-full mt-2 right-0 bg-white border border-[#E5E0D8] rounded-lg shadow-lg p-5 z-50 w-80 max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1C1C1C] uppercase tracking-wider">Tùy chỉnh đọc truyện</h3>
              <button onClick={() => setIsOpen(false)} className="text-[#AAA] hover:text-[#555] transition-colors" aria-label="Đóng">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Font Size */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#444]">Cỡ chữ</label>
                <span className="text-[13px] font-bold text-[#C0392B]">{settings.fontSize}px</span>
              </div>
              <input
                type="range" min="16" max="32" step="2"
                value={settings.fontSize}
                onChange={(e) => update('fontSize', parseInt(e.target.value))}
                className="w-full cursor-pointer accent-[#C0392B]"
              />
              <div className="flex justify-between text-[11px] text-[#AAA] mt-0.5">
                <span>Nhỏ</span><span>Lớn</span>
              </div>
            </div>

            {/* Font Family */}
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[#444] mb-2">Font chữ</label>
              <div className="grid grid-cols-2 gap-1.5">
                {fontFamilies.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => update('fontFamily', font.value)}
                    className={`py-2 px-3 text-[13px] rounded border-2 transition-all ${settings.fontFamily === font.value
                        ? 'border-[#C0392B] bg-[#FEF2F2] text-[#C0392B] font-bold'
                        : 'border-[#E5E0D8] bg-white text-[#444] hover:border-[#C0392B]'
                      }`}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[#444] mb-2">Màu nền</label>
              <div className="flex gap-2">
                {backgroundColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => update('backgroundColor', color.value)}
                    title={color.label}
                    className={`flex-1 h-10 rounded border-2 transition-all ${settings.backgroundColor === color.value
                        ? 'border-[#C0392B] scale-105 shadow-md'
                        : 'border-[#D8D3CB] hover:border-[#C0392B]'
                      }`}
                    style={{ backgroundColor: color.preview }}
                    aria-label={color.label}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-1">
                {backgroundColors.map((c) => (
                  <div key={c.value} className="flex-1 text-center text-[10px] text-[#AAA]">{c.label}</div>
                ))}
              </div>
            </div>

            {/* Line Height */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#444]">Giãn dòng</label>
                <span className="text-[13px] font-bold text-[#C0392B]">{Math.round(settings.lineHeight * 100)}%</span>
              </div>
              <input
                type="range" min="1.4" max="2.5" step="0.1"
                value={settings.lineHeight}
                onChange={(e) => update('lineHeight', parseFloat(e.target.value))}
                className="w-full cursor-pointer accent-[#C0392B]"
              />
              <div className="flex justify-between text-[11px] text-[#AAA] mt-0.5">
                <span>Hẹp</span><span>Rộng</span>
              </div>
            </div>

            {/* Full Width */}
            <div className="flex items-center gap-3 p-3 bg-[#F8F7F5] border border-[#E5E0D8] rounded-md">
              <input
                type="checkbox" id="fullWidth"
                checked={settings.fullWidth}
                onChange={(e) => update('fullWidth', e.target.checked)}
                className="w-4 h-4 accent-[#C0392B] cursor-pointer"
              />
              <label htmlFor="fullWidth" className="text-[13px] font-medium text-[#444] cursor-pointer">
                Toàn màn hình
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
