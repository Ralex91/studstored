import prisma from "@/lib/db"

export async function GET(req) {
  const years = await prisma.schoolYear.findMany({
    orderBy: {
      id: "desc",
    },
  })
  return new Response(JSON.stringify(years), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function POST(req) {
  const { year } = await req.json()

  const activeYear = await prisma.schoolYear.findFirst({
    where: {
      isActive: true,
    },
  })

  if (activeYear) {
    return new Response(
      JSON.stringify({ error: "An active year already exists." }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  const newYear = await prisma.schoolYear.create({
    data: {
      year,
      isActive: true,
    },
  })
  return new Response(JSON.stringify(newYear), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
