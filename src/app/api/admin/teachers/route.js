import prisma from "@/lib/db"

export async function GET(req) {
  const teachers = await prisma.professor.findMany({})
  return new Response(JSON.stringify(teachers), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function POST(req) {
  const { firstName, lastName } = await req.json()

  const newTeacher = await prisma.professor.create({
    data: {
      firstName,
      lastName,
    },
  })

  return Response.json(
    { firstName: newTeacher.firstName, lastName: newTeacher.lastName },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}
