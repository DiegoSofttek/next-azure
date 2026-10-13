import type { Role } from "@workspace/shared"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const authRoutes = new Set(["/login"]);
const publicRoutes = new Set<string>([]);

// Add protected path prefixes here as role checks are introduced.
const roleProtectedRoutePrefixes: Record<string, Role[]> = {
  // "/admin": ["admin"],
}

const matchesRoutePrefix = (pathname: string, prefix: string): boolean => {
  if (pathname === prefix) return true
  return pathname.startsWith(`${prefix}/`)
}

const canAccessByRole = (pathname: string, role: Role | null): boolean => {
  for (const [prefix, requiredRoles] of Object.entries(roleProtectedRoutePrefixes)) {
    if (!matchesRoutePrefix(pathname, prefix)) continue
    if (!role) return false

    return requiredRoles.includes(role)
  }
  return true
}

export async function proxy(req: NextRequest) {
  const { nextUrl } = req
  const pathname = nextUrl.pathname
  const token = await getToken({
    req,
    secret: process.env.WEB_AUTH_SECRET,
  })
  const isAuthenticated = Boolean(token)
  const userRole =
    token &&
      typeof token === "object" &&
      "user" in token &&
      token.user &&
      typeof token.user === "object" &&
      "role" in token.user &&
      typeof token.user.role === "string"
      ? (token.user.role as Role)
      : null

  if (authRoutes.has(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  if (!isAuthenticated && !publicRoutes.has(pathname) && !authRoutes.has(pathname)) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  if (isAuthenticated && !canAccessByRole(pathname, userRole)) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Apply auth checks to all app routes except:
     * - Next internals
     * - static assets
     * - NextAuth API routes
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
