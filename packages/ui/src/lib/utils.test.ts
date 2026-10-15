import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv, TEST_API_KEY: "test-mock-key" }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    process.env = originalEnv
  })

  test("combines conditional classes and resolves Tailwind conflicts", () => {
    const className = cn("px-2", false && "hidden", "px-4", undefined, "text-sm", {
      "font-bold": true,
      "opacity-50": false,
    })

    expect(className).toBe("px-4 text-sm font-bold")
  })
})
