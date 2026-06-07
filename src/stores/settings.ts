// Lost Ark Raid Tracker - useSettingsStore
// ======================================

import { defineStore } from 'pinia'
import { shallowRef, computed, watch, readonly } from 'vue'
import type { Theme, ViewMode } from '@/types'

const STORAGE_KEY = 'la-raid-stats-settings'

export const useSettingsStore = defineStore('settings', () => {
  // State - use shallowRef for primitive
  const _theme = shallowRef<Theme>('light')
  const _viewMode = shallowRef<ViewMode>('cards')

  // Getters
  const isDark = computed(() => _theme.value === 'dark')

  // Actions
  function setTheme(theme: Theme): void {
    _theme.value = theme
  }

  function toggleTheme(): void {
    _theme.value = _theme.value === 'light' ? 'dark' : 'light'
  }

  function setViewMode(mode: ViewMode): void {
    _viewMode.value = mode
  }

  // Persist to localStorage
  function persistToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      theme: _theme.value,
      viewMode: _viewMode.value,
    }))
  }

  function loadFromStorage(): void {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.theme) {
          _theme.value = data.theme
        }
        if (data.viewMode) {
          _viewMode.value = data.viewMode
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

  watch(_viewMode, () => {
    persistToStorage()
  })

return {
    theme: readonly(_theme),
    // Raw ref for v-model compatibility — mutations tracked by Pinia, setViewMode() for explicit usage
    viewMode: _viewMode,
    isDark,
    setTheme,
    toggleTheme,
    setViewMode,
    loadFromStorage,
  }
})