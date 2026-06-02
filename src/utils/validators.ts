// Lost Ark Raid Tracker - Validators
// ==================================

import type {
  ValidationResult,
} from '@/types'
import { CHARACTER_CLASSES } from '@/constants/characterClasses'
import { DIFFICULTY_TYPES } from '@/constants/difficultyTypes'
import {
  MAX_CHARACTER_NAME_LENGTH,
  MAX_RAID_NAME_LENGTH,
  MAX_GEAR_SCORE,
} from '@/constants'

// Validate character form data
export function validateCharacter(data: unknown): ValidationResult {
  const errors: string[] = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Неверный формат данных'] }
  }

  const charData = data as Record<string, unknown>

  // Name validation
  if (!charData.name || typeof charData.name !== 'string') {
    errors.push('Укажите имя персонажа')
  } else if (charData.name.trim().length === 0) {
    errors.push('Имя персонажа не может быть пустым')
  } else if (charData.name.trim().length > MAX_CHARACTER_NAME_LENGTH) {
    errors.push(`Имя должно содержать не более ${MAX_CHARACTER_NAME_LENGTH} символов`)
  }

  // Gear score validation
  if (charData.gearScore === undefined || charData.gearScore === null) {
    errors.push('Укажите уровень персонажа')
  } else if (typeof charData.gearScore !== 'number') {
    errors.push('Уровень должен быть числом')
  } else if (charData.gearScore < 0) {
    errors.push('Уровень не может быть отрицательным')
  } else if (charData.gearScore > MAX_GEAR_SCORE) {
    errors.push('Уровень слишком высокий')
  }

  // Class validation
  if (!charData.characterClass) {
    errors.push('Выберите класс персонажа')
  } else if (!CHARACTER_CLASSES.some(c => c.value === charData.characterClass)) {
    errors.push('Выбран неверный класс')
  }

  // Custom class name validation (if class is 'custom')
  if (charData.characterClass === 'custom') {
    if (!charData.customClassName || typeof charData.customClassName !== 'string' || charData.customClassName.trim().length === 0) {
      errors.push('Введите название класса')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Validate difficulty form data
export function validateDifficulty(data: unknown): ValidationResult {
  const errors: string[] = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Неверный формат данных'] }
  }

  const diffData = data as Record<string, unknown>

  // Type validation
  if (!diffData.type) {
    errors.push('Выберите тип сложности')
  } else if (!DIFFICULTY_TYPES.some(d => d.value === diffData.type)) {
    errors.push('Выбран неверный тип сложности')
  }

  // Required gear score validation
  if (diffData.requiredGearScore === undefined || diffData.requiredGearScore === null) {
    errors.push('Укажите требуемый уровень')
  } else if (typeof diffData.requiredGearScore !== 'number') {
    errors.push('Требуемый уровень должен быть числом')
  } else if (diffData.requiredGearScore < 0) {
    errors.push('Требуемый уровень не может быть отрицательным')
  }

  // Regular gold validation
  if (diffData.regularGold === undefined || diffData.regularGold === null) {
    errors.push('Укажите количество обычного золота')
  } else if (typeof diffData.regularGold !== 'number') {
    errors.push('Обычное золото должно быть числом')
  } else if (diffData.regularGold < 0) {
    errors.push('Обычное золото не может быть отрицательным')
  }

  // Limited gold validation
  if (diffData.limitedGold === undefined || diffData.limitedGold === null) {
    errors.push('Укажите количество лимитированного золота')
  } else if (typeof diffData.limitedGold !== 'number') {
    errors.push('Лимитированное золото должно быть числом')
  } else if (diffData.limitedGold < 0) {
    errors.push('Лимитированное золото не может быть отрицательным')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Validate raid form data
export function validateRaid(data: unknown): ValidationResult {
  const errors: string[] = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Неверный формат данных'] }
  }

  const raidData = data as Record<string, unknown>

  // Name validation
  if (!raidData.name || typeof raidData.name !== 'string') {
    errors.push('Укажите название рейда')
  } else if (raidData.name.trim().length === 0) {
    errors.push('Название рейда не может быть пустым')
  } else if (raidData.name.trim().length > MAX_RAID_NAME_LENGTH) {
    errors.push(`Название должно содержать не более ${MAX_RAID_NAME_LENGTH} символов`)
  }

  // Difficulties validation
  if (!Array.isArray(raidData.difficulties)) {
    errors.push('Добавьте хотя бы одну сложность')
  } else if (raidData.difficulties.length === 0) {
    errors.push('Добавьте хотя бы одну сложность')
  } else {
    raidData.difficulties.forEach((diff: unknown, index: number) => {
      const result = validateDifficulty(diff)
      if (!result.valid) {
        result.errors.forEach(err => errors.push(`Сложность ${index + 1}: ${err}`))
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Validate export data (for import)
export function validateImportData(data: unknown): ValidationResult {
  const errors: string[] = []

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Неверный формат данных'] }
  }

  const exportData = data as Record<string, unknown>

  // Version check
  if (exportData.version !== 1) {
    errors.push('Неподдерживаемая версия экспорта')
  }

  // Characters validation
  if (!Array.isArray(exportData.characters)) {
    errors.push('Персонажи должны быть массивом')
  } else {
    exportData.characters.forEach((char: unknown, index: number) => {
      const result = validateCharacter(char)
      if (!result.valid) {
        result.errors.forEach(err => errors.push(`Персонаж ${index + 1}: ${err}`))
      }
    })
  }

  // Raids validation
  if (!Array.isArray(exportData.raids)) {
    errors.push('Рейды должны быть массивом')
  } else {
    exportData.raids.forEach((raid: unknown, index: number) => {
      const result = validateRaid(raid)
      if (!result.valid) {
        result.errors.forEach(err => errors.push(`Рейд ${index + 1}: ${err}`))
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}