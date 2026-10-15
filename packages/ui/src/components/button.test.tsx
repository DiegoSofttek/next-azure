import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import { Button } from "./button"

describe("Button", () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
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

  test("applies destructive variant and prevents click when disabled", () => {
    const onClick = vi.fn()

    render(
      <Button variant="destructive" disabled onClick={onClick}>
        Eliminar
      </Button>,
    )

    const button = screen.getByRole("button", { name: "Eliminar" })
    fireEvent.click(button)

    expect(button.getAttribute("data-variant")).toBe("destructive")
    expect((button as HTMLButtonElement).disabled).toBe(true)
    expect(button.className).toContain("bg-destructive/10")
    expect(button.className).toContain("disabled:pointer-events-none")
    expect(onClick).not.toHaveBeenCalled()
  })
})
