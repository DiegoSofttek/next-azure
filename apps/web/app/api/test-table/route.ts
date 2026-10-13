import { functionsFetch } from "@/lib/http/functions-client"
import { requireFunctionsAuth } from "@/lib/http/require-functions-auth"
import { TEST_TABLE_ROUTE, type CreateTestTableInput, type TestTableDto } from "@workspace/shared"
import { NextResponse } from "next/server"

interface ListTestTableResponse {
  rows: TestTableDto[]
}

export async function GET() {
  const authResult = await requireFunctionsAuth()
  if (authResult.ok === false) return authResult.errorResponse

  try {
    const data = await functionsFetch<ListTestTableResponse>(TEST_TABLE_ROUTE, {
      authToken: authResult.authToken,
      method: "GET",
    })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: "Function response unavailable." }, { status: 503 })
  }
}

export async function POST(request: Request) {
  const authResult = await requireFunctionsAuth()
  if (authResult.ok === false) return authResult.errorResponse

  try {
    const payload = (await request.json()) as CreateTestTableInput
    const data = await functionsFetch<{ ok: boolean }>(TEST_TABLE_ROUTE, {
      authToken: authResult.authToken,
      method: "POST",
      json: payload,
    })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ message: "Function response unavailable." }, { status: 503 })
  }
}
