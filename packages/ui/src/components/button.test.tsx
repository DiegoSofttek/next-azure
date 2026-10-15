import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { Button, buttonVariants } from './button'

describe('Button', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('applies destructive variant styling', () => {
    render(<Button variant="destructive">Delete member</Button>)

    const button = screen.getByRole('button', { name: 'Delete member' })

    expect(button.getAttribute('data-variant')).toBe('destructive')
    expect(button.className).toContain('bg-destructive/10')
    expect(button.className).toContain('text-destructive')
    expect(button.className).toContain('hover:bg-destructive/20')
  })

  it('is disabled and does not execute onClick when disabled is true', () => {
    const onClick = vi.fn()

    render(
      <Button disabled onClick={onClick}>
        Enable auto renew
      </Button>
    )

    const button = screen.getByRole('button', { name: 'Enable auto renew' })

    expect(button.hasAttribute('disabled')).toBe(true)

    fireEvent.click(button)

    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders as child and forwards attributes to the slotted element', () => {
    render(
      <Button asChild variant="outline" size="sm">
        <a href="/members/123">View member</a>
      </Button>
    )

    const link = screen.getByRole('link', { name: 'View member' })

    expect(link.getAttribute('href')).toBe('/members/123')
    expect(link.getAttribute('data-variant')).toBe('outline')
    expect(link.getAttribute('data-size')).toBe('sm')
    expect(link.className).toContain('border-border')
  })

  it('returns default classes when buttonVariants is called without overrides', () => {
    const classes = buttonVariants({})

    expect(classes).toContain('bg-primary')
    expect(classes).toContain('text-primary-foreground')
    expect(classes).toContain('h-8')
  })
})
