import prisma from "@/lib/db"

export const GET = async (req) => {
  const searchProfessor = req.nextUrl.searchParams.get("search")

  const professors = await prisma.professor.findMany({
    ...(searchProfessor && {
      where: {
        OR: [
          {
            firstName: {
              contains: searchProfessor,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: searchProfessor,
              mode: "insensitive",
            },
          },
          {
            AND: searchProfessor?.split(" ").map((keyword) => ({
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

  return Response.json(professors)
}
