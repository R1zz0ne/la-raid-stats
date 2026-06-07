// Tests for useSettingsStore

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from '@/stores/settings'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
}

const setAttributeMock = vi.fn()
vi.stubGlobal('document', {
  documentElement: {
    setAttribute: setAttributeMock,
  },
})

describe('useSettingsStore', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockClear()
    setAttributeMock.mockClear()

    vi.stubGlobal('localStorage', localStorageMock)

    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('starts with light theme', () => {
      const store = useSettingsStore()
      expect(store.isDark).toBe(false)
    })
  })

  describe('setTheme', () => {
    it('changes theme to dark', () => {
      const store = useSettingsStore()
      store.setTheme('dark')
      expect(store.isDark).toBe(true)
    })

    it('changes theme back to light', () => {
      const store = useSettingsStore()
      store.setTheme('dark')
      store.setTheme('light')
      expect(store.isDark).toBe(false)
    })
  })

  describe('toggleTheme', () => {
    it('toggles from light to dark', () => {
      const store = useSettingsStore()
      store.toggleTheme()
      expect(store.isDark).toBe(true)
    })

    it('toggles from dark to light', () => {
      const store = useSettingsStore()
      store.setTheme('dark')
      store.toggleTheme()
      expect(store.isDark).toBe(false)
    })
  })

  describe('loadFromStorage', () => {
    it('loads valid theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ theme: 'dark' }))

      const store = useSettingsStore()
      store.loadFromStorage()

      expect(store.isDark).toBe(true)
    })

    it('handles invalid JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')
      
      const store = useSettingsStore()
      const initialTheme = store.isDark

      store.loadFromStorage()

      expect(store.isDark).toBe(initialTheme)
    })

    it('handles missing theme property', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ other: 'value' }))
      
      const store = useSettingsStore()
      const initialTheme = store.isDark

      store.loadFromStorage()

      expect(store.isDark).toBe(initialTheme)
    })

    it('does nothing when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const store = useSettingsStore()
      const initialTheme = store.isDark

      store.loadFromStorage()

      expect(store.isDark).toBe(initialTheme)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('la-raid-stats-settings')
    })
  })

  describe('isDark', () => {
    it('reflects dark theme', () => {
      const store = useSettingsStore()
      store.setTheme('dark')
      expect(store.isDark).toBe(true)
    })

    it('reflects light theme', () => {
      const store = useSettingsStore()
      expect(store.isDark).toBe(false)
    })

    it('is reactive to theme changes', () => {
      const store = useSettingsStore()
      expect(store.isDark).toBe(false)
      
      store.setTheme('dark')
      expect(store.isDark).toBe(true)
      
      store.setTheme('light')
      expect(store.isDark).toBe(false)
    })
  })

  describe('theme state', () => {
    it('has theme getter', () => {
      const store = useSettingsStore()
      expect(store.theme).toBeDefined()
    })

    it('has all required methods', () => {
      const store = useSettingsStore()
      expect(typeof store.setTheme).toBe('function')
      expect(typeof store.toggleTheme).toBe('function')
      expect(typeof store.loadFromStorage).toBe('function')
    })
  })

  describe('viewMode', () => {
    it('starts with cards view mode', () => {
      const store = useSettingsStore()
      expect(store.viewMode).toBe('cards')
    })

    it('has viewMode getter', () => {
      const store = useSettingsStore()
      expect(store.viewMode).toBeDefined()
    })

    it('has setViewMode method', () => {
      const store = useSettingsStore()
      expect(typeof store.setViewMode).toBe('function')
    })

    describe('setViewMode', () => {
      it('changes viewMode to table', () => {
        const store = useSettingsStore()
        store.setViewMode('table')
        expect(store.viewMode).toBe('table')
      })

      it('changes viewMode back to cards', () => {
        const store = useSettingsStore()
        store.setViewMode('table')
        store.setViewMode('cards')
        expect(store.viewMode).toBe('cards')
      })
    })

    describe('loadFromStorage with viewMode', () => {
      it('loads valid viewMode from localStorage', () => {
        localStorageMock.getItem.mockReturnValue(JSON.stringify({ viewMode: 'table' }))

        const store = useSettingsStore()
        store.loadFromStorage()

        expect(store.viewMode).toBe('table')
      })

      it('loads both theme and viewMode from localStorage', () => {
        localStorageMock.getItem.mockReturnValue(JSON.stringify({ theme: 'dark', viewMode: 'table' }))

        const store = useSettingsStore()
        store.loadFromStorage()

        expect(store.isDark).toBe(true)
        expect(store.viewMode).toBe('table')
      })
    })
  })
})