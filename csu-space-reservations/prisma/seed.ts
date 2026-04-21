import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const rooms = [
    { name: "Jones Convocation Center Arena", type: "Arena", building: "Jones Convocation Center", capacity: 5000 },
    { name: "Auditorium", type: "Auditorium", building: "Performing Arts Center", capacity: 850 },
    { name: "Recital Hall", type: "Auditorium", building: "Performing Arts Center", capacity: 200 },
    { name: "Cafeteria / Dining Hall", type: "Cafeteria", building: "Student Union", capacity: 400 },
    { name: "Conference Room A", type: "Conference Room", building: "Administrative Building", capacity: 30 },
    { name: "Conference Room B", type: "Conference Room", building: "Administrative Building", capacity: 20 },
    { name: "Conference Room C", type: "Conference Room", building: "Library", capacity: 25 },
    { name: "Lecture Hall 100", type: "Lecture Hall", building: "Science Building", capacity: 200 },
    { name: "Lecture Hall 200", type: "Lecture Hall", building: "Liberal Arts", capacity: 150 },
    { name: "Lecture Hall 300", type: "Lecture Hall", building: "Business Building", capacity: 100 },
    { name: "Multipurpose Room A", type: "Multipurpose Room", building: "Student Union", capacity: 150 },
    { name: "Multipurpose Room B", type: "Multipurpose Room", building: "Student Union", capacity: 80 },
    { name: "Student Center Ballroom", type: "Student Center", building: "Student Union", capacity: 500 },
    { name: "Outdoor Quad", type: "Outdoor Area", building: "Main Campus", capacity: 1000 },
    { name: "Gymnasium", type: "Gymnasium", building: "Physical Education", capacity: 600 },
    { name: "Classroom 101", type: "Classroom", building: "Liberal Arts", capacity: 40 },
    { name: "Classroom 202", type: "Classroom", building: "Science Building", capacity: 35 },
  ]

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { id: room.name },
      update: {},
      create: room,
    })
  }

  console.log(`Seeded ${rooms.length} rooms`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
