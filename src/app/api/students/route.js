import prisma from "@/lib/db"

export const GET = async (req) => {
  const searchStudent = req.nextUrl.searchParams.get("search")

  const students = await prisma.student.findMany({
    ...(searchStudent && {
      where: {
        OR: [
          {
            firstName: {
              contains: searchStudent,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: searchStudent,
              mode: "insensitive",
            },
          },
          {
            AND: searchStudent?.split(" ").map((keyword) => ({
              OR: [
                {
                  firstName: {
                    contains: keyword,
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: keyword,
                    mode: "insensitive",
                  },
                },
              ],
            })),
          },
        ],
      },
    }),
    take: 10,
  })

  return Response.json(students)
}
