import { auth } from "@/auth"
import { createFunctionsAccessToken, toFunctionsAuthClaims } from "./functions-auth"
import { NextResponse } from "next/server"

type OkResult = {
  ok: true
  authToken: string
}

type ErrorResult = {
  ok: false
  errorResponse: NextResponse
}

type RequireFunctionsAuthResult = OkResult | ErrorResult

export async function requireFunctionsAuth(): Promise<RequireFunctionsAuthResult> {
  const session = await auth()
  if (!session?.user) {
    return {
      ok: false,
      errorResponse: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    }
  }

  try {
    const authToken = await createFunctionsAccessToken(toFunctionsAuthClaims(session.user))

    return { ok: true, authToken }
  } catch {
    return {
      ok: false,
      errorResponse: NextResponse.json({ message: "Failed to create functions access token" }, { status: 500 }),
    }
  }
}
