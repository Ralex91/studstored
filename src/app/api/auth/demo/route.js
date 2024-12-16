import { sign } from "jsonwebtoken"
import { cookies } from "next/headers"

export const GET = async () => {
  const cookieStore = await cookies()

  const newSession = sign(
    {
      exp: Date.now() / 1000 + 60 * 60, // 1 hour from now
      username: "Demo User",
      role: "ADMIN",
    },
    new TextEncoder().encode(process.env.JWT_SECRET)
  )

  cookieStore.set("token", newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
  })

  return Response.json({ token: newSession })
}
