'use client'

import { useState } from 'react'
import GroupStage from './GroupStage'
import KnockoutBracket from './KnockoutBracket'
import type { MatchWithBet } from '@/types'

type Tab = 'groups' | 'knockout'

export default function BracketView({ matches }: { matches: MatchWithBet[] }) {
  const [tab, setTab] = useState<Tab>('groups')

  const groupMatches = matches.filter((m) => m.stage === 'group')
  const knockoutMatches = matches.filter((m) => m.stage !== 'group')

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b sticky top-12 z-30"
        style={{ background: 'var(--background)', borderColor: 'var(--border-col)' }}>
        {(['groups', 'knockout'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-3 text-sm font-medium capitalize transition-colors"
            style={{ color: tab === t ? 'var(--accent)' : '#6b7280',
                     borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent' }}>
            {t === 'groups' ? '🗂 Group Stage' : '🏆 Knockout'}
          </button>
        ))}
      </div>

      <div className="px-2 py-4">
        {tab === 'groups'
          ? <GroupStage matches={groupMatches} />
          : <KnockoutBracket matches={knockoutMatches} />}
      </div>
    </div>
  )
}
