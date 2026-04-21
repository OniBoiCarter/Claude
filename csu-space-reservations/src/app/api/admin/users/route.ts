import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

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

  return NextResponse.json(users)
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { userId, role, department, title } = await request.json()

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role, department, title },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      title: true,
    },
  })

  return NextResponse.json(updated)
}
