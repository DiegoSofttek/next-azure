import { describe, expect, test } from "vitest"
import { render, screen } from "@testing-library/react"
import { DocumentsExample } from "./documents-example"

describe("DocumentsExample", () => {
  test("renders title and keeps load button disabled without user id", () => {
    render(<DocumentsExample />)

    expect(
      screen.getByRole("heading", { level: 2, name: "Protected documents demo" }),
    ).toBeDefined()

    expect(screen.getByRole("button", { name: "Upload image" })).toBeDefined()
    expect(screen.getByRole("button", { name: "Load my image" })).toHaveProperty("disabled", true)
  })
})
