'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ReadingSettings from '@/components/ReadingSettings'
import CommentSection from '@/components/CommentSection'
import ReadingProgress from '@/components/ReadingProgress'
import ReadingPosition from '@/components/ReadingPosition'
import ReportButton from '@/components/ReportButton'
import ImmersiveReading from '@/components/ImmersiveReading'
import AutoScroll from '@/components/AutoScroll'
import ChapterComplete from '@/components/ChapterComplete'
import { Clock } from '@/components/icons'
import { useReadingSettings, READING_THEMES } from '@/lib/useReadingSettings'

interface ChapterData {
  id: string
  truyenId: string
  chapterNumber: number
  title: string
  content: string
  truyenTitle: string
  truyenSlug: string
  prevChapter?: number
  nextChapter?: number
  totalChapters: number
}

// ============================================================
// processContent: chuẩn hóa nội dung chương về format đồng nhất
// (giữ nguyên logic xử lý đã có — hỗ trợ plain text & HTML)
// ============================================================
function processContent(raw: string): string[] {
  let text = raw

  if (/<[a-z][\s\S]*>/i.test(text)) {
    text = text
      .replace(/<\/p\s*>/gi, '\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/?(div|li|h[1-6]|blockquote)[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, '')
  }

  text = text
    .replace(/&nbsp;/g, ' ').replace(/ /g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'")

  text = text
    .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    .replace(/\n[ \t]+\n/g, '\n\n').replace(/\n{3,}/g, '\n\n')

  const rawBlocks = text.split('\n\n').map(b => b.trim()).filter(b => b.length > 0)
  const result: string[] = []

  for (const block of rawBlocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    if (lines.length <= 1) {
      const single = lines[0]
      if (single && !/^(edit|biên tập|nguồn|source|convert|st\.|sưu tầm|chú thích)\s*:/i.test(single)) result.push(single)
      continue
    }
    let buffer: string[] = []
    const flush = () => { if (buffer.length > 0) { result.push(buffer.join(' ')); buffer = [] } }
    for (const line of lines) {
      const isDialogue = /^[-–—""''「」『』]/.test(line)
      const isNote = /^(edit|biên tập|nguồn|source|convert|st\.|sưu tầm|chú thích):/i.test(line)
      const isVeryShort = line.length < 40 && !line.endsWith(',') && !line.endsWith('...')
      if (isNote) continue
      else if (isDialogue) { flush(); result.push(line) }
      else if (isVeryShort) { flush(); result.push(line) }
      else buffer.push(line)
    }
    flush()
  }
  return result.filter(p => p.trim().length > 1)
}

export default function ChapterContent({ chapter }: { chapter: ChapterData }) {
  const paragraphs = processContent(chapter.content)
  const words = paragraphs.join(' ').trim().split(/\s+/).filter(Boolean).length
  const readMinutes = Math.max(1, Math.round(words / 200))
  const { settings, update, reset } = useReadingSettings()
  const router = useRouter()

  const theme = READING_THEMES[settings.theme]
  const isSystem = settings.theme === 'system'

  const [pickerOpen, setPickerOpen] = useState(false)

  // Navigation
  const goToPrev = useCallback(() => {
    if (chapter.prevChapter) router.push(`/truyen/${chapter.truyenSlug}/${chapter.prevChapter}`)
  }, [chapter.prevChapter, chapter.truyenSlug, router])
  const goToNext = useCallback(() => {
    if (chapter.nextChapter) router.push(`/truyen/${chapter.truyenSlug}/${chapter.nextChapter}`)
  }, [chapter.nextChapter, chapter.truyenSlug, router])

  // Auto-save reading history (best effort)
  useEffect(() => {
    if (!chapter.truyenId) return
    fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ truyenId: chapter.truyenId, chapterId: chapter.id }),
    }).catch(() => { })
  }, [chapter.id, chapter.truyenId])

  // Keyboard ← →
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goToPrev, goToNext])

  // Swipe (mobile): vuốt trái → chương sau, vuốt phải → chương trước
  const touch = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touch.current.x
    const dy = t.clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 2) {
      if (dx < 0) goToNext()
      else goToPrev()
    }
  }

  const rootStyle = isSystem ? {} : { backgroundColor: theme.bg!, color: theme.fg! }
  const widthCls = settings.wide ? 'max-w-5xl' : 'max-w-reading'

  return (
    <div className={`min-h-screen pb-20 md:pb-0 ${isSystem ? 'bg-bg text-foreground' : ''}`} style={rootStyle}>
      <ReadingProgress />
      <ReadingPosition chapterKey={chapter.id} />
      <ImmersiveReading />

      <div className={`mx-auto px-3 sm:px-5 py-4 sm:py-6 ${widthCls}`}>

        {/* === HEADER === */}
        <div className="mb-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <Link href={`/truyen/${chapter.truyenSlug}`} className="text-[13px] font-medium opacity-70 hover:opacity-100 hover:text-primary transition line-clamp-1">
              ← {chapter.truyenTitle}
            </Link>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <AutoScroll />
              <ReportButton truyenSlug={chapter.truyenSlug} chapterId={chapter.id} chapterNumber={chapter.chapterNumber} />
              <ReadingSettings settings={settings} update={update} reset={reset} />
            </div>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold leading-tight text-center">{chapter.title}</h1>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-xs opacity-60">
            <Clock className="w-3.5 h-3.5" /> ~{readMinutes} phút đọc · {words.toLocaleString('vi-VN')} từ
          </div>

          {/* Desktop top nav */}
          <div className="hidden md:flex items-center justify-center gap-2 mt-4">
            <NavBtn disabled={!chapter.prevChapter} href={chapter.prevChapter ? `/truyen/${chapter.truyenSlug}/${chapter.prevChapter}` : undefined}>← Chương trước</NavBtn>
            <button onClick={() => setPickerOpen(true)} className="btn btn-default btn-sm">📑 Chương {chapter.chapterNumber}/{chapter.totalChapters}</button>
            <NavBtn disabled={!chapter.nextChapter} href={chapter.nextChapter ? `/truyen/${chapter.truyenSlug}/${chapter.nextChapter}` : undefined}>Chương sau →</NavBtn>
          </div>
        </div>

        {/* === CONTENT === */}
        <article
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onContextMenu={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          className="chapter-content font-reading no-copy dropcap paper-texture"
          style={{ fontSize: `${settings.fontSize}px`, fontFamily: settings.fontFamily, lineHeight: settings.lineHeight }}
        >
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <div className="whitespace-pre-line">{chapter.content}</div>
          )}
        </article>

        <p className="text-center text-xs opacity-40 mt-5 select-none">
          Nguồn: <b>Bongmeow</b> · Vui lòng không sao chép, đăng lại nội dung.
        </p>

        <ChapterComplete
          slug={chapter.truyenSlug}
          chapterNumber={chapter.chapterNumber}
          totalChapters={chapter.totalChapters}
          nextChapter={chapter.nextChapter}
        />

        {/* === BOTTOM NAV (desktop) === */}
        <div className="hidden md:flex items-center justify-center gap-2 mt-8 pt-6 border-t border-current/10">
          <NavBtn disabled={!chapter.prevChapter} href={chapter.prevChapter ? `/truyen/${chapter.truyenSlug}/${chapter.prevChapter}` : undefined}>← Chương trước</NavBtn>
          <Link href={`/truyen/${chapter.truyenSlug}`} className="btn btn-default btn-sm">📚 Danh sách</Link>
          <NavBtn disabled={!chapter.nextChapter} href={chapter.nextChapter ? `/truyen/${chapter.truyenSlug}/${chapter.nextChapter}` : undefined}>Chương sau →</NavBtn>
        </div>

        {/* === COMMENTS === */}
        <div className="mt-8">
          <CommentSection truyenId={chapter.truyenId} chapterId={chapter.id} />
        </div>
      </div>

      {/* === FLOATING BOTTOM BAR (mobile) === */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border flex items-center justify-around h-16 px-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <BarBtn disabled={!chapter.prevChapter} onClick={goToPrev} label="Trước"
          icon="M15 19l-7-7 7-7" />
        <BarBtn onClick={() => setPickerOpen(true)} label="Chương" icon="M4 6h16M4 12h16M4 18h16" />
        <Link href={`/truyen/${chapter.truyenSlug}`} className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-muted">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>
          <span className="text-[10px] font-medium">Mục lục</span>
        </Link>
        <BarBtn disabled={!chapter.nextChapter} onClick={goToNext} label="Sau" icon="M9 5l7 7-7 7" />
      </div>

      {/* === CHAPTER PICKER MODAL === */}
      {pickerOpen && (
        <ChapterPicker
          slug={chapter.truyenSlug}
          current={chapter.chapterNumber}
          total={chapter.totalChapters}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}

function NavBtn({ href, disabled, children }: { href?: string; disabled?: boolean; children: React.ReactNode }) {
  if (disabled || !href) return <span className="btn btn-default btn-sm opacity-40 cursor-not-allowed">{children}</span>
  return <Link href={href} className="btn btn-default btn-sm">{children}</Link>
}

function BarBtn({ onClick, disabled, label, icon }: { onClick: () => void; disabled?: boolean; label: string; icon: string }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 ${disabled ? 'opacity-30' : 'text-muted active:text-primary'}`}>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}

// Bộ chọn chương — KHÔNG render toàn bộ N chương. Nhập số + nhảy nhanh.
function ChapterPicker({ slug, current, total, onClose }: { slug: string; current: number; total: number; onClose: () => void }) {
  const router = useRouter()
  const [val, setVal] = useState(String(current))

  const go = (n: number) => {
    const num = Math.min(total, Math.max(1, Math.floor(n) || 1))
    router.push(`/truyen/${slug}/${num}`)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/50" onClick={onClose} />
      <div className="fixed z-[90] left-1/2 -translate-x-1/2 top-24 w-[90vw] max-w-sm bg-surface border border-border rounded-xl shadow-pop p-5 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">Chuyển chương</h3>
          <button onClick={onClose} className="grid place-items-center w-8 h-8 text-muted hover:text-foreground rounded" aria-label="Đóng">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <p className="text-xs text-muted mb-2">Chương hiện tại: <b className="text-foreground">{current}</b> / {total}</p>
        <form onSubmit={(e) => { e.preventDefault(); go(parseInt(val)) }} className="flex gap-2 mb-3">
          <input
            type="number" min={1} max={total} value={val}
            onChange={(e) => setVal(e.target.value)}
            className="form-control flex-1" placeholder="Nhập số chương" inputMode="numeric"
          />
          <button type="submit" className="btn btn-primary">Đi</button>
        </form>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => go(1)} className="btn btn-default btn-sm">⏮ Chương đầu</button>
          <button onClick={() => go(total)} className="btn btn-default btn-sm">Chương cuối ⏭</button>
        </div>
        <Link href={`/truyen/${slug}`} onClick={onClose} className="block text-center text-[13px] text-primary hover:underline mt-3">
          Xem danh sách đầy đủ →
        </Link>
      </div>
    </>
  )
}
