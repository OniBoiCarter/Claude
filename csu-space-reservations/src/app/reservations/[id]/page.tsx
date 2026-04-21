import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { StatusBadge } from "@/components/StatusBadge"
import { formatDate, formatDateTime, SUBMITTER_TYPE_LABELS } from "@/lib/utils"
import { ApprovalPanel } from "./ApprovalPanel"
import Link from "next/link"

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/signin")

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

  if (!reservation) notFound()

  const role = session.user.role
  const isOwner = reservation.submittedById === session.user.id
  const canView =
    isOwner ||
    role === "ADMIN" ||
    role === "COORDINATOR" ||
    role === "DIRECTOR" ||
    role === "POLICE" ||
    (role === "ADVISOR" && reservation.submitterType === "STUDENT_ORG")

  if (!canView) redirect("/dashboard")

  const canApprove =
    (role === "ADVISOR" && reservation.status === "PENDING_ADVISOR") ||
    (role === "DIRECTOR" && reservation.status === "PENDING_DIRECTOR") ||
    (role === "COORDINATOR" && reservation.status === "PENDING_COORDINATOR")

  const dl = "grid grid-cols-3 gap-2 text-sm"
  const dt = "text-gray-500 font-medium col-span-1"
  const dd = "col-span-2 text-gray-900"
  const sectionClass = "bg-white border border-gray-200 rounded-xl p-6 space-y-4"

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/dashboard" className="text-[#006633] text-sm hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{reservation.eventName}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Reference #{reservation.id.slice(-8).toUpperCase()} · Submitted {formatDateTime(reservation.submittedAt)}
          </p>
        </div>
        <StatusBadge status={reservation.status} />
      </div>

      {reservation.denialReason && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <strong>Denial Reason:</strong> {reservation.denialReason}
        </div>
      )}

      {reservation.status === "APPROVED" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
          <strong>✅ This reservation has been approved.</strong> Campus Police have been notified. Please retain this page as your authorization to use the space.
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Application Info */}
        <div className={sectionClass}>
          <h2 className="font-bold text-gray-800 border-b pb-2">Application Information</h2>
          <dl className={dl}>
            <dt className={dt}>Requestor</dt><dd className={dd}>{reservation.requestorName}</dd>
            {reservation.title && <><dt className={dt}>Title</dt><dd className={dd}>{reservation.title}</dd></>}
            <dt className={dt}>Department</dt><dd className={dd}>{reservation.department}</dd>
            <dt className={dt}>Email</dt><dd className={dd}>{reservation.email}</dd>
            {reservation.telephone && <><dt className={dt}>Phone</dt><dd className={dd}>{reservation.telephone}</dd></>}
            <dt className={dt}>Funding Acct #</dt><dd className={dd}>{reservation.fundingAccountNo}</dd>
            <dt className={dt}>Type</dt><dd className={dd}>{SUBMITTER_TYPE_LABELS[reservation.submitterType] ?? reservation.submitterType}</dd>
          </dl>
        </div>

        {/* Event Info */}
        <div className={sectionClass}>
          <h2 className="font-bold text-gray-800 border-b pb-2">Event Information</h2>
          <dl className={dl}>
            <dt className={dt}>Event Date</dt><dd className={dd}>{formatDate(reservation.eventDate)}</dd>
            {reservation.alternativeDate && <><dt className={dt}>Alt. Date</dt><dd className={dd}>{formatDate(reservation.alternativeDate)}</dd></>}
            <dt className={dt}>Time</dt><dd className={dd}>{reservation.startTime} – {reservation.endTime}</dd>
            <dt className={dt}>Attendance</dt><dd className={dd}>{reservation.attendance}</dd>
            <dt className={dt}>Admission</dt>
            <dd className={dd}>
              {reservation.admissionType === "FREE" ? "Free" :
               reservation.admissionType === "TICKETS" ? `Tickets – $${reservation.ticketPrice}` :
               `Pay on Site – $${reservation.payOnSitePrice}`}
            </dd>
            {reservation.speakerPerformer && <><dt className={dt}>Speaker/Performer</dt><dd className={dd}>{reservation.speakerPerformer}</dd></>}
            {reservation.whoMayAttend && <><dt className={dt}>Who May Attend</dt><dd className={dd}>{reservation.whoMayAttend}</dd></>}
          </dl>
          <div>
            <p className="text-gray-500 text-xs font-medium">Purpose</p>
            <p className="text-sm text-gray-900 mt-1">{reservation.purpose}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {reservation.foodBeverages && <span className="bg-gray-100 px-2 py-0.5 rounded">Food/Beverages</span>}
            {reservation.musicProvided && <span className="bg-gray-100 px-2 py-0.5 rounded">Music: {reservation.musicType}</span>}
            {reservation.concessionsNeeded && <span className="bg-gray-100 px-2 py-0.5 rounded">Concessions</span>}
            {reservation.catered && <span className="bg-gray-100 px-2 py-0.5 rounded">Catered</span>}
            {reservation.webCalendar && <span className="bg-gray-100 px-2 py-0.5 rounded">Web Calendar</span>}
          </div>
        </div>
      </div>

      {/* Space Info */}
      <div className={sectionClass}>
        <h2 className="font-bold text-gray-800 border-b pb-2">Space &amp; Setup</h2>
        <div className="grid grid-cols-2 gap-6">
          <dl className={dl}>
            <dt className={dt}>Requested Space</dt><dd className={dd}>{reservation.requestedSpace}</dd>
            {reservation.room && <><dt className={dt}>Specific Room</dt><dd className={dd}>{reservation.room.name}</dd></>}
            {reservation.doorOpenTimeSponsor && <><dt className={dt}>Door Open (Sponsor)</dt><dd className={dd}>{reservation.doorOpenTimeSponsor}</dd></>}
            {reservation.doorOpenTimePublic && <><dt className={dt}>Door Open (Public)</dt><dd className={dd}>{reservation.doorOpenTimePublic}</dd></>}
          </dl>
          {reservation.setupDescription && (
            <div>
              <p className="text-gray-500 text-xs font-medium">Setup Description</p>
              <p className="text-sm text-gray-900 mt-1">{reservation.setupDescription}</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Services */}
      {(reservation.soundMicrophone || reservation.audiovisual || reservation.podium || reservation.stage ||
        reservation.parking || reservation.telecomDevices || reservation.tablesNeeded || reservation.registrationTable ||
        reservation.chairs || reservation.lighting || reservation.pipeDrape || reservation.otherServices) && (
        <div className={sectionClass}>
          <h2 className="font-bold text-gray-800 border-b pb-2">Additional Services</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {reservation.soundMicrophone && <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded">Sound/Microphone</span>}
            {reservation.audiovisual && <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded">Audiovisual</span>}
            {reservation.podium && <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded">Podium</span>}
            {reservation.stage && <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded">Stage {reservation.stageSize ? `(${reservation.stageSize})` : ""}</span>}
            {reservation.parking && <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded">Parking</span>}
            {reservation.telecomDevices && <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded">Telecom Devices</span>}
            {reservation.tablesNeeded && <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded">Tables ({reservation.tableType})</span>}
            {reservation.registrationTable && <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded">Registration Table</span>}
            {reservation.chairs && <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded">Chairs ({reservation.chairCount})</span>}
            {reservation.lighting && <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded">Lighting</span>}
            {reservation.pipeDrape && <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded">Pipe &amp; Drape</span>}
            {reservation.otherServices && <span className="bg-blue-50 border border-blue-200 px-3 py-1 rounded">Other: {reservation.otherServices}</span>}
          </div>
        </div>
      )}

      {/* Approval Timeline */}
      <div className={sectionClass}>
        <h2 className="font-bold text-gray-800 border-b pb-2">Approval Timeline</h2>
        <ol className="relative border-l border-gray-200 ml-3 space-y-4">
          {reservation.approvalActions.map((action) => (
            <li key={action.id} className="ml-6">
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-green-100 rounded-full ring-4 ring-white text-xs">
                {action.action.includes("APPROVED") || action.action === "SUBMITTED" ? "✓" :
                 action.action.includes("DENIED") ? "✗" : "○"}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {action.action.replace(/_/g, " ")}
                  <span className="text-gray-500 font-normal"> by {action.approver.name} ({action.approver.role})</span>
                </p>
                {action.notes && <p className="text-xs text-gray-500 mt-0.5">Note: {action.notes}</p>}
                <p className="text-xs text-gray-400">{formatDateTime(action.createdAt)}</p>
              </div>
            </li>
          ))}
          {!["APPROVED", "DENIED", "CANCELLED"].includes(reservation.status) && (
            <li className="ml-6 opacity-40">
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full ring-4 ring-white text-xs">○</span>
              <p className="text-sm text-gray-400">Awaiting next approval step…</p>
            </li>
          )}
        </ol>
      </div>

      {/* Approval Panel for approvers */}
      {canApprove && (
        <ApprovalPanel reservationId={reservation.id} role={role} />
      )}
    </div>
  )
}
