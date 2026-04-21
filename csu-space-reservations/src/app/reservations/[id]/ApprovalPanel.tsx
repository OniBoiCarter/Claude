"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Props {
  reservationId: string
  role: string
}

const ROLE_LABELS: Record<string, string> = {
  ADVISOR: "Advisor",
  DIRECTOR: "Director of Student Affairs",
  COORDINATOR: "Office Coordinator",
}

export function ApprovalPanel({ reservationId, role }: Props) {
  const router = useRouter()
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAction(action: "approve" | "deny") {
    if (action === "deny" && !notes.trim()) {
      setError("Please provide a reason for denial.")
      return
    }
    setSubmitting(true)
    setError(null)

    const res = await fetch(`/api/reservations/${reservationId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, notes }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? "Action failed. Please try again.")
      setSubmitting(false)
      return
    }

    router.refresh()
  }

  return (
    <div className="bg-white border-2 border-[#006633] rounded-xl p-6">
      <h2 className="font-bold text-gray-800 mb-1">
        {ROLE_LABELS[role] ?? role} Review
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Review this request and approve or deny it.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes / Comments {role === "COORDINATOR" ? "(included in confirmation email)" : ""}
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
          rows={3}
          placeholder={
            role === "COORDINATOR"
              ? "Any notes for the requestor (optional for approval, required for denial)..."
              : "Notes (required if denying)..."
          }
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleAction("approve")}
          disabled={submitting}
          className="flex-1 bg-[#006633] text-white py-2 rounded-lg font-semibold text-sm hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Processing..." : "✓ Approve"}
        </button>
        <button
          onClick={() => handleAction("deny")}
          disabled={submitting}
          className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Processing..." : "✗ Deny"}
        </button>
      </div>
    </div>
  )
}
