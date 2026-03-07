import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/dang-nhap', '/dang-ky', '/tu-sach'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
