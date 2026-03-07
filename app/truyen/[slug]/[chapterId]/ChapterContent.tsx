'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ReadingSettings, { type ReadingSettings as Settings } from '@/components/ReadingSettings'
import CommentSection from '@/components/CommentSection'
import ReadingProgress from '@/components/ReadingProgress'
import ReportButton from '@/components/ReportButton'

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

interface ChapterContentProps {
  chapter: ChapterData
}

// ============================================================
// processContent: Pipeline chuẩn hóa nội dung chương
// Đảm bảo format CỐ ĐỊNH cho MỌI truyện, bất kể data format:
//   - Plain text \n\n (truyện thông thường)
//   - Plain text \n&nbsp;\n (Tiên Nghịch style)
//   - Plain text \n đơn mỗi dòng (Cô Vợ Ngọt Ngào style)
//   - HTML với <p>, <br>, <span style="color:..."> tags
// ============================================================
function processContent(raw: string): string[] {
  let text = raw

  // BƯỚC 1: Strip HTML tags (nếu có), chuyển thành plain text
  if (/<[a-z][\s\S]*>/i.test(text)) {
    text = text
      .replace(/<\/p\s*>/gi, '\n\n')   // </p> → double newline (kết đoạn)
      .replace(/<br\s*\/?>/gi, '\n')   // <br> → single newline
      .replace(/<p[^>]*>/gi, '')       // <p ...> → xóa
      .replace(/<\/?(div|li|h[1-6]|blockquote)[^>]*>/gi, '\n') // block elements → newline
      .replace(/<[^>]+>/g, '')         // xóa tất cả tags còn lại
  }

  // BƯỚC 2: Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')    // non-breaking space → space thường
    .replace(/\u00a0/g, ' ')    // Unicode NBSP → space
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")

  // BƯỚC 3: Chuẩn hóa line breaks
  text = text
    .replace(/\r\n/g, '\n')           // Windows CRLF → LF
    .replace(/\r/g, '\n')             // Old Mac CR → LF
    .replace(/\n[ \t]+\n/g, '\n\n')   // \n + spaces + \n → \n\n (Tiên Nghịch)
    .replace(/\n{3,}/g, '\n\n')       // 3+ newlines → \n\n

  // BƯỚC 4: Tách thành blocks theo \n\n
  const rawBlocks = text
    .split('\n\n')
    .map(b => b.trim())
    .filter(b => b.length > 0)

  // BƯỚC 5: Merge dòng đơn trong mỗi block thành đoạn văn liền mạch
  // Vấn đề: "Cô Vợ Ngọt Ngào" lưu mỗi câu/thoại trên 1 dòng (\n đơn)
  // khi split('\n\n') ra sẽ có 1 block lớn chứa nhiều \n đơn bên trong.
  // Ta cần xử lý thêm: câu thoại giữ riêng, câu tự sự gom lại.
  const result: string[] = []

  for (const block of rawBlocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0)

    if (lines.length <= 1) {
      // Block chỉ có 1 dòng: kiểm tra watermark trước khi thêm
      const single = lines[0]
      if (single) {
        // Lọc bỏ dòng watermark/credit ngay cả khi là block đơn
        const isWatermark = /^(edit|biên tập|nguồn|source|convert|st\.|sưu tầm|chú thích)\s*:/i.test(single)
        if (!isWatermark) result.push(single)
      }
      continue
    }

    // Block có nhiều dòng → phân loại từng dòng
    let buffer: string[] = []

    const flush = () => {
      if (buffer.length > 0) {
        result.push(buffer.join(' '))
        buffer = []
      }
    }

    for (const line of lines) {
      // Câu thoại: bắt đầu bằng dấu gạch ngang, ngoặc kép, hoặc ký tự đặc biệt
      const isDialogue = /^[-–—""''「」『』]/.test(line)
      // Dòng ghi chú ngắn (watermark, credit, section header)
      const isNote = /^(edit|biên tập|nguồn|source|convert|st\.|sưu tầm|chú thích):/i.test(line)
      // Dòng rất ngắn (< 40 ký tự) không phải đoạn văn
      const isVeryShort = line.length < 40 && !line.endsWith(',') && !line.endsWith('...')

      if (isNote) {
        // Bỏ watermark/credit
        continue
      } else if (isDialogue) {
        flush()
        result.push(line)
      } else if (isVeryShort) {
        // Dòng ngắn: có thể là câu cảm thán, câu đơn → giữ riêng
        flush()
        result.push(line)
      } else {
        // Dòng tự sự dài → gom vào buffer để thành đoạn văn
        buffer.push(line)
      }
    }
    flush()
  }

  // BƯỚC 6: Lọc cuối — loại bỏ entries rỗng hoặc quá ngắn
  return result.filter(p => p.trim().length > 1)
}

