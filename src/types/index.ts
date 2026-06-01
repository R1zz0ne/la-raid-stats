// Lost Ark Raid Tracker - Type Definitions
// =======================================

// Difficulty type enum
export type DifficultyType = 'solo' | 'normal' | 'heroic' | 'nightmare'

// Character class enum
export type CharacterClass =
  | 'berserker'
  | 'destroyer'
  | 'warden'
  | 'paladin'
  | 'valkyrie'
  | 'sentinel'
  | 'arcanist'
  | 'summoner'
  | 'bard'
  | 'sorceress'
  | 'avatar'
  | 'duelist'
  | 'keymaster'
  | 'spearmaster'
  | 'tycoon'
  | 'steelknuckle'
  | 'ranger'
  | 'demonhunter'
  | 'mechanist'
  | 'agent'
  | 'demonhunteR'
  | 'bladeofdeath'
  | 'fury'
  | 'reaper'
  | 'soul devourer'
  | 'artist'
  | 'aeromancer'
  | 'druid'
  | 'wardenknight'
  | 'custom'

// Theme
export type Theme = 'light' | 'dark'

// Character - id equals name (unique)
export interface Character {
  id: string // equals name
  name: string
  gearScore: number
  characterClass: CharacterClass
  customClassName?: string // used when characterClass === 'custom'
  order: number // for drag-and-drop sorting
}

// Difficulty configuration for a raid
export interface Difficulty {
  type: DifficultyType
  requiredGearScore: number
  regularGold: number
  limitedGold: number
}

// Raid - id generated from transliteration of name
export interface Raid {
  id: string // transliteration of name (slug)
  name: string
  difficulties: Difficulty[]
}

// Character Raid assignment (character <-> raid)
export interface CharacterRaid {
  id: string // UUID
  characterId: string // references Character.id
  raidId: string // references Raid.id
  difficultyType: DifficultyType
  isCompleted: boolean
  createdAt: number // timestamp for sorting (newest first by default)
}

// Application settings
export interface AppSettings {
  theme: Theme
}

// Character with full raid details (for display)
export interface CharacterRaidWithDetails extends CharacterRaid {
  raid: Raid
}

// Gold summary
export interface GoldSummary {
  regular: number
  limited: number
  total: number
}

// Character with computed gold summary
export interface CharacterWithGold extends Character {
  goldSummary: GoldSummary
}

// Export data format
export interface ExportData {
  version: 1
  exportedAt: string // ISO date
  characters: Character[]
  characterRaids: CharacterRaid[]
  raids: Raid[]
  settings: AppSettings
}

// Validation result
export interface ValidationResult {
  valid: boolean
  errors: string[]
}

// Form data types
export interface CharacterFormData {
  name: string
  gearScore: number
  characterClass: CharacterClass
  customClassName?: string
}

export interface DifficultyFormData {
  type: DifficultyType
  requiredGearScore: number
  regularGold: number
  limitedGold: number
}

export interface RaidFormData {
  name: string
  difficulties: DifficultyFormData[]
}

// Select option
export interface SelectOption<T = string> {
  value: T
  label: string
}

// Difficulty type config
export interface DifficultyTypeConfig {
  value: DifficultyType
  label: string
  order: number
  color: string
}

// Character class config
export interface CharacterClassConfig {
  value: CharacterClass
  label: string
}