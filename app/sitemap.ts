import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import Genre from '@/models/Genre'

// Giới hạn URL chương để không vượt trần 50k URL/sitemap.
// (Dữ liệu rất lớn nên dùng generateSitemaps() để tách file — ghi chú mở rộng.)
const MAX_CHAPTER_URLS = 40000

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    await dbConnect()
    const [truyenList, genreList] = await Promise.all([
        Truyen.find({}).select('slug totalChapters updatedAt').sort({ updatedAt: -1 }).lean() as any,
        Genre.find({}).select('slug').lean() as any,
    ])

    const now = new Date()
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/danh-sach/truyen-hot`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/danh-sach/truyen-full`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/danh-sach/truyen-moi`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
        { url: `${baseUrl}/bang-xep-hang`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/tim-kiem`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    ]

    const genrePages: MetadataRoute.Sitemap = genreList.map((g: any) => ({
        url: `${baseUrl}/the-loai/${g.slug}`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.7,
    }))

    const truyenPages: MetadataRoute.Sitemap = truyenList.map((t: any) => ({
        url: `${baseUrl}/truyen/${t.slug}`,
        lastModified: t.updatedAt || now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // URL chương suy ra từ totalChapters (không cần query từng chương)
    const chapterPages: MetadataRoute.Sitemap = []
    for (const t of truyenList) {
        const total = Math.max(0, t.totalChapters || 0)
        for (let n = 1; n <= total; n++) {
            if (chapterPages.length >= MAX_CHAPTER_URLS) break
            chapterPages.push({
                url: `${baseUrl}/truyen/${t.slug}/${n}`,
                lastModified: t.updatedAt || now,
                changeFrequency: 'monthly' as const,
                priority: 0.5,
            })
        }
        if (chapterPages.length >= MAX_CHAPTER_URLS) break
    }

    return [...staticPages, ...genrePages, ...truyenPages, ...chapterPages]
}
