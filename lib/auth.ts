import { SignJWT, jwtVerify } from 'jose'
import { createHash } from 'crypto'
import { cookies } from 'next/headers'
import { createServiceClient } from './supabase/server'
import type { SessionUser } from '@/types'

const COOKIE_NAME = 'session'
const SESSION_DURATION_DAYS = 30

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET!)
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ sub: user.id, username: user.username, display_name: user.display_name, is_admin: user.is_admin })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(getSecret())

  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 86400 * 1000)
  const db = createServiceClient()
  await db.from('sessions').insert({
    user_id: user.id,
    token_hash: hashToken(token),
    expires_at: expiresAt.toISOString(),
  })

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })

  return token
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getSecret())
    const db = createServiceClient()
    const { data } = await db
      .from('sessions')
      .select('id')
      .eq('token_hash', hashToken(token))
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (!data) return null

    return {
      id: payload.sub as string,
      username: payload.username as string,
      display_name: payload.display_name as string,
      is_admin: payload.is_admin as boolean,
    }
  } catch {
    return null
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (token) {
    const db = createServiceClient()
    await db.from('sessions').delete().eq('token_hash', hashToken(token))
  }
  cookieStore.delete(COOKIE_NAME)
}
