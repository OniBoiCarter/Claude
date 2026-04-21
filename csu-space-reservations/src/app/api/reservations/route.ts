import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isAtLeast15DaysAhead } from "@/lib/utils"
import {
  sendSubmissionConfirmation,
  sendAdvisorNotification,
} from "@/lib/email"
import { formatDate } from "@/lib/utils"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let where: any = {}

  const role = session.user.role
  if (role === "SUBMITTER") {
    where.submittedById = session.user.id
  } else if (role === "ADVISOR") {
    where.OR = [
      { submittedById: session.user.id },
      {
        status: "PENDING_ADVISOR",
        submitterType: "STUDENT_ORG",
      },
    ]
  } else if (role === "DIRECTOR") {
    where.status = { in: ["PENDING_DIRECTOR", "PENDING_COORDINATOR", "APPROVED", "DENIED"] }
  } else if (role === "COORDINATOR") {
    where.status = { in: ["PENDING_COORDINATOR", "APPROVED", "DENIED"] }
  } else if (role === "POLICE") {
    where.status = "APPROVED"
  }

  if (status) {
    where.status = status
  }

  const reservations = await prisma.reservation.findMany({
    where,
    include: {
      submittedBy: { select: { name: true, email: true } },
      room: true,
      approvalActions: {
        include: { approver: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { submittedAt: "desc" },
  })

  return NextResponse.json(reservations)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await request.json()

  if (!isAtLeast15DaysAhead(data.eventDate)) {
    return NextResponse.json(
      { error: "Event date must be at least 15 days from today." },
      { status: 400 }
    )
  }

  const conflictWhere = {
    eventDate: new Date(data.eventDate),
    requestedSpace: data.requestedSpace,
    status: { in: ["PENDING_COORDINATOR", "APPROVED"] },
  }

  const conflict = await prisma.reservation.findFirst({ where: conflictWhere })
  if (conflict) {
    return NextResponse.json(
      {
        error: `This space already has an approved or pending reservation on that date (Ref: ${conflict.id.slice(-8).toUpperCase()}).`,
      },
      { status: 409 }
    )
  }

  const initialStatus =
    data.submitterType === "STUDENT_ORG"
      ? "PENDING_ADVISOR"
      : "PENDING_DIRECTOR"

  const reservation = await prisma.reservation.create({
    data: {
      ...data,
      eventDate: new Date(data.eventDate),
      alternativeDate: data.alternativeDate
        ? new Date(data.alternativeDate)
        : null,
      submittedById: session.user.id,
      status: initialStatus,
    },
  })

  await prisma.approvalAction.create({
    data: {
      reservationId: reservation.id,
      approverId: session.user.id,
      action: "SUBMITTED",
    },
  })

  try {
    await sendSubmissionConfirmation({
      submitterEmail: data.email,
      submitterName: data.requestorName,
      eventName: data.eventName,
      eventDate: formatDate(data.eventDate),
      requestedSpace: data.requestedSpace,
      reservationId: reservation.id,
    })

    if (data.submitterType === "STUDENT_ORG" && data.advisorId) {
      const advisor = await prisma.user.findUnique({
        where: { id: data.advisorId },
      })
      if (advisor?.email) {
        await sendAdvisorNotification(advisor.email, {
          submitterEmail: data.email,
          submitterName: data.requestorName,
          eventName: data.eventName,
          eventDate: formatDate(data.eventDate),
          requestedSpace: data.requestedSpace,
          reservationId: reservation.id,
        })
      }
    }
  } catch {
    // Email errors should not fail the reservation creation
  }

  return NextResponse.json(reservation, { status: 201 })
}
