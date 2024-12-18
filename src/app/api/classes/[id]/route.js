import prisma from "@/lib/db"

export const GET = async (req, { params }) => {
  const classId = (await params).id

  const classSelected = await prisma.class.findFirst({
    where: {
      id: classId,
    },
    include: {
      schoolYear: true,
      professor: true,
      students: {
        include: {
          student: true,
        },
      },
    },
  })
  return Response.json(classSelected)
}
