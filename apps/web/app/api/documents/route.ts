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

function toBase64(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64")
}

async function requireDocumentAccess() {
  const session = await auth()
  if (!session?.user) {
    return {
      ok: false as const,
      errorResponse: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    }
  }


  const authResult = await requireFunctionsAuth()
  if (authResult.ok === false) return authResult

  return { ok: true as const, userId: session.user.sub, authToken: authResult.authToken }
}

export async function POST(request: Request) {
  const access = await requireDocumentAccess()
  if (access.ok === false) return access.errorResponse

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
      userId: access.userId,
      fileName: file.name,
      contentType: file.type,
      base64Data: toBase64(bytes),
    }

    const data = await functionsFetch<UploadDocumentResponse>(DOCUMENTS_ROUTE, {
      authToken: access.authToken,
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
  const access = await requireDocumentAccess()
  if (access.ok === false) return access.errorResponse

  const requestUrl = new URL(request.url)
  const userId = requestUrl.searchParams.get("userId")
  const blobName = requestUrl.searchParams.get("blobName")
  if (!userId || !blobName) {
    return NextResponse.json({ message: "userId and blobName are required" }, { status: 400 })
  }

  // Next route authorization layer: only owner can request document URL.
  if (userId !== access.userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  try {
    const data = await functionsFetch<GetDocumentUrlResponse>(DOCUMENTS_ROUTE, {
      authToken: access.authToken,
      method: "GET",
      searchParams: { userId, blobName },
    })

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: "Function response unavailable." }, { status: 503 })
  }
}
