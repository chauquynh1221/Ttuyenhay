import { v2 as cloudinary } from 'cloudinary'

let configured = false
function ensureConfig() {
  if (configured) return
  // Ưu tiên 3 biến riêng; nếu chỉ có CLOUDINARY_URL thì SDK tự đọc từ env (không override bằng undefined)
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }
  configured = true
}

// Sẵn sàng nếu có CLOUDINARY_URL HOẶC đủ 3 biến riêng
export function isCloudinaryReady(): boolean {
  return !!(
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
  )
}

// Upload từ data URI (base64) → trả về URL an toàn (CDN).
export async function uploadImage(dataUri: string, folder = 'bongmeow'): Promise<string> {
  ensureConfig()
  const res = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  })
  return res.secure_url
}
