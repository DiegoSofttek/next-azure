import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { AuthTokenPayload, Role, User } from "@workspace/shared"
import type { NextAuthResult } from "next-auth"
import { loadRequiredEnv } from "./lib/env"

const devAuthPassword = process.env.AUTH_DEV_PASSWORD;

const resolveRoleByEmail = (email: string): Role => {
  if (email.startsWith("admin")) return "admin"

  return "user"
}

const result = NextAuth({
  providers: [
    Credentials({
      name: "DevCredentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {

        const email = credentials?.email
        const password = credentials?.password

        // Validate email and password
        if (typeof email !== "string" || !email.trim()) {
          return null
        }

        if (typeof password !== "string" || password !== devAuthPassword) {
          return null
        }

        const user: User = {
          id: "dev-" + email,
          email: email.toLowerCase(),
          name: "Dev User",
          role: resolveRoleByEmail(email.toLowerCase()),
        }

        return user
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const email = user.email ?? ""
        const name = user.name ?? "Dev User"
        const payload: AuthTokenPayload = {
          sub: user.id ?? `dev-${email || "user"}`,
          email,
          name,
          role: ("role" in user && typeof user.role === "string" ? user.role : "user") as Role,
        }
        token.user = payload
      }
      return token
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        }
      }
      return session
    },
  },
  secret: loadRequiredEnv("WEB_AUTH_SECRET"),
}
)


export const handlers: NextAuthResult['handlers'] = result.handlers;
export const auth: NextAuthResult['auth'] = result.auth;
export const signIn: NextAuthResult['signIn'] = result.signIn;
export const signOut: NextAuthResult['signOut'] = result.signOut;