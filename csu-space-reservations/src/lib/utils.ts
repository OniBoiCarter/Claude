import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ROLES = {
  SUBMITTER: "SUBMITTER",
  ADVISOR: "ADVISOR",
  DIRECTOR: "DIRECTOR",
  COORDINATOR: "COORDINATOR",
  POLICE: "POLICE",
  ADMIN: "ADMIN",
} as const

export const STATUSES = {
  DRAFT: "DRAFT",
  PENDING_ADVISOR: "PENDING_ADVISOR",
  PENDING_DIRECTOR: "PENDING_DIRECTOR",
  PENDING_COORDINATOR: "PENDING_COORDINATOR",
  APPROVED: "APPROVED",
  DENIED: "DENIED",
  CANCELLED: "CANCELLED",
} as const

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  PENDING_ADVISOR: "Pending Advisor",
  PENDING_DIRECTOR: "Pending Director",
  PENDING_COORDINATOR: "Pending Coordinator",
  APPROVED: "Approved",
  DENIED: "Denied",
  CANCELLED: "Cancelled",
}

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PENDING_ADVISOR: "bg-yellow-100 text-yellow-700",
  PENDING_DIRECTOR: "bg-orange-100 text-orange-700",
  PENDING_COORDINATOR: "bg-blue-100 text-blue-700",
  APPROVED: "bg-green-100 text-green-700",
  DENIED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
}

export const SUBMITTER_TYPE_LABELS: Record<string, string> = {
  STUDENT_ORG: "Student Organization",
  FACULTY: "Faculty",
  STAFF: "Staff",
  EXTERNAL: "External Organization",
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function isAtLeast15DaysAhead(date: Date | string): boolean {
  const eventDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cutoff = new Date(today)
  cutoff.setDate(cutoff.getDate() + 15)
  return eventDate >= cutoff
}
