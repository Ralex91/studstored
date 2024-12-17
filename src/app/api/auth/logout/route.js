import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const GET = async (req) => {
  const cookieStore = await cookies()
  cookieStore.delete("token")

  return NextResponse.redirect(new URL("/", req.url))
}
