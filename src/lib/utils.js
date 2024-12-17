import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function generateRandomPassword() {
  return crypto.randomBytes(8).toString("base64").slice(0, 10)
}
