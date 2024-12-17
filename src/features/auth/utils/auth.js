import bcrypt from "bcryptjs"
import { jwtVerify } from "jose"

export const getSession = (token) => {
  if (!token) {
    return null
  }

  try {
    return jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
  } catch (err) {
    return null
  }
}

export const createSession = (user) =>
  sign(
    {
      exp: Math.floor(Date.now() / 1000) - 30, //Date.now() / 1000 + 60 * 60, // 1 hour from now
      id: user.id,
      username: user.username,
      role: user.role,
    },
    new TextEncoder().encode(process.env.JWT_SECRET)
  )

export const isPasswordMatch = (password, hashedPassword) =>
  bcrypt.compareSync(password, hashedPassword)
