import { SignJWT } from "jose"
import {
  FUNCTIONS_AUTH_AUDIENCE,
  FUNCTIONS_AUTH_ISSUER,
  type AuthTokenPayload,
  type FunctionsAuthClaims,
} from "@workspace/shared"
import { loadRequiredEnv } from "../env"

const encoder = new TextEncoder()

function getFunctionsAuthSecret() {
  return encoder.encode(loadRequiredEnv("FUNCTIONS_AUTH_SECRET"))
}

export function toFunctionsAuthClaims(payload: AuthTokenPayload): FunctionsAuthClaims {
  return {
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
  }
}

export async function createFunctionsAccessToken(claims: FunctionsAuthClaims): Promise<string> {
  return await new SignJWT({ email: claims.email, role: claims.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(claims.sub)
    .setIssuer(FUNCTIONS_AUTH_ISSUER)
    .setAudience(FUNCTIONS_AUTH_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(getFunctionsAuthSecret())
}
