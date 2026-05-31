// Lost Ark Raid Tracker - Transliteration Utility
// ==============================================

/**
 * Transliterates text to a URL-friendly slug
 * Used for generating raid IDs from raid names
 *
 * Examples:
 *   "Lost Ark" → "lost-ark"
 *   "Абиссас" → "abissas"
 *   "Вершинный босс" → "vershinnyj-boss"
 */
export function transliterate(text: string): string {
  // Mapping of Cyrillic characters to Latin equivalents
  const cyrillicToLatin: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  }

  // Convert to lowercase
  let result = text.toLowerCase()

  // Replace Cyrillic characters
  result = result.replace(/[а-яё]/gi, (char) => {
    const lowerChar = char.toLowerCase()
    return cyrillicToLatin[lowerChar] ?? char
  })

  // Replace non-alphanumeric characters (except spaces and hyphens)
  result = result.replace(/[^a-z0-9\s-]/g, '')

  // Replace spaces with hyphens
  result = result.replace(/\s+/g, '-')

  // Replace multiple consecutive hyphens with single hyphen
  result = result.replace(/-+/g, '-')

  // Remove leading and trailing hyphens
  result = result.replace(/^-+|-+$/g, '')

  return result
}

/**
 * Generates a unique slug from a name, handling duplicates
 * If the slug already exists, appends a number
 */
export function generateUniqueSlug(baseName: string, existingSlugs: string[]): string {
  let slug = transliterate(baseName)

  if (!existingSlugs.includes(slug)) {
    return slug
  }

  let counter = 1
  while (existingSlugs.includes(`${slug}-${counter}`)) {
    counter++
  }

  return `${slug}-${counter}`
}