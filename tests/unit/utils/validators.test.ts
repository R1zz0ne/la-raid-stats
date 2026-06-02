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

  it('returns error for null data', () => {
    const result = validateCharacter(null)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Неверный формат данных')
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

  it('returns error for name too long', () => {
    const result = validateCharacter({
      name: 'a'.repeat(51),
      gearScore: 1700,
      characterClass: 'bard',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('50'))).toBe(true)
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

  it('returns error for non-number gear score', () => {
    const result = validateCharacter({
      name: 'TestChar',
      gearScore: '1700',
      characterClass: 'bard',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('числом'))).toBe(true)
  })

  it('returns error for too high gear score', () => {
    const result = validateCharacter({
      name: 'TestChar',
      gearScore: 9999999,
      characterClass: 'bard',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('слишком высокий'))).toBe(true)
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

  it('returns error for invalid character class', () => {
    const result = validateCharacter({
      name: 'TestChar',
      gearScore: 1700,
      characterClass: 'invalidClass',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('неверный класс'))).toBe(true)
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

  it('returns error for null data', () => {
    const result = validateDifficulty(null)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Неверный формат данных')
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

  it('returns error for invalid type', () => {
    const result = validateDifficulty({
      type: 'invalid',
      requiredGearScore: 1500,
      regularGold: 100,
      limitedGold: 50,
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('неверный тип'))).toBe(true)
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

  it('returns error for null requiredGearScore', () => {
    const result = validateDifficulty({
      type: 'normal',
      regularGold: 100,
      limitedGold: 50,
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('Укажите требуемый уровень'))).toBe(true)
  })

  it('returns error for non-number requiredGearScore', () => {
    const result = validateDifficulty({
      type: 'normal',
      requiredGearScore: '1500',
      regularGold: 100,
      limitedGold: 50,
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('должен быть числом'))).toBe(true)
  })

  it('returns error for negative requiredGearScore', () => {
    const result = validateDifficulty({
      type: 'normal',
      requiredGearScore: -1,
      regularGold: 100,
      limitedGold: 50,
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('не может быть отрицательным'))).toBe(true)
  })

  it('returns error for null regularGold', () => {
    const result = validateDifficulty({
      type: 'normal',
      requiredGearScore: 1500,
      limitedGold: 50,
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('обычного золота'))).toBe(true)
  })

  it('returns error for non-number regularGold', () => {
    const result = validateDifficulty({
      type: 'normal',
      requiredGearScore: 1500,
      regularGold: '100',
      limitedGold: 50,
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('должно быть числом'))).toBe(true)
  })

  it('returns error for null limitedGold', () => {
    const result = validateDifficulty({
      type: 'normal',
      requiredGearScore: 1500,
      regularGold: 100,
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('лимитированного золота'))).toBe(true)
  })

  it('returns error for non-number limitedGold', () => {
    const result = validateDifficulty({
      type: 'normal',
      requiredGearScore: 1500,
      regularGold: 100,
      limitedGold: '50',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('должно быть числом'))).toBe(true)
  })

  it('returns error for negative limitedGold', () => {
    const result = validateDifficulty({
      type: 'normal',
      requiredGearScore: 1500,
      regularGold: 100,
      limitedGold: -50,
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('не может быть отрицательным'))).toBe(true)
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

  it('returns error for null data', () => {
    const result = validateRaid(null)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Неверный формат данных')
  })

  it('returns error for missing name', () => {
    const result = validateRaid({
      name: null,
      difficulties: [],
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('название'))).toBe(true)
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

  it('returns error for name too long', () => {
    const result = validateRaid({
      name: 'a'.repeat(101),
      difficulties: [],
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('100'))).toBe(true)
  })

  it('returns error for non-array difficulties', () => {
    const result = validateRaid({
      name: 'Test Raid',
      difficulties: 'invalid',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('сложность'))).toBe(true)
  })

  it('returns error for empty difficulties', () => {
    const result = validateRaid({
      name: 'Test Raid',
      difficulties: [],
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('сложность'))).toBe(true)
  })

  it('includes difficulty validation errors', () => {
    const result = validateRaid({
      name: 'Test Raid',
      difficulties: [
        {
          type: 'invalid',
          requiredGearScore: 1500,
          regularGold: 100,
          limitedGold: 50,
        },
      ],
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('Сложность 1'))).toBe(true)
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

  it('returns error when characters is not array', () => {
    const result = validateImportData({
      version: 1,
      characters: 'invalid',
      raids: [],
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('массивом'))).toBe(true)
  })

  it('returns error when raids is not array', () => {
    const result = validateImportData({
      version: 1,
      characters: [],
      raids: 'invalid',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('массивом'))).toBe(true)
  })

  it('includes character validation errors with index', () => {
    const result = validateImportData({
      version: 1,
      characters: [
        {
          id: 'TestChar',
          name: '', // Invalid: empty name
          gearScore: 1700,
          characterClass: 'bard',
          order: 0,
        },
      ],
      raids: [],
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('Персонаж 1'))).toBe(true)
  })

  it('includes raid validation errors with index', () => {
    const result = validateImportData({
      version: 1,
      characters: [],
      raids: [
        {
          id: 'test-raid',
          name: '', // Invalid: empty name
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
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('Рейд 1'))).toBe(true)
  })

  it('returns invalid for non-object data', () => {
    const result = validateImportData(null)
    expect(result.valid).toBe(false)
  })

  it('accumulates multiple errors', () => {
    const result = validateImportData({
      version: 2,
      characters: 'invalid',
      raids: 'invalid',
    })
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThanOrEqual(3)
  })
})