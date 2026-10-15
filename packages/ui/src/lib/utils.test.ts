import { afterEach, describe, expect, it, vi } from 'vitest'

import { cn } from './utils'

describe('cn', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('combines conditional classes and resolves Tailwind conflicts', () => {
    const result = cn('px-2', false && 'hidden', ['text-sm', null], {
      'px-4': true,
      'text-lg': true,
      'font-medium': true,
    })

    expect(result).toBe('px-4 text-lg font-medium')
  })
})
