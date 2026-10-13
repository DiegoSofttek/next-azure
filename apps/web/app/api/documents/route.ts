import { auth } from "@/auth"
import { functionsFetch } from "@/lib/http/functions-client"
import { requireFunctionsAuth } from "@/lib/http/require-functions-auth"
import {
  DOCUMENTS_ROUTE,
  type GetDocumentUrlResponse,
  type UploadDocumentInput,
  type UploadDocumentResponse,
} from "@workspace/shared"
import { NextResponse } from "next/server"

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const IMAGE_CONTENT_TYPE_PREFIX = "image/"

async function authorizeRequest() {
  const session = await auth()
  if (!session?.user) {
    return { ok: false as const, response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) }
  }

  const authResult = await requireFunctionsAuth()
  if (authResult.ok === false) {
    return { ok: false as const, response: authResult.errorResponse }
  }

  return {
    ok: true as const,
    session,
    authToken: authResult.authToken,
  }
}

function toBase64(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64")
}

export async function POST(request: Request) {
  const authorization = await authorizeRequest()
  if (!authorization.ok) {
    return authorization.response
  }

  const { session, authToken } = authorization

  const formData = await request.formData()
  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "file is required" }, { status: 400 })
  }
  if (!file.type.startsWith(IMAGE_CONTENT_TYPE_PREFIX)) {
    return NextResponse.json({ message: "Only image uploads are allowed" }, { status: 400 })
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ message: "File exceeds 5MB limit" }, { status: 400 })
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer())
    const payload: UploadDocumentInput = {
      userId: session.user.sub,
      fileName: file.name,
      contentType: file.type,
      base64Data: toBase64(bytes),
    }

    const data = await functionsFetch<UploadDocumentResponse>(DOCUMENTS_ROUTE, {
      authToken,
      method: "POST",
      json: payload,
      timeoutMs: 20_000,
    })

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ message: "Function response unavailable." }, { status: 503 })
  }
}

export async function GET(request: Request) {
  const authorization = await authorizeRequest()
  if (!authorization.ok) {
    return authorization.response
  }

  const { session, authToken } = authorization

  const requestUrl = new URL(request.url)
  const userId = requestUrl.searchParams.get("userId")
  const blobName = requestUrl.searchParams.get("blobName")
  if (!userId || !blobName) {
    return NextResponse.json({ message: "userId and blobName are required" }, { status: 400 })
  }

  // Next route authorization layer: only owner can request document URL.
  if (userId !== session.user.sub) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  try {
    const data = await functionsFetch<GetDocumentUrlResponse>(DOCUMENTS_ROUTE, {
      authToken,
      method: "GET",
      searchParams: { userId, blobName },
    })

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: "Function response unavailable." }, { status: 503 })
  }
}
