import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { Button } from "./button"

describe("Button", () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv, TEST_API_KEY: "test-mock-key" }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    process.env = originalEnv
  })

  test("renders with default classes and attributes", () => {
    render(<Button>Guardar</Button>)

    const button = screen.getByRole("button", { name: "Guardar" })

    expect(button.getAttribute("data-slot")).toBe("button")
    expect(button.getAttribute("data-variant")).toBe("default")
    expect(button.getAttribute("data-size")).toBe("default")
    expect(button.className).toContain("inline-flex")
    expect(button.className).toContain("bg-primary")
    expect(button.className).toContain("h-8")
  })

  test("applies destructive variant and honors disabled state", () => {
    const handleClick = vi.fn()

    render(
      <Button variant="destructive" disabled onClick={handleClick}>
        Eliminar
      </Button>,
    )

    const button = screen.getByRole("button", { name: "Eliminar" })
    fireEvent.click(button)

    expect((button as HTMLButtonElement).disabled).toBe(true)
    expect(button.getAttribute("data-variant")).toBe("destructive")
    expect(button.className).toContain("bg-destructive/10")
    expect(handleClick).not.toHaveBeenCalled()
  })
})
