import type { AuthTokenPayload } from "@workspace/shared"

declare module "next-auth" {
  interface Session {
    user: AuthTokenPayload
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: AuthTokenPayload
  }
}
