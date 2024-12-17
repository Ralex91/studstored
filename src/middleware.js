import { Role } from "@prisma/client"
import { NextResponse } from "next/server"
import { pathToRegexp } from "path-to-regexp"
import { getSession } from "./features/auth/utils/auth"

const exemptRoutes = [
  {
    path: "/api/auth{/*path}",
  },
]

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

const matchRoute = (url, routes) => {
  return routes.find(({ path }) => {
    const regex = pathToRegexp(path)
    return regex.regexp.test(url)
  })
}

export async function middleware(request) {
  const { pathname } = new URL(request.url)

  if (matchRoute(pathname, exemptRoutes)) {
    return NextResponse.next()
  }

  const matchedRoute = matchRoute(pathname, protectedRoutes)

  if (matchedRoute) {
    const token = request.cookies.get("token")?.value
    const session = await getSession(token)

    if (!session) {
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
