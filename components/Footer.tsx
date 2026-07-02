import Link from 'next/link'
import CatLogo from './CatLogo'
import dbConnect from '@/lib/mongodb'
import GenreModel from '@/models/Genre'

async function getGenres(): Promise<{ name: string; slug: string }[]> {
  try {
    await dbConnect()
    const genres = await GenreModel.find({}).sort({ name: 1 }).select('name slug').lean() as any[]
    return genres.map((g) => ({ name: g.name, slug: g.slug }))
  } catch {
    return []
  }
}

export default async function Footer() {
  const genres = await getGenres()

  return (
    <footer className="bg-surface border-t border-border mt-12">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Brand */}
          <div className="md:w-72 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <CatLogo className="w-9 h-9" />
              <span className="font-display font-extrabold text-lg text-foreground">Bong<span className="text-primary">meow</span></span>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              Nền tảng đọc truyện online miễn phí. Cập nhật liên tục, giao diện hiện đại, tối ưu cho điện thoại.
            </p>
          </div>

          {/* Links */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <FooterCol title="Khám phá">
              <FooterLink href="/danh-sach/truyen-hot">Truyện Hot</FooterLink>
              <FooterLink href="/danh-sach/truyen-full">Truyện Full</FooterLink>
              <FooterLink href="/danh-sach/truyen-moi">Mới cập nhật</FooterLink>
              <FooterLink href="/bang-xep-hang">Bảng xếp hạng</FooterLink>
            </FooterCol>
            <FooterCol title="Thể loại">
              {genres.slice(0, 8).map((g) => (
                <FooterLink key={g.slug} href={`/the-loai/${g.slug}`}>{g.name}</FooterLink>
              ))}
            </FooterCol>
            <FooterCol title="Hỗ trợ">
              <FooterLink href="/gop-y">Góp ý - Báo lỗi</FooterLink>
              <FooterLink href="/dieu-khoan">Điều khoản</FooterLink>
              <FooterLink href="/chinh-sach">Bảo mật</FooterLink>
              <FooterLink href="/dmca">DMCA</FooterLink>
            </FooterCol>
          </div>
        </div>

        {genres.length > 0 && (
          <div className="border-t border-border pt-6 mb-6">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-2 mb-3">Tất cả thể loại</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {genres.map((g) => (
                <Link key={g.slug} href={`/the-loai/${g.slug}`} className="text-xs text-muted hover:text-primary transition-colors">
                  {g.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-2">
          <p>© {new Date().getFullYear()} Bongmeow. Bản quyền nội dung thuộc về tác giả.</p>
          <div className="flex items-center gap-3">
            <Link href="/dieu-khoan" className="hover:text-foreground transition-colors">Điều khoản</Link>
            <span>·</span>
            <Link href="/chinh-sach" className="hover:text-foreground transition-colors">Bảo mật</Link>
            <span>·</span>
            <Link href="/dmca" className="hover:text-foreground transition-colors">DMCA</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-foreground text-sm font-bold uppercase tracking-wider mb-3">{title}</h4>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li><Link href={href} className="text-muted hover:text-primary transition-colors">{children}</Link></li>
  )
}
