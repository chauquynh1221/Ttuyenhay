import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'truyen-full-super-secret-key-2024-change-in-production'
)

const COOKIE_NAME = 'tf_token'
const TOKEN_EXPIRY = '7d'

export interface JWTPayload {
    userId: string
    email: string
    name: string
    role: 'user' | 'vip' | 'admin'
}

// Tạo JWT token
export async function signToken(payload: JWTPayload): Promise<string> {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(TOKEN_EXPIRY)
        .sign(SECRET)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET)
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