export default function ChapterContent({ chapter }: ChapterContentProps) {
  const paragraphs = processContent(chapter.content)

  const [settings, setSettings] = useState<Settings>({
    fontSize: 20,
    fontFamily: 'Palatino Linotype',
    backgroundColor: '#ffffff',
    lineHeight: 1.8,
    fullWidth: false,
  })
  const [isChapterListOpen, setIsChapterListOpen] = useState(false)
  const chapterListRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Auto-save reading history
  useEffect(() => {
    if (!chapter.truyenId) return
    fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ truyenId: chapter.truyenId, chapterId: chapter.id }),
    }).catch(() => { }) // Silent fail if not logged in
  }, [chapter.id, chapter.truyenId])

  // Keyboard shortcuts: ← prev, → next
  const goToPrev = useCallback(() => {
    if (chapter.prevChapter) router.push(`/truyen/${chapter.truyenSlug}/${chapter.prevChapter}`)
  }, [chapter.prevChapter, chapter.truyenSlug, router])

  const goToNext = useCallback(() => {
    if (chapter.nextChapter) router.push(`/truyen/${chapter.truyenSlug}/${chapter.nextChapter}`)
  }, [chapter.nextChapter, chapter.truyenSlug, router])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goToPrev, goToNext])

  return (
    <div className="min-h-screen" style={{ backgroundColor: settings.backgroundColor }}>
      {/* Reading progress bar + scroll-to-top */}
      <ReadingProgress />
      <div className={`mx-auto px-3 sm:px-4 py-4 sm:py-6 ${settings.fullWidth ? 'max-w-full px-2 sm:px-6' : 'max-w-5xl'}`}>
        {/* Chapter Header — sticky top */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 sticky top-0 z-30 border border-[#E5E0D8] relative max-w-4xl mx-auto">
          {/* Settings Button - Top Right */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <ReadingSettings onSettingsChange={setSettings} />
          </div>

          {/* Chapter Title */}
          <div className="text-center mb-4 pr-10">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-roboto mb-2">
              {chapter.title}
            </h1>
            <p className="text-[#888] text-sm">
              <Link href={`/truyen/${chapter.truyenSlug}`} className="hover:text-primary transition-colors">
                {chapter.truyenTitle}
              </Link>
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {chapter.prevChapter ? (
              <Link
                href={`/truyen/${chapter.truyenSlug}/${chapter.prevChapter}`}
                className="btn btn-default text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap"
              >
                ← Chương trước
              </Link>
            ) : (
              <button className="btn btn-default opacity-50 cursor-not-allowed text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap" disabled>
                ← Chương trước
              </button>
            )}

            <div className="relative" ref={chapterListRef}>
              <button
                onClick={() => setIsChapterListOpen(!isChapterListOpen)}
                className="btn btn-default text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap"
              >
                📚 Chương {chapter.chapterNumber}
              </button>

              {isChapterListOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsChapterListOpen(false)}
                  />
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white border border-[#E5E0D8] rounded-lg shadow-lg z-50 w-40 max-h-80 overflow-y-auto">
                    <div className="p-1.5">
                      {Array.from({ length: chapter.totalChapters }, (_, i) => (
                        <Link
                          key={i + 1}
                          href={`/truyen/${chapter.truyenSlug}/${i + 1}`}
                          className={`block px-3 py-1.5 text-sm rounded hover:bg-[#F3F1EE] ${chapter.chapterNumber === i + 1
                            ? 'bg-[#C0392B] text-white hover:bg-[#96281B]'
                            : ''
                            }`}
                          onClick={() => setIsChapterListOpen(false)}
                        >
                          Chương {i + 1}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {chapter.nextChapter ? (
              <Link
                href={`/truyen/${chapter.truyenSlug}/${chapter.nextChapter}`}
                className="btn btn-default text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap"
              >
                Chương sau →
              </Link>
            ) : (
              <button className="btn btn-default opacity-50 cursor-not-allowed text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap" disabled>
                Chương sau →
              </button>
            )}

            {/* Báo lỗi chương */}
            <ReportButton
              truyenSlug={chapter.truyenSlug}
              chapterId={chapter.id}
              chapterNumber={chapter.chapterNumber}
            />
          </div>
        </div>

        {/* Chapter Content — format đồng nhất cho MỌI truyện */}
        <div
          className="chapter-content mx-auto my-6 sm:my-8 px-6 sm:px-10 py-6 sm:py-8 rounded-xl shadow-sm max-w-4xl"
          style={{
            fontSize: `${settings.fontSize}px`,
            fontFamily: settings.fontFamily,
            lineHeight: settings.lineHeight,
            backgroundColor: settings.backgroundColor === '#2a2a2a' ? '#2a2a2a' : settings.backgroundColor,
            color: settings.backgroundColor === '#2A2520' ? '#D4C9B8' : '#292522',
          }}
        >
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="mb-4 sm:mb-5 text-justify"
                style={{ textIndent: '2em' }}
              >
                {paragraph}
              </p>
            ))
          ) : (
            // Fallback an toàn nếu processContent trả về rỗng
            <div className="whitespace-pre-line leading-relaxed">
              {chapter.content}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 max-w-4xl mx-auto border border-[#E5E0D8]">
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {chapter.prevChapter ? (
              <Link
                href={`/truyen/${chapter.truyenSlug}/${chapter.prevChapter}`}
                className="btn btn-default text-xs sm:text-sm px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap"
              >
                ← Chương trước
              </Link>
            ) : (
              <button className="btn btn-default opacity-50 cursor-not-allowed text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap" disabled>
                ← Chương trước
              </button>
            )}

            <Link
              href={`/truyen/${chapter.truyenSlug}`}
              className="btn btn-default text-xs sm:text-sm px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap"
            >
              📚 Danh sách chương
            </Link>

            {chapter.nextChapter ? (
              <Link
                href={`/truyen/${chapter.truyenSlug}/${chapter.nextChapter}`}
                className="btn btn-default text-xs sm:text-sm px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap"
              >
                Chương sau →
              </Link>
            ) : (
              <button className="btn btn-default opacity-50 cursor-not-allowed text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap" disabled>
                Chương sau →
              </button>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="max-w-4xl mx-auto mt-6">
          <CommentSection truyenId={chapter.truyenId} chapterId={chapter.id} />
        </div>
      </div>
    </div>
  )
}
