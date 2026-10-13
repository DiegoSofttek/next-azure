import type { HttpRequest, HttpResponseInit } from "@azure/functions"
import { getBearerToken } from "./common"
import { verifyFunctionsToken } from "./verify-functions-token"
import { FunctionsAuthClaims } from "@workspace/shared"

type OkResult = {
  ok: true
  claims: FunctionsAuthClaims
}

type ErrorResult = {
  ok: false
  errorResponse: HttpResponseInit
}

type RequireAuthClaimsResult = OkResult | ErrorResult

export async function requireAuthClaims(request: HttpRequest): Promise<RequireAuthClaimsResult> {
  const bearerToken = getBearerToken(request)
  if (!bearerToken) {
    return {
      ok: false,
      errorResponse: {
        status: 401,
        jsonBody: { message: "Missing bearer token" },
      },
    }
  }

  try {
    const claims = await verifyFunctionsToken(bearerToken)
    return { ok: true, claims }
  } catch {
    return {
      ok: false,
      errorResponse: {
        status: 401,
        jsonBody: { message: "Invalid bearer token" },
      },
    }
  }
}
