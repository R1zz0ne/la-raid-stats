// Lost Ark Raid Tracker - useSettingsStore
// ======================================

import { defineStore } from 'pinia'
import { shallowRef, computed, watch, readonly } from 'vue'
import type { Theme } from '@/types'

const STORAGE_KEY = 'la-raid-stats-settings'

export const useSettingsStore = defineStore('settings', () => {
  // State - use shallowRef for primitive
  const _theme = shallowRef<Theme>('light')

  // Getters
  const isDark = computed(() => _theme.value === 'dark')

  // Actions
  function setTheme(theme: Theme): void {
    _theme.value = theme
  }

  function toggleTheme(): void {
    _theme.value = _theme.value === 'light' ? 'dark' : 'light'
  }

  // Persist to localStorage
  function persistToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: _theme.value }))
  }

  function loadFromStorage(): void {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.theme) {
          _theme.value = data.theme
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
  }

  // Watch for changes and persist
  watch(_theme, () => {
    persistToStorage()
    // Apply to DOM
    document.documentElement.setAttribute('data-theme', _theme.value)
  })

  return {
    theme: readonly(_theme),
    isDark,
    setTheme,
    toggleTheme,
    loadFromStorage,
  }
})