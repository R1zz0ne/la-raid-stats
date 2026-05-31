// Lost Ark Raid Tracker - Difficulty Types Constants
// =================================================

import type { DifficultyType, DifficultyTypeConfig } from '@/types'

// Difficulty types with order (for sorting: nightmare -> solo)
export const DIFFICULTY_TYPES: DifficultyTypeConfig[] = [
  { value: 'nightmare', label: 'Кошмар', order: 1, color: 'var(--color-difficulty-nightmare)' },
  { value: 'heroic', label: 'Героический', order: 2, color: 'var(--color-difficulty-heroic)' },
  { value: 'normal', label: 'Обычный', order: 3, color: 'var(--color-difficulty-normal)' },
  { value: 'solo', label: 'Одиночный', order: 4, color: 'var(--color-difficulty-solo)' },
]

// Get difficulty config by type
export function getDifficultyConfig(type: DifficultyType): DifficultyTypeConfig | undefined {
  return DIFFICULTY_TYPES.find(d => d.value === type)
}

// Sort difficulties by order (descending: nightmare first)
export function sortDifficultiesByOrder<T extends { type: DifficultyType }>(difficulties: T[]): T[] {
  return [...difficulties].sort((a, b) => {
    const orderA = getDifficultyConfig(a.type)?.order ?? 99
    const orderB = getDifficultyConfig(b.type)?.order ?? 99
    return orderA - orderB
  })
}