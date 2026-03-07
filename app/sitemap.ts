import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    await dbConnect()
    const truyenList = await Truyen.find({}).select('slug updatedAt').lean() as any[]

    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/danh-sach/truyen-hot`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/danh-sach/truyen-full`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/danh-sach/moi-cap-nhat`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
        { url: `${baseUrl}/bang-xep-hang`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/tim-kiem`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    ]

    const truyenPages: MetadataRoute.Sitemap = truyenList.map((t: any) => ({
        url: `${baseUrl}/truyen/${t.slug}`,
        lastModified: t.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [...staticPages, ...truyenPages]
}
