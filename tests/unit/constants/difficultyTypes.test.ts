// Tests for difficultyTypes constants and functions

import { describe, it, expect } from 'vitest'
import {
  DIFFICULTY_TYPES,
  getDifficultyConfig,
  sortDifficultiesByOrder,
} from '@/constants/difficultyTypes'
import type { DifficultyType } from '@/types'

describe('DIFFICULTY_TYPES', () => {
  it('contains all difficulty types', () => {
    const values = DIFFICULTY_TYPES.map(d => d.value)
    expect(values).toContain('nightmare')
    expect(values).toContain('heroic')
    expect(values).toContain('normal')
    expect(values).toContain('solo')
  })

  it('has correct order values', () => {
    const nightmare = DIFFICULTY_TYPES.find(d => d.value === 'nightmare')
    const heroic = DIFFICULTY_TYPES.find(d => d.value === 'heroic')
    const normal = DIFFICULTY_TYPES.find(d => d.value === 'normal')
    const solo = DIFFICULTY_TYPES.find(d => d.value === 'solo')

    expect(nightmare?.order).toBeLessThan(heroic?.order ?? 99)
    expect(heroic?.order).toBeLessThan(normal?.order ?? 99)
    expect(normal?.order).toBeLessThan(solo?.order ?? 99)
  })

  it('has labels for all types', () => {
    DIFFICULTY_TYPES.forEach(difficulty => {
      expect(difficulty.label).toBeTruthy()
      expect(typeof difficulty.label).toBe('string')
    })
  })

  it('has color for all types', () => {
    DIFFICULTY_TYPES.forEach(difficulty => {
      expect(difficulty.color).toBeTruthy()
      expect(difficulty.color).toMatch(/^var\(/)
    })
  })
})

describe('getDifficultyConfig', () => {
  it('returns config for valid type', () => {
    const config = getDifficultyConfig('nightmare')
    expect(config).toBeDefined()
    expect(config?.value).toBe('nightmare')
    expect(config?.label).toBe('Кошмар')
  })

  it('returns config for heroic', () => {
    const config = getDifficultyConfig('heroic')
    expect(config).toBeDefined()
    expect(config?.label).toBe('Героический')
  })

  it('returns config for normal', () => {
    const config = getDifficultyConfig('normal')
    expect(config).toBeDefined()
    expect(config?.label).toBe('Обычный')
  })

  it('returns config for solo', () => {
    const config = getDifficultyConfig('solo')
    expect(config).toBeDefined()
    expect(config?.label).toBe('Одиночный')
  })

  it('returns undefined for invalid type', () => {
    const config = getDifficultyConfig('invalid' as DifficultyType)
    expect(config).toBeUndefined()
  })
})

describe('sortDifficultiesByOrder', () => {
  it('sorts difficulties by order (nightmare first)', () => {
    const difficulties = [
      { type: 'solo' as DifficultyType },
      { type: 'nightmare' as DifficultyType },
      { type: 'normal' as DifficultyType },
      { type: 'heroic' as DifficultyType },
    ]

    const sorted = sortDifficultiesByOrder(difficulties)

    expect(sorted[0].type).toBe('nightmare')
    expect(sorted[1].type).toBe('heroic')
    expect(sorted[2].type).toBe('normal')
    expect(sorted[3].type).toBe('solo')
  })

  it('does not mutate original array', () => {
    const original = [
      { type: 'nightmare' as DifficultyType },
      { type: 'solo' as DifficultyType },
    ]

    const originalCopy = [...original]
    sortDifficultiesByOrder(original)

    expect(original[0].type).toBe(originalCopy[0].type)
    expect(original[1].type).toBe(originalCopy[1].type)
  })

  it('handles empty array', () => {
    const sorted = sortDifficultiesByOrder([])
    expect(sorted).toEqual([])
  })

  it('handles single item', () => {
    const sorted = sortDifficultiesByOrder([{ type: 'heroic' as DifficultyType }])
    expect(sorted).toHaveLength(1)
    expect(sorted[0].type).toBe('heroic')
  })

  it('handles unknown difficulty types with fallback order', () => {
    const difficulties = [
      { type: 'nightmare' as DifficultyType },
      { type: 'invalid' as DifficultyType },
      { type: 'normal' as DifficultyType },
    ]

    const sorted = sortDifficultiesByOrder(difficulties)

    // Unknown type should be last (order 99)
    expect(sorted[sorted.length - 1].type).toBe('invalid')
  })
})