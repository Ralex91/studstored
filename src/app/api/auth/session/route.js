import { getSession } from "@/features/auth/utils/auth"
import { cookies } from "next/headers"

export const GET = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const session = getSession(token)

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  return Response.json(session)
}
