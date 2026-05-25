'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateUserForm() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', phone: '', display_name: '', is_admin: false })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  function field(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: key === 'is_admin' ? e.target.checked : e.target.value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setMsg({ type: 'ok', text: `Created @${data.user.username}` })
      setForm({ username: '', phone: '', display_name: '', is_admin: false })
      router.refresh()
    } else {
      setMsg({ type: 'err', text: data.error ?? 'Error' })
    }
  }

  const inputCls = "w-full rounded-lg px-3 py-2 text-sm text-white border outline-none focus:border-green-500 transition-colors"
  const inputStyle = { background: 'var(--surface-2)', borderColor: 'var(--border-col)' }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Username</label>
          <input value={form.username} onChange={field('username')} required placeholder="carl" className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Display Name</label>
          <input value={form.display_name} onChange={field('display_name')} required placeholder="Carl" className={inputCls} style={inputStyle} />
        </div>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Phone (used as password)</label>
        <input value={form.phone} onChange={field('phone')} required placeholder="+972501234567" className={inputCls} style={inputStyle} />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
        <input type="checkbox" checked={form.is_admin} onChange={field('is_admin')} className="accent-green-500" />
        Admin user
      </label>
      {msg && (
        <p className={`text-sm ${msg.type === 'ok' ? 'text-green-400' : 'text-red-400'}`}>{msg.text}</p>
      )}
      <button type="submit" disabled={loading}
        className="py-2 rounded-lg font-semibold text-sm text-black disabled:opacity-50"
        style={{ background: 'var(--accent)' }}>
        {loading ? 'Creating…' : 'Create User'}
      </button>
    </form>
  )
}
