import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  sendApprovalNotification,
  sendDenialNotification,
  sendPoliceNotification,
} from "@/lib/email"
import { formatDate } from "@/lib/utils"

const POLICE_EMAIL = process.env.POLICE_EMAIL ?? "police@csu.edu"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { action, notes } = await request.json()

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { submittedBy: true },
  })

  if (!reservation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const role = session.user.role
  let newStatus: string | null = null
  let actionType: string | null = null

  if (role === "ADVISOR" && reservation.status === "PENDING_ADVISOR") {
    if (action === "approve") {
      newStatus = "PENDING_DIRECTOR"
      actionType = "ADVISOR_APPROVED"
    } else {
      newStatus = "DENIED"
      actionType = "ADVISOR_DENIED"
    }
  } else if (role === "DIRECTOR" && reservation.status === "PENDING_DIRECTOR") {
    if (action === "approve") {
      newStatus = "PENDING_COORDINATOR"
      actionType = "DIRECTOR_APPROVED"
    } else {
      newStatus = "DENIED"
      actionType = "DIRECTOR_DENIED"
    }
  } else if (
    role === "COORDINATOR" &&
    reservation.status === "PENDING_COORDINATOR"
  ) {
    if (action === "approve") {
      newStatus = "APPROVED"
      actionType = "COORDINATOR_APPROVED"
    } else {
      newStatus = "DENIED"
      actionType = "COORDINATOR_DENIED"
    }
  } else {
    return NextResponse.json(
      { error: "Not authorized to perform this action at this stage." },
      { status: 403 }
    )
  }

  const [updated] = await prisma.$transaction([
    prisma.reservation.update({
      where: { id },
      data: {
        status: newStatus,
        denialReason: action === "deny" ? notes : null,
      },
    }),
    prisma.approvalAction.create({
      data: {
        reservationId: id,
        approverId: session.user.id,
        action: actionType,
        notes,
      },
    }),
  ])

  const emailData = {
    submitterEmail: reservation.email,
    submitterName: reservation.requestorName,
    eventName: reservation.eventName,
    eventDate: formatDate(reservation.eventDate),
    requestedSpace: reservation.requestedSpace,
    reservationId: reservation.id,
  }

  try {
    if (newStatus === "APPROVED") {
      await sendApprovalNotification({ ...emailData, approverName: session.user.name ?? "", notes })
      await sendPoliceNotification({
        ...emailData,
        policeEmail: POLICE_EMAIL,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        doorOpenTimeSponsor: reservation.doorOpenTimeSponsor ?? undefined,
        doorOpenTimePublic: reservation.doorOpenTimePublic ?? undefined,
        attendance: reservation.attendance,
        submitterType: reservation.submitterType,
      })
    } else if (newStatus === "DENIED") {
      await sendDenialNotification({ ...emailData, reason: notes ?? "No reason provided." })
    }
  } catch {
    // Email failures should not fail the approval action
  }

  return NextResponse.json(updated)
}
