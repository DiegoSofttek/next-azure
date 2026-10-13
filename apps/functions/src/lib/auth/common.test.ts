import { describe, expect, test } from "vitest"
import { getBearerToken } from "./common"

describe("getBearerToken", () => {
  test("returns token when authorization header is Bearer", () => {
    const request = {
      headers: new Headers({ authorization: "Bearer abc123" }),
    } as any

    expect(getBearerToken(request)).toBe("abc123")
  })
})