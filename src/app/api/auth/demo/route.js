import { createSession } from "@/features/auth/utils/auth"
import prisma from "@/lib/db"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export const GET = async () => {
  const cookieStore = await cookies()

  let demoUser = await prisma.user.findFirst({
    where: {
      username: "demo",
    },
  })

  if (!demoUser) {
    demoUser = await prisma.user.create({
      data: {
        username: "demo",
        name: "Demo User",
        username: "demo",
        role: Role.ADMIN,
        username: "demo",
        hashPassword: await bcrypt.hash("password", 10),
      },
    })
  }

  const newSession = await createSession(demoUser)

  cookieStore.set("token", newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
  })

  return Response.json({ token: newSession })
}
