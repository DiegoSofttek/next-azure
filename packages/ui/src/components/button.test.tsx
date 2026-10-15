import * as React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Button } from './button'

describe('Button', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders with default button classes and metadata', () => {
    render(<Button>Save changes</Button>)

    const button = screen.getByRole('button', { name: 'Save changes' })

    expect(button.getAttribute('data-slot')).toBe('button')
    expect(button.getAttribute('data-variant')).toBe('default')
    expect(button.getAttribute('data-size')).toBe('default')
    expect(button.className).toContain('inline-flex')
    expect(button.className).toContain('bg-primary')
    expect(button.className).toContain('text-primary-foreground')
    expect(button.className).toContain('h-8')
  })

  it('applies destructive variant styles when requested', () => {
    render(<Button variant="destructive">Delete member</Button>)

    const button = screen.getByRole('button', { name: 'Delete member' })

    expect(button.getAttribute('data-variant')).toBe('destructive')
    expect(button.className).toContain('bg-destructive/10')
    expect(button.className).toContain('text-destructive')
    expect(button.className).toContain('hover:bg-destructive/20')
    expect(button.className).toContain('focus-visible:border-destructive/40')
  })

  it('is disabled and does not execute onClick when disabled is true', () => {
    const handleClick = vi.fn()

    render(
      <Button disabled onClick={handleClick}>
        Enable auto-renew
      </Button>
    )

    const button = screen.getByRole('button', { name: 'Enable auto-renew' }) as HTMLButtonElement

    expect(button.disabled).toBe(true)

    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders child element props through slot mode', () => {
    render(
      <Button asChild variant="outline" size="sm">
        <a href="/members/123">View member</a>
      </Button>
    )

    const link = screen.getByRole('link', { name: 'View member' })

    expect(link.getAttribute('data-slot')).toBe('button')
    expect(link.getAttribute('data-variant')).toBe('outline')
    expect(link.getAttribute('data-size')).toBe('sm')
    expect(link.getAttribute('href')).toBe('/members/123')
  })
})
