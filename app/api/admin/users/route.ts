import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'

const createSchema = z.object({
  username: z.string().min(2).max(30),
  phone: z.string().min(5).max(20),
  display_name: z.string().min(1).max(60),
  is_admin: z.boolean().optional(),
})

export async function GET() {
  const session = await getSession()
  if (!session?.is_admin) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const db = createServiceClient()
  const { data, error } = await db
    .from('users')
    .select('id, username, display_name, is_admin, created_at')
    .order('created_at')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ users: data })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.is_admin) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { username, phone, display_name, is_admin } = parsed.data
  const phone_hash = await bcrypt.hash(phone.trim(), 10)

  const db = createServiceClient()
  const { data, error } = await db
    .from('users')
    .insert({ username: username.toLowerCase().trim(), phone_hash, display_name, is_admin: is_admin ?? false })
    .select('id, username, display_name, is_admin')
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ user: data }, { status: 201 })
}
