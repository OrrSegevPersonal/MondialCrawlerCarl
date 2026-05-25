import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import BottomNav from '@/components/layout/BottomNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b flex items-center justify-between px-4 h-12"
        style={{ background: 'var(--surface)', borderColor: 'var(--border-col)' }}>
        <span className="font-bold text-sm tracking-wide text-white">⚽ MCC 2026</span>
        <span className="text-xs text-slate-400">{session.display_name}</span>
      </header>
      <main className="flex-1 pb-20">
        {children}
      </main>
      <BottomNav isAdmin={session.is_admin} />
    </div>
  )
}
