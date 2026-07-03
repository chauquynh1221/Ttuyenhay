import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET
const DEV_FALLBACK = 'dev-only-insecure-secret-do-not-use-in-production'

// Lấy khoá ký. Ở production BẮT BUỘC có JWT_SECRET — nếu thiếu thì ném lỗi
// (thay vì âm thầm dùng secret mặc định đã lộ trong source).
function getSecret(): Uint8Array {
    if (!JWT_SECRET) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('[auth] JWT_SECRET chưa được cấu hình ở production — hãy đặt biến môi trường JWT_SECRET.')
        }
        return new TextEncoder().encode(DEV_FALLBACK)
    }
    return new TextEncoder().encode(JWT_SECRET)
}

const COOKIE_NAME = 'tf_token'
const TOKEN_EXPIRY = '7d'

export interface JWTPayload {
    userId: string
    email: string
    name: string
    role: 'user' | 'admin'
}

// Tạo JWT token
export async function signToken(payload: JWTPayload): Promise<string> {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(TOKEN_EXPIRY)
        .sign(getSecret())
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret())
        return payload as unknown as JWTPayload
    } catch {
        return null
    }
}

// Lấy user hiện tại từ cookie (dùng trong Server Components / API Routes)
export async function getCurrentUser(): Promise<JWTPayload | null> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get(COOKIE_NAME)?.value
        if (!token) return null
        return await verifyToken(token)
    } catch {
        return null
    }
}

// Yêu cầu quyền admin — dùng chung cho mọi API cần bảo vệ.
// Ném Error('Unauthorized') để route bắt và trả 401.
export async function requireAdmin(): Promise<JWTPayload> {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') throw new Error('Unauthorized')
    return user
}

// Set cookie sau khi login
export async function setAuthCookie(token: string) {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        path: '/',
    })
}

// Xoá cookie khi logout
export async function clearAuthCookie() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}

export { COOKIE_NAME }
