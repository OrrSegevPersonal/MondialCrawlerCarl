import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { createSession } from '@/lib/auth'

const schema = z.object({
  username: z.string().min(1),
  phone: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { username, phone } = parsed.data
  const db = createServiceClient()
  const { data: user } = await db
    .from('users')
    .select('id, username, phone_hash, display_name, is_admin')
    .eq('username', username.toLowerCase().trim())
    .maybeSingle()

  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const valid = await bcrypt.compare(phone.trim(), user.phone_hash)
  if (!valid) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  await createSession({
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    is_admin: user.is_admin,
  })

  return Response.json({ ok: true })
}
