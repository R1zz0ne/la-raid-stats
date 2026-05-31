// Unit tests for validators

import { describe, it, expect } from 'vitest'
import {
  validateCharacter,
  validateDifficulty,
  validateRaid,
  validateImportData,
} from '@/utils/validators'

describe('validateCharacter', () => {
  it('returns valid for correct data', () => {
    const result = validateCharacter({
      name: 'TestChar',
      gearScore: 1700,
      characterClass: 'bard',
    })
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('returns error for missing name', () => {
    const result = validateCharacter({
      name: '',
      gearScore: 1700,
      characterClass: 'bard',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.toLowerCase().includes('имя'))).toBe(true)
  })

  it('returns error for negative gear score', () => {
    const result = validateCharacter({
      name: 'TestChar',
      gearScore: -100,
      characterClass: 'bard',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('Уровень'))).toBe(true)
  })

  it('returns error for custom class without name', () => {
    const result = validateCharacter({
      name: 'TestChar',
      gearScore: 1700,
      characterClass: 'custom',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('класса'))).toBe(true)
  })

  it('passes for custom class with name', () => {
    const result = validateCharacter({
      name: 'TestChar',
      gearScore: 1700,
      characterClass: 'custom',
      customClassName: 'My Custom Class',
    })
    expect(result.valid).toBe(true)
  })
})

describe('validateDifficulty', () => {
  it('returns valid for correct difficulty', () => {
    const result = validateDifficulty({
      type: 'normal',
      requiredGearScore: 1500,
      regularGold: 100,
      limitedGold: 50,
    })
    expect(result.valid).toBe(true)
  })

  it('returns error for missing type', () => {
    const result = validateDifficulty({
      requiredGearScore: 1500,
      regularGold: 100,
      limitedGold: 50,
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('сложности'))).toBe(true)
  })

  it('returns error for negative gold', () => {
    const result = validateDifficulty({
      type: 'normal',
      requiredGearScore: 1500,
      regularGold: -100,
      limitedGold: 50,
    })
    expect(result.valid).toBe(false)
  })
})

describe('validateRaid', () => {
  it('returns valid for raid with difficulties', () => {
    const result = validateRaid({
      name: 'Test Raid',
      difficulties: [
        {
          type: 'normal',
          requiredGearScore: 1500,
          regularGold: 100,
          limitedGold: 50,
        },
      ],
    })
    expect(result.valid).toBe(true)
  })

  it('returns error for empty name', () => {
    const result = validateRaid({
      name: '',
      difficulties: [
        {
          type: 'normal',
          requiredGearScore: 1500,
          regularGold: 100,
          limitedGold: 50,
        },
      ],
    })
    expect(result.valid).toBe(false)
  })

  it('returns error for empty difficulties', () => {
    const result = validateRaid({
      name: 'Test Raid',
      difficulties: [],
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('сложность'))).toBe(true)
  })
})

describe('validateImportData', () => {
  it('returns valid for correct export data', () => {
    const result = validateImportData({
      version: 1,
      characters: [
        {
          id: 'TestChar',
          name: 'TestChar',
          gearScore: 1700,
          characterClass: 'bard',
          order: 0,
        },
      ],
      raids: [
        {
          id: 'test-raid',
          name: 'Test Raid',
          difficulties: [
            {
              type: 'normal',
              requiredGearScore: 1500,
              regularGold: 100,
              limitedGold: 50,
            },
          ],
        },
      ],
    })
    expect(result.valid).toBe(true)
  })

  it('returns error for unsupported version', () => {
    const result = validateImportData({
      version: 2,
      characters: [],
      raids: [],
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('версия'))).toBe(true)
  })
})