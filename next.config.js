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
}

module.exports = nextConfig
