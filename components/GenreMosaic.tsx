import Link from 'next/link'

// Khảm thể loại: mỗi thể loại một ô gradient màu riêng (hash theo tên) + chữ cái lớn mờ.
function hashHue(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360
  return h
}

export default function GenreMosaic({ genres }: { genres: { name: string; slug: string }[] }) {
  if (!genres || genres.length === 0) return null
  return (
    <section className="mb-10 sm:mb-14">
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-1.5">Khám phá</p>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">Thể loại</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {genres.slice(0, 16).map((g) => {
          const hue = hashHue(g.name)
          return (
            <Link key={g.slug} href={`/the-loai/${g.slug}`}
              className="group relative overflow-hidden rounded-lg h-[76px] sm:h-[84px] p-4 flex items-end ring-1 ring-white/10 transition-transform duration-200 hover:-translate-y-0.5"
              style={{ background: `linear-gradient(135deg, hsl(${hue} 42% 32%), hsl(${(hue + 40) % 360} 52% 15%))` }}>
              <span aria-hidden className="absolute -top-4 -right-1 font-display text-[64px] font-extrabold text-white/10 leading-none select-none">
                {g.name.charAt(0)}
              </span>
              <span className="relative text-white text-sm font-semibold group-hover:translate-x-1 transition-transform">
                {g.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
