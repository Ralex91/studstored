export async function PATCH(req, { params }) {
  const { yearId } = await params
  const { isActive } = await req.json()
  console.log(yearId, isActive)

  const updatedYear = await prisma.schoolYear.update({
    where: { id: yearId },
    data: { isActive },
  })
  return new Response(JSON.stringify(updatedYear), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
