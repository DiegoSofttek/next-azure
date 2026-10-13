import { loadRequiredEnv } from "../env"

const DEFAULT_TIMEOUT_MS = 8_000

interface FunctionsRequestOptions extends RequestInit {
  searchParams?: Record<string, string | undefined>
  timeoutMs?: number
  json?: unknown
  authToken?: string
}

export class FunctionsHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(message)
    this.name = "FunctionsHttpError"
  }
}

function buildRequestUrl(route: string, searchParams?: Record<string, string | undefined>) {
  const baseUrl = loadRequiredEnv("FUNCTIONS_BASE_URL")
  const requestUrl = new URL(route, baseUrl)

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) requestUrl.searchParams.set(key, value)
    }
  }

  return requestUrl
}

function withTimeout(timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  return { signal: controller.signal, clear: () => clearTimeout(timeoutId) }
}

async function functionsFetchResponse(
  route: string,
  { searchParams, timeoutMs, json, authToken, ...init }: FunctionsRequestOptions = {},
) {
  const requestUrl = buildRequestUrl(route, searchParams)
  const timeout = withTimeout(timeoutMs)
  const headers = new Headers(init.headers)

  let body = init.body
  if (json !== undefined) {
    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json")
    }
    body = JSON.stringify(json)
  }

  if (authToken && !headers.has("authorization")) {
    headers.set("authorization", `Bearer ${authToken}`)
  }

  try {
    return await fetch(requestUrl.toString(), {
      cache: "no-store",
      ...init,
      headers,
      body,
      signal: init.signal ?? timeout.signal,
    })
  } finally {
    timeout.clear()
  }
}

export async function functionsFetch<T>(
  route: string,
  options: FunctionsRequestOptions = {},
): Promise<T> {
  const response = await functionsFetchResponse(route, options)
  const contentType = response.headers.get("content-type") ?? ""
  const parsedBody = contentType.includes("application/json")
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new FunctionsHttpError(
      `Functions request failed with status ${response.status}`,
      response.status,
      parsedBody,
    )
  }

  return parsedBody as T
}
