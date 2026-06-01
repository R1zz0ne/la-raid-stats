// Lost Ark Raid Tracker - Constants
// =================================

import type { CharacterClass, CharacterClassConfig } from '@/types'

// Character classes with labels
export const CHARACTER_CLASSES: CharacterClassConfig[] = [
  { value: 'berserker', label: 'Берсерк' },
  { value: 'destroyer', label: 'Сокрушитель' },
  { value: 'warden', label: 'Страж' },
  { value: 'paladin', label: 'Паладин' },
  { value: 'valkyrie', label: 'Валькирия' },
  { value: 'sentinel', label: 'Храмовница' },
  { value: 'arcanist', label: 'Арканолог' },
  { value: 'summoner', label: 'Призывательница' },
  { value: 'bard', label: 'Менестрель' },
  { value: 'sorceress', label: 'Чародейка' },
  { value: 'avatar', label: 'Аватар' },
  { value: 'duelist', label: 'Дуалист' },
  { value: 'keymaster', label: 'Ки-мастер' },
  { value: 'spearmaster', label: 'Мастер копья' },
  { value: 'tycoon', label: 'Тайгон' },
  { value: 'steelknuckle', label: 'Стальной кулак' },
  { value: 'ranger', label: 'Рейнджер' },
  { value: 'demonhunter', label: 'Охотник на демонов' },
  { value: 'mechanist', label: 'Механист' },
  { value: 'agent', label: 'Агент С.К.А.У.Т' },
  { value: 'demonhunteR', label: 'Охотница на демонов' },
  { value: 'bladeofdeath', label: 'Клинок смерти' },
  { value: 'fury', label: 'Фурия' },
  { value: 'reaper', label: 'Жнец' },
  { value: 'soul devourer', label: 'Пожирательница душ' },
  { value: 'artist', label: 'Художница' },
  { value: 'aeromancer', label: 'Аэромант' },
  { value: 'druid', label: 'Друид' },
  { value: 'wardenknight', label: 'Рыцарь-Хранитель' },
  { value: 'custom', label: 'Свой вариант' },
]

// Get class label by value
export function getClassLabel(value: CharacterClass): string {
  const found = CHARACTER_CLASSES.find(c => c.value === value)
  return found?.label ?? value
}