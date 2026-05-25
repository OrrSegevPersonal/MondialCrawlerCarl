import { createServiceClient } from '@/lib/supabase/server'
import CreateUserForm from './CreateUserForm'

export default async function UsersPage() {
  const db = createServiceClient()
  const { data: users } = await db
    .from('users')
    .select('id, username, display_name, is_admin, created_at')
    .order('created_at')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-lg font-bold text-white mb-6">User Management</h1>

      <div className="rounded-xl border overflow-hidden mb-8"
        style={{ borderColor: 'var(--border-col)', background: 'var(--surface)' }}>
        {!users?.length ? (
          <p className="text-slate-500 text-sm text-center py-6">No users yet.</p>
        ) : (
          users.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0"
              style={{ borderColor: 'var(--border-col)' }}>
              <div>
                <div className="text-sm font-medium text-white">{u.display_name}</div>
                <div className="text-xs text-slate-500">@{u.username} {u.is_admin ? '· Admin' : ''}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="rounded-xl border p-5"
        style={{ borderColor: 'var(--border-col)', background: 'var(--surface)' }}>
        <h2 className="text-sm font-semibold text-white mb-4">Add New User</h2>
        <CreateUserForm />
      </div>
    </div>
  )
}
