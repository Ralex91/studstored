import { generateRandomPassword } from "@/features/import/utils/import"
import prisma from "@/lib/db"
import bcrypt from "bcrypt"

export async function GET(req) {
  const users = await prisma.user.findMany({})
  users.forEach((user) => {
    user.password = "********"
    delete user.hashPassword
  })
  return new Response(JSON.stringify(users), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function POST(req) {
  const { username, name, role } = await req.json()
  const plainPassword = generateRandomPassword()
  const password = await bcrypt.hash(plainPassword, 12)
  const newUser = await prisma.user.create({
    data: {
      username,
      name,
      role,
      hashPassword: password,
    },
  })
  newUser.password = plainPassword
  newUser.isNew = true
  return new Response(JSON.stringify(newUser), {
    headers: {
      "Content-Type": "application/json",
    },
  })
}
