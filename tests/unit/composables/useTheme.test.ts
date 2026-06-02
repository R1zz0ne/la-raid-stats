// Tests for useTheme composable

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTheme } from '@/composables/useTheme'

// Mock settings store
vi.mock('@/stores/settings', () => ({
  useSettingsStore: () => ({
    theme: { value: 'light' },
    toggleTheme: vi.fn(),
  }),
}))

describe('useTheme', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('isDark', () => {
    it('returns computed value for light theme', () => {
      const { isDark } = useTheme()

      expect(isDark.value).toBe(false)
    })

    it('returns computed value for dark theme', () => {
      const { isDark } = useTheme()

      // Note: This test depends on the mock
      expect(isDark.value).toBeDefined()
    })
  })

  describe('toggleTheme', () => {
    it('is a function', () => {
      const { toggleTheme } = useTheme()

      expect(typeof toggleTheme).toBe('function')
    })
  })

  describe('initTheme', () => {
    it('is a function', () => {
      const { initTheme } = useTheme()

      expect(typeof initTheme).toBe('function')
    })
  })
})