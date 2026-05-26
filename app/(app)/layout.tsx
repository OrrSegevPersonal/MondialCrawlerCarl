import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import BottomNav from '@/components/layout/BottomNav'
import HeaderNav from '@/components/layout/HeaderNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b flex items-center justify-between px-4 h-12"
        style={{ background: 'var(--surface)', borderColor: 'var(--border-col)' }}>
        <span className="font-bold text-sm tracking-wide text-white">⚽ MCC 2026</span>
        <div className="flex items-center gap-4">
          <HeaderNav isAdmin={session.is_admin} />
          <span className="text-xs text-slate-400">{session.display_name}</span>
        </div>
      </header>
      <main className="flex-1 pb-safe sm:pb-0">
        <div className="mx-auto w-full max-w-2xl pb-24 sm:pb-8">
          {children}
        </div>
      </main>
      <BottomNav isAdmin={session.is_admin} />
    </div>
  )
}
