import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { UserManagement } from "./UserManagement"
import { RoomManagement } from "./RoomManagement"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/signin")
  if (session.user.role !== "ADMIN") redirect("/dashboard")

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      title: true,
      createdAt: true,
    },
    orderBy: { name: "asc" },
  })

  const rooms = await prisma.room.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
  })

  const stats = await prisma.reservation.groupBy({
    by: ["status"],
    _count: true,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">Manage users, rooms, and system configuration</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.status} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{s._count}</div>
            <div className="text-xs text-gray-500 mt-1">{s.status.replace(/_/g, " ")}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <UserManagement initialUsers={users} />
        <RoomManagement initialRooms={rooms} />
      </div>
    </div>
  )
}
