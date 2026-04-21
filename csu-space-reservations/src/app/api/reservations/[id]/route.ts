import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      submittedBy: { select: { id: true, name: true, email: true, role: true } },
      advisor: { select: { id: true, name: true, email: true } },
      room: true,
      approvalActions: {
        include: {
          approver: { select: { name: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!reservation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const role = session.user.role
  const isOwner = reservation.submittedById === session.user.id
  const canView =
    isOwner ||
    role === "ADMIN" ||
    role === "COORDINATOR" ||
    role === "DIRECTOR" ||
    role === "POLICE" ||
    (role === "ADVISOR" && reservation.submitterType === "STUDENT_ORG")

  if (!canView) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(reservation)
}
