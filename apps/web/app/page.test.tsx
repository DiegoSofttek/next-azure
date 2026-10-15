import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const originalEnv = process.env

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}))

import Page from './page'

describe('Home page', () => {
  beforeEach(() => {
    process.env = { ...originalEnv, TEST_API_KEY: 'test-mock-key' }
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    process.env = originalEnv
  })

  it('renders the main content without throwing', () => {
    render(<Page />)

    expect(screen.getByRole('heading', { level: 1, name: 'Project ready!' })).toBeDefined()
    expect(screen.getByText("You may now add components and start building.")).toBeDefined()
    expect(screen.getByRole('link', { name: 'Go to reference' }).getAttribute('href')).toBe('/reference')
    expect(screen.getByRole('button', { name: 'Logout' })).toBeDefined()
  })
})
