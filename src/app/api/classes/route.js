import { createClassSchema } from "@/features/classes/utils/schemas"
import prisma from "@/lib/db"

export const GET = async () => {
  const classes = await prisma.class.findMany({
    include: {
      schoolYear: true,
    },
  })
  const years = await prisma.schoolYear.findMany({
    where: {
      isActive: true,
    },
  })
  const professors = await prisma.professor.findMany()

  return Response.json({
    classes,
    years,
    professors,
  })
}

export const POST = async (req) => {
  let rawData

  try {
    rawData = await req.json()
  } catch (err) {
    return Response.json({ error: "Bad request" }, { status: 400 })
  }

  const { data, error } = createClassSchema.safeParse(rawData)

  if (error) {
    return Response.json(
      { error: error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const newClass = await prisma.class.create({
    data: {
      name: data.name,
      schoolYearId: data.schoolYearId,
      professorId: data.professorId,
    },
  })

  return Response.json(newClass)
}
