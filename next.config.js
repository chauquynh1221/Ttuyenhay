/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Bật lại type-check khi build để bắt lỗi thật (trước đây bị tắt)
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.8cache.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Security headers — chống clickjacking, MIME-sniffing, rò rỉ referrer
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
