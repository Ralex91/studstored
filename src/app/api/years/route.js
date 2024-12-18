import prisma from "@/lib/db"

export async function GET(req) {
  const years = await prisma.schoolYear.findMany({})
  return new Response(JSON.stringify(years), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function POST(req) {
  const { year, isActive } = await req.json()
  const newYear = await prisma.schoolYear.create({
    data: {
      year,
      isActive,
    },
  })
  return new Response(JSON.stringify(newYear), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
