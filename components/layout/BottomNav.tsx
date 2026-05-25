'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/bracket',     label: 'Bracket',     icon: '🏆' },
  { href: '/leaderboard', label: 'Scores',       icon: '📊' },
  { href: '/profile',     label: 'Me',           icon: '👤' },
]

export default function BottomNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()

  const links = isAdmin ? [...nav, { href: '/admin', label: 'Admin', icon: '⚙️' }] : nav

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t flex"
      style={{ background: 'var(--surface)', borderColor: 'var(--border-col)' }}>
      {links.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link key={item.href} href={item.href}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors"
            style={{ color: active ? 'var(--accent)' : '#6b7280' }}>
            <span className="text-xl leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
