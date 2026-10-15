import { afterEach, describe, expect, test, vi } from "vitest"

import { cn } from "./utils"

describe("cn", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test("combines conditional classes and resolves Tailwind conflicts", () => {
    const isActive = true

    const result = cn("px-2", isActive && "text-sm", undefined, "px-4", ["font-medium", false && "hidden"])

    expect(result).toBe("text-sm px-4 font-medium")
  })
})
