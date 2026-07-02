import Link from 'next/link'
import { Compass } from './icons'

// Khối "Khám phá thể loại" — chip kính tối, hover hổ phách.
export default function GenreRail({ genres }: { genres: { name: string; slug: string }[] }) {
  if (!genres || genres.length === 0) return null
  return (
    <section className="mb-10 sm:mb-12">
      <h2 className="flex items-center gap-2.5 font-display text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mb-4">
        <Compass className="w-6 h-6 text-primary" />
        Khám phá thể loại
      </h2>
      <div className="flex flex-wrap gap-2 sm:gap-2.5">
        {genres.map((g) => (
          <Link key={g.slug} href={`/the-loai/${g.slug}`}
            className="px-4 h-9 sm:h-10 inline-flex items-center rounded-full
                       bg-surface-2 border border-border text-foreground/80 text-sm font-medium whitespace-nowrap
                       hover:border-primary/60 hover:text-primary hover:bg-primary-soft transition-colors">
            {g.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
