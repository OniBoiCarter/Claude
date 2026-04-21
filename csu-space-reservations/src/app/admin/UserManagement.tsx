"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string | null
  email: string | null
  role: string
  department: string | null
  title: string | null
  createdAt: Date
}

const ROLES = ["SUBMITTER", "ADVISOR", "DIRECTOR", "COORDINATOR", "POLICE", "ADMIN"]

export function UserManagement({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [editing, setEditing] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ role: string; department: string; title: string }>({ role: "", department: "", title: "" })
  const [saving, setSaving] = useState(false)

  function startEdit(user: User) {
    setEditing(user.id)
    setEditData({ role: user.role, department: user.department ?? "", title: user.title ?? "" })
  }

  async function saveEdit(userId: string) {
    setSaving(true)
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...editData }),
    })
    if (res.ok) {
      const updated = await res.json()
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updated } : u)))
      setEditing(null)
      router.refresh()
    }
    setSaving(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-bold text-gray-800">User Roles ({users.length})</h2>
        <p className="text-xs text-gray-500 mt-0.5">Assign roles to users who have signed in</p>
      </div>
      <div className="overflow-y-auto max-h-[500px]">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left px-4 py-2 text-gray-500 font-medium">Name</th>
              <th className="text-left px-4 py-2 text-gray-500 font-medium">Role</th>
              <th className="text-left px-4 py-2 text-gray-500 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{user.name ?? "—"}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </td>
                <td className="px-4 py-3">
                  {editing === user.id ? (
                    <div className="space-y-1">
                      <select
                        className="border border-gray-300 rounded px-2 py-1 text-xs w-full"
                        value={editData.role}
                        onChange={(e) => setEditData((d) => ({ ...d, role: e.target.value }))}
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <input
                        className="border border-gray-300 rounded px-2 py-1 text-xs w-full"
                        placeholder="Department"
                        value={editData.department}
                        onChange={(e) => setEditData((d) => ({ ...d, department: e.target.value }))}
                      />
                    </div>
                  ) : (
                    <div>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">{user.role}</span>
                      {user.department && <div className="text-xs text-gray-400 mt-0.5">{user.department}</div>}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editing === user.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => saveEdit(user.id)} disabled={saving} className="text-xs bg-green-700 text-white px-2 py-1 rounded hover:bg-green-800">
                        {saving ? "..." : "Save"}
                      </button>
                      <button onClick={() => setEditing(null)} className="text-xs text-gray-500 hover:text-gray-700">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(user)} className="text-xs text-[#006633] hover:underline">
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
