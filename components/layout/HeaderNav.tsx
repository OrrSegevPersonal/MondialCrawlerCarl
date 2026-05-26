'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/bracket',     label: 'Bracket' },
  { href: '/leaderboard', label: 'Scores'  },
  { href: '/profile',     label: 'Me'      },
]

export default function HeaderNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname()
  const links = isAdmin ? [...nav, { href: '/admin', label: 'Admin' }] : nav

  return (
    <nav className="hidden sm:flex items-center gap-1">
      {links.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link key={item.href} href={item.href}
            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{ color: active ? 'var(--accent)' : '#6b7280',
                     background: active ? 'rgba(63,185,80,0.1)' : undefined }}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
