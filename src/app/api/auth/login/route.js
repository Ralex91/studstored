import { createSession, isPasswordMatch } from "@/features/auth/utils/auth"
import { loginSchema } from "@/features/auth/utils/schemas"
import prisma from "@/lib/db"
import { cookies } from "next/headers"

export const POST = async (req) => {
  let rawData

  try {
    rawData = await req.json()
  } catch (err) {
    return Response.json({ error: "Bad request" }, { status: 400 })
  }

  const { data, error } = loginSchema.safeParse(rawData)

  if (error) {
    return Response.json(
      { error: error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { username, password } = data

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  })

  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const isMatch = isPasswordMatch(password, user.hashPassword)

  if (!isMatch) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const cookieStore = await cookies()
  const newSession = await createSession(user)

  cookieStore.set("token", newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
  })

  const { hashPassword, ...userWithoutPassword } = user

  return Response.json(userWithoutPassword)
}
