import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { StatusBadge } from "@/components/StatusBadge"
import { formatDate, SUBMITTER_TYPE_LABELS } from "@/lib/utils"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/signin")

  const role = session.user.role

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let where: any = {}
  if (role === "SUBMITTER") {
    where.submittedById = session.user.id
  } else if (role === "ADVISOR") {
    where = {
      OR: [
        { submittedById: session.user.id },
        { status: "PENDING_ADVISOR", submitterType: "STUDENT_ORG" },
      ],
    }
  } else if (role === "DIRECTOR") {
    where.status = {
      in: ["PENDING_DIRECTOR", "PENDING_COORDINATOR", "APPROVED", "DENIED"],
    }
  } else if (role === "COORDINATOR") {
    where.status = { in: ["PENDING_COORDINATOR", "APPROVED", "DENIED"] }
  } else if (role === "POLICE") {
    where.status = "APPROVED"
    const upcoming = new Date()
    upcoming.setDate(upcoming.getDate() - 7)
    where.eventDate = { gte: upcoming }
  }

  const reservations = await prisma.reservation.findMany({
    where,
    include: {
      submittedBy: { select: { name: true, email: true } },
      room: true,
    },
    orderBy:
      role === "POLICE" ? { eventDate: "asc" } : { submittedAt: "desc" },
    take: 50,
  })

  const pendingActions = reservations.filter((r) => {
    if (role === "ADVISOR") return r.status === "PENDING_ADVISOR"
    if (role === "DIRECTOR") return r.status === "PENDING_DIRECTOR"
    if (role === "COORDINATOR") return r.status === "PENDING_COORDINATOR"
    return false
  })

  const roleTitle: Record<string, string> = {
    SUBMITTER: "My Reservations",
    ADVISOR: "Advisor Dashboard",
    DIRECTOR: "Director Dashboard",
    COORDINATOR: "Coordinator Dashboard",
    POLICE: "Approved Events",
    ADMIN: "All Reservations",
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {roleTitle[role] ?? "Dashboard"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {session.user.name}
          </p>
        </div>
        {(role === "SUBMITTER" || role === "ADMIN") && (
          <Link
            href="/reservations/new"
            className="bg-[#006633] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors text-sm font-medium"
          >
            + New Reservation
          </Link>
        )}
      </div>

      {pendingActions.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h2 className="font-semibold text-yellow-800 mb-2">
            ⏳ Awaiting Your Action ({pendingActions.length})
          </h2>
          <div className="space-y-2">
            {pendingActions.map((r) => (
              <Link
                key={r.id}
                href={`/reservations/${r.id}`}
                className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-yellow-200 hover:border-yellow-400 transition-colors"
              >
                <div>
                  <span className="font-medium text-gray-900">{r.eventName}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    — {formatDate(r.eventDate)} · {r.requestedSpace}
                  </span>
                </div>
                <span className="text-yellow-700 text-sm font-medium">Review →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">
            {role === "POLICE" ? "Upcoming Approved Events" : "All Requests"}
            <span className="ml-2 text-gray-400 text-sm font-normal">
              ({reservations.length})
            </span>
          </h2>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-medium">No reservations found</p>
            {role === "SUBMITTER" && (
              <Link
                href="/reservations/new"
                className="mt-3 inline-block text-[#006633] hover:underline text-sm"
              >
                Submit your first reservation →
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Event</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Space</th>
                  {role !== "SUBMITTER" && (
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Submitted By</th>
                  )}
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Type</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{r.eventName}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(r.eventDate)}</td>
                    <td className="px-6 py-4 text-gray-600">{r.requestedSpace}</td>
                    {role !== "SUBMITTER" && (
                      <td className="px-6 py-4 text-gray-600">
                        {r.submittedBy.name ?? r.submittedBy.email}
                      </td>
                    )}
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {SUBMITTER_TYPE_LABELS[r.submitterType] ?? r.submitterType}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/reservations/${r.id}`}
                        className="text-[#006633] hover:underline text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
