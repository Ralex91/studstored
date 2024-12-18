import prisma from "@/lib/db"

export const GET = async (req, { params }) => {
  const classSelected = await prisma.class.findFirst({
    where: {
      id: params.id,
    },
  })
  return Response.json(classSelected)
}
