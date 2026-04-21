"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

const DEMO_ACCOUNTS = [
  {
    role: "Submitter",
    label: "Student Org",
    description: "Submit a new space reservation",
    email: "demo.submitter@csu.edu",
    color: "bg-gray-50 border-gray-200 hover:border-gray-400",
    badge: "bg-gray-100 text-gray-700",
    icon: "📋",
  },
  {
    role: "Advisor",
    label: "Advisor",
    description: "Review & approve student org requests",
    email: "demo.advisor@csu.edu",
    color: "bg-yellow-50 border-yellow-200 hover:border-yellow-400",
    badge: "bg-yellow-100 text-yellow-800",
    icon: "👤",
  },
  {
    role: "Director",
    label: "Director",
    description: "Director of Student Affairs QC review",
    email: "demo.director@csu.edu",
    color: "bg-orange-50 border-orange-200 hover:border-orange-400",
    badge: "bg-orange-100 text-orange-800",
    icon: "🏛️",
  },
  {
    role: "Coordinator",
    label: "Coordinator",
    description: "Final approval & room assignment",
    email: "demo.coordinator@csu.edu",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    badge: "bg-blue-100 text-blue-800",
    icon: "✅",
  },
  {
    role: "Police",
    label: "Campus Police",
    description: "View approved upcoming events",
    email: "demo.police@csu.edu",
    color: "bg-indigo-50 border-indigo-200 hover:border-indigo-400",
    badge: "bg-indigo-100 text-indigo-800",
    icon: "🚔",
  },
  {
    role: "Admin",
    label: "Admin",
    description: "Manage users, roles & rooms",
    email: "demo.admin@csu.edu",
    color: "bg-green-50 border-green-200 hover:border-green-400",
    badge: "bg-green-100 text-green-800",
    icon: "⚙️",
  },
]

const DEMO_PASSWORD = "Demo1234!"

export function DemoLoginForm() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loginAs(email: string, role: string) {
    setLoading(role)
    setError(null)
    const result = await signIn("credentials", {
      email,
      password: DEMO_PASSWORD,
      callbackUrl: "/dashboard",
      redirect: false,
    })
    if (result?.error) {
      setError("Demo login failed. Make sure the server seeded demo accounts.")
      setLoading(null)
    } else {
      window.location.href = result?.url ?? "/dashboard"
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.role}
            onClick={() => loginAs(account.email, account.role)}
            disabled={loading !== null}
            className={`flex items-start gap-2 p-3 border rounded-xl text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${account.color}`}
          >
            <span className="text-lg leading-none mt-0.5">{account.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-gray-900 text-xs">{account.label}</span>
                {loading === account.role && (
                  <span className="text-xs text-gray-400">Signing in…</span>
                )}
              </div>
              <p className="text-gray-500 text-xs mt-0.5 leading-tight">{account.description}</p>
            </div>
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 pt-1">
        Password for all demo accounts: <code className="bg-gray-100 px-1 rounded">{DEMO_PASSWORD}</code>
      </p>
    </div>
  )
}
