import Link from 'next/link'

// Chip thể loại tối giản, đồng tông pastel (bỏ gradient cầu vồng "màu mè").
export default function GenreRail({ genres }: { genres: { name: string; slug: string }[] }) {
  if (!genres || genres.length === 0) return null
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 mb-8">
      {genres.map((g) => (
        <Link key={g.slug} href={`/the-loai/${g.slug}`}
          className="flex-shrink-0 px-3.5 h-9 inline-flex items-center gap-1.5 rounded-full
                     bg-surface border border-border text-foreground/75 text-[13px] font-medium whitespace-nowrap
                     hover:border-primary hover:text-primary hover:bg-primary-soft transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          {g.name}
        </Link>
      ))}
    </div>
  )
}
