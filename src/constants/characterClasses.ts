// Lost Ark Raid Tracker - Constants
// =================================

import type { CharacterClass, CharacterClassConfig } from '@/types'

// Character classes with labels (values match Lost Ark class names in lowercase)
export const CHARACTER_CLASSES: CharacterClassConfig[] = [
  { value: 'berserker', label: 'Берсерк' },
  { value: 'destroyer', label: 'Сокрушитель' },
  { value: 'gunlancer', label: 'Страж' },
  { value: 'paladin', label: 'Паладин' },
  { value: 'slayer', label: 'Валькирия' },
  { value: 'valkyrie', label: 'Храмовница' },
  { value: 'arcanist', label: 'Арканолог' },
  { value: 'summoner', label: 'Призывательница' },
  { value: 'bard', label: 'Менестрель' },
  { value: 'sorceress', label: 'Чародейка' },
  { value: 'wardancer', label: 'Аватар' },
  { value: 'scrapper', label: 'Дуалист' },
  { value: 'soulfist', label: 'Ки-мастер' },
  { value: 'glaivier', label: 'Мастер копья' },
  { value: 'striker', label: 'Тайгон' },
  { value: 'breaker', label: 'Стальной кулак' },
  { value: 'sharpshooter', label: 'Рейнджер' },
  { value: 'deadeye', label: 'Охотник на демонов' },
  { value: 'artillerist', label: 'Механист' },
  { value: 'machinist', label: 'Агент С.К.А.У.Т' },
  { value: 'gunslinger', label: 'Охотница на демонов' },
  { value: 'deathblade', label: 'Клинок смерти' },
  { value: 'shadowhunter', label: 'Фурия' },
  { value: 'reaper', label: 'Жнец' },
  { value: 'souleater', label: 'Пожирательница душ' },
  { value: 'artist', label: 'Художница' },
  { value: 'aeromancer', label: 'Аэромант' },
  { value: 'wildsoul', label: 'Друид' },
  { value: 'guardianknight', label: 'Рыцарь-Хранитель' },
  { value: 'custom', label: 'Свой вариант' },
]

// Get class label by value
export function getClassLabel(value: CharacterClass): string {
  const found = CHARACTER_CLASSES.find(c => c.value === value)
  return found?.label ?? value
}