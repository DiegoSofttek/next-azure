import { render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

const originalEnv = process.env

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock("next-auth/react", () => ({
  signOut: vi.fn().mockResolvedValue(undefined),
}))

import Page from "./page"

describe("Page", () => {
  beforeEach(() => {
    process.env = { ...originalEnv, TEST_API_KEY: "test-mock-key" }
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  test("renders the main page content without errors", () => {
    render(<Page />)

    expect(screen.getByRole("heading", { name: "Project ready!" })).toBeDefined()
    expect(screen.getByText("You may now add components and start building.")).toBeDefined()
    expect(screen.getByRole("link", { name: "Go to reference" }).getAttribute("href")).toBe(
      "/reference",
    )
    expect(screen.getByRole("button", { name: "Logout" })).toBeDefined()
  })
})
