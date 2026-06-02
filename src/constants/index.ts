// Lost Ark Raid Tracker - Application Constants
// =============================================

/**
 * Maximum number of characters that can be added
 */
export const MAX_CHARACTERS = 30

/**
 * Maximum number of gold recipients per week
 */
export const MAX_GOLD_RECIPIENTS = 6

/**
 * Maximum length for character names
 */
export const MAX_CHARACTER_NAME_LENGTH = 50

/**
 * Maximum length for raid names
 */
export const MAX_RAID_NAME_LENGTH = 100

/**
 * Maximum allowed gear score value
 */
export const MAX_GEAR_SCORE = 999999

/**
 * Maximum number of raids per character
 */
export const MAX_RAIDS_PER_CHARACTER = 3

/**
 * localStorage keys
 */
export const STORAGE_KEYS = {
  CHARACTERS: 'la-raid-stats-characters',
  CHARACTER_RAIDS: 'la-raid-stats-character-raids',
  RAIDS_CONFIG: 'la-raid-stats-raids-config',
  SETTINGS: 'la-raid-stats-settings',
} as const

/**
 * Animation durations (in ms)
 */
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const