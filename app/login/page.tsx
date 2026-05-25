import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import LoginForm from '@/components/auth/LoginForm'

export default async function LoginPage() {
  const session = await getSession()
  if (session) redirect('/bracket')

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚽</div>
          <h1 className="text-2xl font-bold text-white">MondialCrawlerCarl</h1>
          <p className="text-slate-400 mt-1 text-sm">World Cup 2026 · Friends Edition</p>
        </div>
        <div className="rounded-xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border-col)' }}>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
