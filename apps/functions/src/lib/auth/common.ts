import { HttpRequest } from "@azure/functions"

export function getBearerToken(request: HttpRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }

  return authHeader.slice("Bearer ".length).trim()
}