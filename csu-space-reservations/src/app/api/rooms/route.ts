import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rooms = await prisma.room.findMany({
    where: { isActive: true },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  })

  return NextResponse.json(rooms)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const data = await request.json()
  const room = await prisma.room.create({
    data: {
      name: data.name,
      type: data.type,
      building: data.building || null,
      capacity: data.capacity ?? null,
    },
  })

  return NextResponse.json(room, { status: 201 })
}
