import { afterEach, describe, expect, it, vi } from 'vitest'

import { cn } from './utils'

describe('cn', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('combines conditional classes and merges Tailwind conflicts', () => {
    const result = cn(
      'px-2 text-left',
      false && 'hidden',
      undefined,
      ['bg-primary', { 'font-semibold': true, 'text-right': true }],
      'px-4',
    )

    expect(result).toBe('bg-primary font-semibold text-right px-4')
  })
})
