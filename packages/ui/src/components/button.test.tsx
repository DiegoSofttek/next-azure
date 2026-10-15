import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import { Button } from "./button"

describe("Button", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test("renders with default button classes", () => {
    render(<Button>Guardar</Button>)

    const button = screen.getByRole("button", { name: "Guardar" })

    expect(button.getAttribute("data-slot")).toBe("button")
    expect(button.getAttribute("data-variant")).toBe("default")
    expect(button.getAttribute("data-size")).toBe("default")
    expect(button.className).toContain("inline-flex")
    expect(button.className).toContain("bg-primary")
    expect(button.className).toContain("h-8")
  })

  test("applies destructive variant and prevents click events when disabled", () => {
    const handleClick = vi.fn()

    render(
      <Button variant="destructive" disabled onClick={handleClick}>
        Eliminar
      </Button>,
    )

    const button = screen.getByRole("button", { name: "Eliminar" })

    expect(button.className).toContain("bg-destructive/10")
    expect(button).toHaveProperty("disabled", true)

    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })
})
