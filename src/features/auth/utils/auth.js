import bcrypt from "bcryptjs"
import { base64url, jwtVerify, SignJWT } from "jose"

const secretKey = base64url.decode(process.env.JWT_SECRET, "utf-8")

export const getSession = (token) => {
  if (!token) {
    return null
  }

  try {
    return jwtVerify(token, secretKey)
  } catch (err) {
    return null
  }
}

export const createSession = async (user) =>
  await new SignJWT({
    id: user.id,
    username: user.username,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secretKey)

export const isPasswordMatch = (password, hashedPassword) =>
  bcrypt.compareSync(password, hashedPassword)
