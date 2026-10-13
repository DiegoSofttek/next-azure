import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"
import { generateDownloadUrl, uploadFile } from "@workspace/db"
import type {
  GetDocumentUrlInput,
  GetDocumentUrlResponse,
  UploadDocumentInput,
  UploadDocumentResponse,
} from "@workspace/shared"
import { requireAuthClaims } from "../lib/auth/require-auth-claims"

const IMAGE_CONTENT_TYPE_PREFIX = "image/"

function createBlobName(userId: string, fileName: string) {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-")
  return `${userId}/${Date.now()}-${safeName}`
}

function isOwnerPath(userId: string, blobName: string) {
  return blobName.startsWith(`${userId}/`)
}

export async function DocumentsHttpTrigger(
  request: HttpRequest,
  _context: InvocationContext,
): Promise<HttpResponseInit> {
  const authResult = await requireAuthClaims(request)
  if (authResult.ok === false) return authResult.errorResponse

  const { claims } = authResult

  if (request.method === "POST") {
    const body = (await request.json()) as UploadDocumentInput
    if (body.userId !== claims.sub) {
      return { status: 403, jsonBody: { message: "Forbidden" } }
    }
    if (!body.contentType.startsWith(IMAGE_CONTENT_TYPE_PREFIX)) {
      return { status: 400, jsonBody: { message: "Only image uploads are allowed" } }
    }

    const blobName = createBlobName(body.userId, body.fileName)
    await uploadFile("documents", blobName, Buffer.from(body.base64Data, "base64"), body.contentType)

    const response: UploadDocumentResponse = { blobName }
    return { status: 201, jsonBody: response, headers: { "Content-Type": "application/json" } }
  }

  if (request.method === "GET") {
    const userId = request.query.get("userId")
    const blobName = request.query.get("blobName")

    if (!userId || !blobName) {
      return { status: 400, jsonBody: { message: "userId and blobName are required" } }
    }
    if (userId !== claims.sub || !isOwnerPath(userId, blobName)) {
      return { status: 403, jsonBody: { message: "Forbidden" } }
    }

    const input: GetDocumentUrlInput = { userId, blobName }
    const url = await generateDownloadUrl("documents", input.blobName, 10)
    const response: GetDocumentUrlResponse = { url }
    return { jsonBody: response, headers: { "Content-Type": "application/json" } }
  }

  return { status: 405 }
}

app.http("DocumentsHttpTrigger", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  route: "documents",
  handler: DocumentsHttpTrigger,
})
