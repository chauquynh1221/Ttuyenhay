'use client'

import { useRef, useState } from 'react'
import { useToast } from '@/components/Toast'

// Ô nhập ảnh: dán URL HOẶC upload file lên Cloudinary. Dùng cho bìa truyện (type='cover').
export default function ImageUploadField({
  value, onChange, type = 'cover', label = 'Ảnh bìa',
}: {
  value: string
  onChange: (url: string) => void
  type?: 'cover' | 'avatar'
  label?: string
}) {
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', type)
      const r = await fetch('/api/upload', { method: 'POST', body: fd })
      const d = await r.json()
      if (r.ok) { onChange(d.url); toast('Đã tải ảnh lên') }
      else toast(d.error || 'Upload thất bại', 'error')
    } finally { setUploading(false) }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-foreground/90 mb-1.5">{label}</label>
      <div className="flex items-start gap-3">
        <div className="w-16 h-[86px] rounded bg-surface-2 border border-border overflow-hidden flex-shrink-0 grid place-items-center">
          {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] text-muted-2">Chưa có</span>}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <input value={value} onChange={e => onChange(e.target.value)} placeholder="https://... hoặc bấm Tải ảnh" className="form-control" />
          <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn btn-default btn-sm">
            {uploading ? 'Đang tải...' : '⬆ Tải ảnh lên'}
          </button>
        </div>
      </div>
    </div>
  )
}
