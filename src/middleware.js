import { Role } from "@prisma/client"
import { NextResponse } from "next/server"
import { pathToRegexp } from "path-to-regexp"
import { getSession } from "./features/auth/utils/auth"

const exemptRoutes = ["/api/auth{/*path}"]

const protectedRoutes = [
  {
    path: "/api{/*path}",
    json: true,
  },
  {
    path: "/dashboard{/*path}",
    roles: [Role.ADMIN, Role.PROFESSOR],
  },
]

const isExemptRoute = (url) => {
  return exemptRoutes.some((route) => {
    const regex = pathToRegexp(route)
    return regex.regexp.test(url)
  })
}

const isProtectedRoute = (url) => {
  return protectedRoutes.find(({ path }) => {
    const regex = pathToRegexp(path)
    return regex.regexp.test(url)
  })
}

export async function middleware(request) {
  const { pathname } = new URL(request.url)

  if (isExemptRoute(pathname)) {
    return NextResponse.next()
  }

  const matchedRoute = isProtectedRoute(pathname)

  if (matchedRoute) {
    const token = request.cookies.get("token")?.value
    const session = await getSession(token)

    if (!session) {
      console.log("Unauthorized")
      if (matchedRoute.json) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (matchedRoute.roles) {
      const userRole = session.payload.role
      const hasRequiredRole = matchedRoute.roles.includes(userRole)

      if (!hasRequiredRole) {
        if (matchedRoute.json) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
        return NextResponse.redirect(new URL("/forbidden", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
