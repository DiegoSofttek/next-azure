import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"
import { createTestTableRow, listTestTableRows } from "@workspace/db"
import type { CreateTestTableInput } from "@workspace/shared"
import { requireAuthClaims } from "../lib/auth/require-auth-claims"

export async function TestTableHttpTrigger(
  request: HttpRequest,
  _context: InvocationContext,
): Promise<HttpResponseInit> {
  const authResult = await requireAuthClaims(request)
  if (authResult.ok === false) return authResult.errorResponse

  if (request.method === "GET") {
    const rows = await listTestTableRows()
    return {
      jsonBody: { rows },
      headers: { "Content-Type": "application/json" },
    }
  }

  if (request.method === "POST") {
    const body = (await request.json()) as CreateTestTableInput
    await createTestTableRow({
      projectName: body.projectName,
      environment: body.environment,
      integrations: body.integrations.join(","),
    })
    return {
      status: 201,
      jsonBody: { ok: true },
      headers: { "Content-Type": "application/json" },
    }
  }

  return { status: 405 }
}

app.http("TestTableHttpTrigger", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "test-table",
  handler: TestTableHttpTrigger,
})
