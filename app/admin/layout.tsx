import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import BottomNav from '@/components/layout/BottomNav'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.is_admin) redirect('/bracket')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b flex items-center justify-between px-4 h-12"
        style={{ background: 'var(--surface)', borderColor: 'var(--border-col)' }}>
        <span className="font-bold text-sm text-white">⚙️ Admin</span>
        <div className="flex gap-4 text-xs text-slate-400">
          <Link href="/admin" className="hover:text-white">Matches</Link>
          <Link href="/admin/users" className="hover:text-white">Users</Link>
          <Link href="/bracket" className="hover:text-white">← App</Link>
        </div>
      </header>
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav isAdmin />
    </div>
  )
}
