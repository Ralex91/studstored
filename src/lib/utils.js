import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
