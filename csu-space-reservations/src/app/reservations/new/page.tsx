import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ReservationForm } from "./ReservationForm"

export default async function NewReservationPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/signin")

  const rooms = await prisma.room.findMany({
    where: { isActive: true },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  })

  const advisors = await prisma.user.findMany({
    where: { role: "ADVISOR" },
    select: { id: true, name: true, email: true, department: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ReservationForm
        currentUser={{
          id: session.user.id,
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          role: session.user.role,
          department: session.user.department ?? "",
          title: session.user.title ?? "",
        }}
        rooms={rooms}
        advisors={advisors}
      />
    </div>
  )
}
