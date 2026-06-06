import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const SALT_ROUNDS = 10
const SESSION_NAME = 'admin-session'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function comparePasswords(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(adminId: number): Promise<string> {
  const sessionId = Buffer.from(
    `${adminId}:${Date.now()}:${Math.random()}`
  ).toString('base64')

  const cookieStore = await cookies()
  cookieStore.set(SESSION_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return sessionId
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_NAME)?.value || null
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_NAME)
}
