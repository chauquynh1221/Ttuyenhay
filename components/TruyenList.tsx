import Link from 'next/link'

interface TruyenListItem {
  id: string
  title: string
  slug: string
  author?: string
  genres?: string[]
  isHot?: boolean
  isFull?: boolean
  isNew?: boolean
  totalChapters?: number
  latestChapter?: { number: number; title: string }
  updatedAt?: string
}

export default function TruyenList({ items }: { items: TruyenListItem[] }) {
  return (
    <div className="bg-white border border-[#E5E0D8] rounded-lg overflow-hidden shadow-sm">
      {items.map((truyen) => (
        <div
          key={truyen.id}
          className="hover:bg-[#F8F7F5] transition-colors border-b border-[#EEE9E0] last:border-b-0 px-3 py-2.5 md:px-3.5"
        >
          {/* Mobile layout */}
          <div className="md:hidden">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <Link href={`/truyen/${truyen.slug}`} className="flex-1 min-w-0 text-[14px] font-semibold text-[#1C1C1C] hover:text-[#C0392B] leading-snug transition-colors">
                {truyen.title}
              </Link>
              <div className="flex gap-1 flex-shrink-0">
                {truyen.isHot && <span className="label label-hot">HOT</span>}
                {truyen.isFull && <span className="label label-full">FULL</span>}
                {truyen.isNew && <span className="label label-new">MỚI</span>}
              </div>
            </div>
            {truyen.author && (
              <div className="text-[12px] text-[#888] mb-1">✍ {truyen.author}</div>
            )}
            {truyen.genres && truyen.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {truyen.genres.slice(0, 2).map((genre) => (
                  <Link key={genre} href={`/the-loai/${genre.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-[11px] text-[#888] hover:text-[#C0392B] transition-colors"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between text-[12px] text-[#AAA] pt-1.5 border-t border-[#EEE9E0]">
              {truyen.latestChapter && (
                <Link href={`/truyen/${truyen.slug}/${truyen.latestChapter.number}`}
                  className="text-[#C0392B] hover:text-[#96281B] hover:underline font-medium"
                >
                  Chương {truyen.latestChapter.number}
                  {truyen.totalChapters && <span className="text-[#CCC] font-normal"> / {truyen.totalChapters}</span>}
                </Link>
              )}
              <span suppressHydrationWarning>{truyen.updatedAt || '—'}</span>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex md:items-center md:gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Link href={`/truyen/${truyen.slug}`}
                  className="text-[14px] font-semibold text-[#1C1C1C] hover:text-[#C0392B] transition-colors truncate"
                >
                  {truyen.title}
                </Link>
                {truyen.isHot && <span className="label label-hot flex-shrink-0">HOT</span>}
                {truyen.isFull && <span className="label label-full flex-shrink-0">FULL</span>}
                {truyen.isNew && <span className="label label-new flex-shrink-0">MỚI</span>}
              </div>
              <div className="flex items-center gap-3 text-[12px] text-[#888]">
                {truyen.author && <span>✍ {truyen.author}</span>}
                {truyen.genres && truyen.genres.length > 0 && (
                  <span>
                    {truyen.genres.slice(0, 3).map((genre, i) => (
                      <span key={genre}>
                        {i > 0 && <span className="mx-0.5 text-[#CCC]">,</span>}
                        <Link href={`/the-loai/${genre.toLowerCase().replace(/\s+/g, '-')}`}
                          className="hover:text-[#C0392B] transition-colors"
                        >
                          {genre}
                        </Link>
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </div>

            <div className="w-44 lg:w-52 text-sm flex-shrink-0">
              {truyen.latestChapter ? (
                <Link href={`/truyen/${truyen.slug}/${truyen.latestChapter.number}`}
                  className="text-[#C0392B] hover:text-[#96281B] hover:underline text-[13px] font-medium"
                >
                  Chương {truyen.latestChapter.number}
                </Link>
              ) : <span className="text-[#CCC]">—</span>}
            </div>

            <div className="hidden lg:block w-20 text-center text-[13px] text-[#888] flex-shrink-0">
              {truyen.totalChapters ? `${truyen.totalChapters} ch.` : '—'}
            </div>

            <div className="w-28 text-right text-[12px] text-[#AAA] flex-shrink-0" suppressHydrationWarning>
              {truyen.updatedAt || '—'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
