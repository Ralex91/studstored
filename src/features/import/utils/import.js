import crypto from "crypto"

export const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString("hex")
}
