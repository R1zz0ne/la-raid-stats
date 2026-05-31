// Lost Ark Raid Tracker - Constants
// =================================

import type { CharacterClass, CharacterClassConfig } from '@/types'

// Character classes with labels
export const CHARACTER_CLASSES: CharacterClassConfig[] = [
  { value: 'berserker', label: 'Берсеркер' },
  { value: 'destroyer', label: 'Разрушитель' },
  { value: 'warrior', label: 'Воин' },
  { value: 'holyknight', label: 'Паладин' },
  { value: 'battlemaster', label: 'Боевой Мастер' },
  { value: 'infighter', label: 'Борец' },
  { value: 'soulmaster', label: 'Мастер Душ' },
  { value: 'bard', label: 'Бард' },
  { value: 'sorceress', label: 'Ведьма' },
  { value: 'gunslinger', label: 'Стрелок' },
  { value: 'blaster', label: 'Подрывник' },
  { value: 'scout', label: 'Разведчик' },
  { value: 'assassin', label: 'Убийца' },
  { value: 'shadow', label: 'Теневой Клинок' },
  { value: 'demonic', label: 'Демон' },
  { value: 'summoner', label: 'Призыватель' },
  { value: 'archer', label: 'Лучник' },
  { value: 'custom', label: 'Свой вариант' },
]

// Get class label by value
export function getClassLabel(value: CharacterClass): string {
  const found = CHARACTER_CLASSES.find(c => c.value === value)
  return found?.label ?? value
}