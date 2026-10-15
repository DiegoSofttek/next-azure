import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

const originalEnv = process.env

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('./_components/logout-button', () => ({
  LogoutButton: () => <button type="button">Logout</button>,
}))

describe('app/page', () => {
  beforeEach(() => {
    process.env = { ...originalEnv, TEST_API_KEY: 'test-mock-key' }
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    process.env = originalEnv
  })

  it('renders the home page without throwing and shows primary actions', async () => {
    const { default: Page } = await import('./page')

    render(<Page />)

    expect(screen.getByRole('heading', { level: 1, name: 'Project ready!' })).toBeDefined()
    expect(screen.getByText("You may now add components and start building.")).toBeDefined()
    expect(screen.getByRole('link', { name: 'Go to reference' }).getAttribute('href')).toBe('/reference')
    expect(screen.getByRole('button', { name: 'Logout' })).toBeDefined()
  })
})
