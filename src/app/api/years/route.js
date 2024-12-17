import prisma from "@/lib/db"
export async function GET(req) {
  const years = await prisma.schoolYear.findMany({})
  return new Response(JSON.stringify(years), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
