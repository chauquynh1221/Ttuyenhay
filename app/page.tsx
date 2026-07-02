import HeroCarousel from '@/components/HeroCarousel'
import GenreRail from '@/components/GenreRail'
import ContinueReading from '@/components/ContinueReading'
import BookShelf from '@/components/BookShelf'
import RankingBand from '@/components/RankingBand'
import FeaturedBento from '@/components/FeaturedBento'
import Reveal from '@/components/Reveal'
import { BookOpen, CheckCircle } from '@/components/icons'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import Genre from '@/models/Genre'

export const revalidate = 600

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 60) return `${Math.max(1, minutes)} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  if (days < 30) return `${days} ngày trước`
  return `${Math.floor(days / 30)} tháng trước`
}

function mapCard(t: any) {
  return {
    id: t._id.toString(),
    title: t.title,
    slug: t.slug,
    author: t.author,
    isHot: t.isHot,
    isFull: t.isFull,
    isNew: t.isNew,
    rating: t.rating,
    coverImage: t.coverImage,
    latestChapter: { number: t.totalChapters, title: `Chương ${t.totalChapters}` },
    updatedAt: formatTimeAgo(t.updatedAt),
  }
}

export default async function Home() {
  await dbConnect()

  const weekAgo = new Date(Date.now() - 7 * 86400000)

  const [truyenHotRaw, truyenMoiRaw, truyenFullRaw, topRaw, genresRaw] = await Promise.all([
    Truyen.find({ isHot: true }).sort({ views: -1 }).limit(14).lean(),
    Truyen.find({}).sort({ updatedAt: -1 }).limit(14).lean(),
    Truyen.find({ isFull: true }).sort({ updatedAt: -1 }).limit(14).lean(),
    Truyen.find({}).sort({ views: -1 }).limit(9).lean(),
    Genre.find({}).sort({ name: 1 }).select('name slug').limit(16).lean(),
  ])

  const heroItems = (truyenHotRaw as any[]).slice(0, 5).map((t) => ({
    slug: t.slug, title: t.title, author: t.author,
    description: (t.description || '').slice(0, 180),
    coverImage: t.coverImage, rating: t.rating, genres: t.genres,
  }))
  const genres = (genresRaw as any[]).map((g) => ({ name: g.name, slug: g.slug }))
  const ranking = (topRaw as any[]).map((t) => ({
    id: t._id.toString(), title: t.title, slug: t.slug, coverImage: t.coverImage, rating: t.rating, views: t.views,
  }))
  const bento = (truyenHotRaw as any[]).slice(0, 5).map((t) => ({
    id: t._id.toString(), title: t.title, slug: t.slug, author: t.author,
    coverImage: t.coverImage, rating: t.rating, description: (t.description || '').slice(0, 120),
  }))

  const truyenMoi = truyenMoiRaw.map(mapCard)
  const truyenFull = truyenFullRaw.map(mapCard)

  return (
    <div className="container py-5 sm:py-7 max-w-[1180px]">
      <HeroCarousel items={heroItems} />
      <GenreRail genres={genres} />

      <ContinueReading />

      <Reveal><FeaturedBento items={bento} /></Reveal>

      <Reveal><BookShelf icon={BookOpen} title="Mới cập nhật" href="/danh-sach/truyen-moi" items={truyenMoi} accent="accent" /></Reveal>

      <Reveal><RankingBand items={ranking} /></Reveal>

      <Reveal><BookShelf icon={CheckCircle} title="Đã hoàn thành" href="/danh-sach/truyen-full" items={truyenFull} /></Reveal>
    </div>
  )
}
