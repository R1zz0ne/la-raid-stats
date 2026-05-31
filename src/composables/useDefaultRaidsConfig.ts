// Lost Ark Raid Tracker - useDefaultRaidsConfig Composable
// =======================================================

import { ref, readonly } from 'vue'
import type { Raid } from '@/types'
import defaultRaidsData from '@/constants/defaultRaids.json'

// Storage key for user-modified raids config
const STORAGE_KEY = 'la-raid-stats-raids-config'

// Type for default raids config
interface DefaultRaidsConfig {
  version: number
  raids: Raid[]
}

// Get default raids from JSON
function getDefaultRaids(): Raid[] {
  return defaultRaidsData.raids as Raid[]
}

// Check if localStorage has user config
function hasUserConfig(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null
}

// Get user config from localStorage (or null if not exists)
function getUserConfig(): Raid[] | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null

  try {
    const data = JSON.parse(stored) as DefaultRaidsConfig
    if (Array.isArray(data.raids)) {
      return data.raids
    }
    return null
  } catch {
    return null
  }
}

// Save user config to localStorage
function saveUserConfig(raids: Raid[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, raids }))
}

// Clear user config from localStorage
function clearUserConfig(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function useDefaultRaidsConfig() {
  // State: tracks if user has modified the default config
  const hasCustomConfig = ref(hasUserConfig())

  // Get raids for initialization:
  // - If localStorage has config -> use it
  // - If not -> save default to localStorage and return default
  function getInitialRaids(): Raid[] {
    const userConfig = getUserConfig()
    if (userConfig) {
      hasCustomConfig.value = true
      return userConfig
    }

    // First time: save default config to localStorage
    const defaults = getDefaultRaids()
    saveUserConfig(defaults)
    hasCustomConfig.value = true
    return defaults
  }

  // Reset to default config
  function resetToDefault(): Raid[] {
    clearUserConfig()
    const defaults = getDefaultRaids()
    saveUserConfig(defaults)
    hasCustomConfig.value = true
    return defaults
  }

  // Update the stored config (called when user modifies raids)
  function updateConfig(raids: Raid[]): void {
    saveUserConfig(raids)
    hasCustomConfig.value = true
  }

  return {
    hasCustomConfig: readonly(hasCustomConfig),
    getInitialRaids,
    resetToDefault,
    updateConfig,
    getDefaultRaids,
  }
}