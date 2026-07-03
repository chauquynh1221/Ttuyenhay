import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bongmeow - Đọc truyện online',
    short_name: 'Bongmeow',
    description: 'Đọc truyện online miễn phí: truyện hot, tiên hiệp, ngôn tình, kiếm hiệp.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0D12',
    theme_color: '#0B0D12',
    lang: 'vi',
    icons: [
      { src: '/bongmeow-cat.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/bongmeow-cat.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/bongmeow-cat.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
