import { describe, expect, test } from "vitest"

import { cn } from "./utils"

describe("cn", () => {
  test("combines conditional classes and resolves Tailwind conflicts", () => {
    const result = cn("px-2", false && "hidden", ["text-sm", undefined], {
      "font-medium": true,
      hidden: false,
    }, "px-4")

    expect(result).toBe("text-sm font-medium px-4")
  })
})
