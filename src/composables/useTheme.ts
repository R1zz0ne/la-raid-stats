// Lost Ark Raid Tracker - useTheme Composable
// ===========================================

import { computed, type ComputedRef, type InjectionKey } from 'vue'
import { useSettingsStore } from '@/stores/settings'

export interface ThemeContext {
  isDark: ComputedRef<boolean>
  toggleTheme: () => void
  initTheme: () => void
}

export const themeKey = Symbol('theme') as InjectionKey<ThemeContext>

/**
 * Composable for theme management
 * Applies data-theme attribute on <html> element
 */
export function useTheme() {
  const settingsStore = useSettingsStore()

  const isDark = computed(() => settingsStore.theme === 'dark')

  function toggleTheme(): void {
    settingsStore.toggleTheme()
  }

  function initTheme(): void {
    // Apply theme on initial load
    const theme = settingsStore.theme
    document.documentElement.setAttribute('data-theme', theme)
  }

  return {
    isDark,
    toggleTheme,
    initTheme,
  }
}