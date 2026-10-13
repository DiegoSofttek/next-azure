import { jwtVerify } from "jose"
import {
  FUNCTIONS_AUTH_AUDIENCE,
  FUNCTIONS_AUTH_ISSUER,
  type FunctionsAuthClaims,
  type Role,
} from "@workspace/shared"
import { loadEnv } from "../envs"

const encoder = new TextEncoder()

function getFunctionsAuthSecret() {
  const secret = loadEnv("FUNCTIONS_AUTH_SECRET")

  return encoder.encode(secret)
}

export async function verifyFunctionsToken(token: string): Promise<FunctionsAuthClaims> {
  const { payload } = await jwtVerify(token, getFunctionsAuthSecret(), {
    issuer: FUNCTIONS_AUTH_ISSUER,
    audience: FUNCTIONS_AUTH_AUDIENCE,
  })

  const sub = payload.sub
  const email = payload.email
  const role = payload.role

  if (typeof sub !== "string" || typeof email !== "string" || typeof role !== "string") {
    throw new Error("Invalid token payload")
  }

  return { sub, email, role: role as Role }
}
