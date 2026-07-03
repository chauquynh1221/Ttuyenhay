import { v2 as cloudinary } from 'cloudinary'

let configured = false
function ensureConfig() {
  if (configured) return
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  configured = true
}

export function isCloudinaryReady(): boolean {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
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
