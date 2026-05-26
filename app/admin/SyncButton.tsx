'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SyncButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function sync() {
    setLoading(true)
    setMsg('')
    const res = await fetch('/api/admin/sync-fixtures', { method: 'POST' })
    const data = await res.json()
    setLoading(false)
    setMsg(res.ok ? `Synced ${data.upserted} fixtures` : data.error)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-3">
      {msg && <span className="text-xs text-slate-400">{msg}</span>}
      <button onClick={sync} disabled={loading}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-black disabled:opacity-50"
        style={{ background: 'var(--accent)' }}>
        {loading ? 'Syncing…' : '⬇ Sync Fixtures'}
      </button>
    </div>
  )
}
