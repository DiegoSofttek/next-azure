import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import Page from "./page"

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock("./_components/logout-button", () => ({
  LogoutButton: () => <button type="button">Logout</button>,
}))

describe("Home page", () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv, TEST_API_KEY: "test-mock-key" }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    process.env = originalEnv
  })

  test("renders the main content without errors", () => {
    render(<Page />)

    expect(screen.getByRole("heading", { name: "Project ready!" })).toBeDefined()
    expect(screen.getByText("You may now add components and start building.")).toBeDefined()
    expect(screen.getByRole("link", { name: "Go to reference" }).getAttribute("href")).toBe(
      "/reference",
    )
    expect(screen.getByRole("button", { name: "Logout" })).toBeDefined()
  })
})
