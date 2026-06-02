// Tests for useDefaultRaidsConfig composable

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDefaultRaidsConfig } from '@/composables/useDefaultRaidsConfig'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

describe('useDefaultRaidsConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getInitialRaids', () => {
    it('returns user config when available', () => {
      const userConfig = [{ id: 'user-raid', name: 'User Raid', difficulties: [] }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ version: 1, raids: userConfig }))

      const { getInitialRaids } = useDefaultRaidsConfig()

      const raids = getInitialRaids()

      expect(raids).toEqual(userConfig)
    })

    it('returns and saves default config when no user config', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const { getInitialRaids } = useDefaultRaidsConfig()

      const raids = getInitialRaids()

      expect(localStorageMock.setItem).toHaveBeenCalled()
      expect(Array.isArray(raids)).toBe(true)
    })

    it('marks hasCustomConfig as true after first call', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const { getInitialRaids, hasCustomConfig } = useDefaultRaidsConfig()

      expect(hasCustomConfig.value).toBe(false)

      getInitialRaids()

      expect(hasCustomConfig.value).toBe(true)
    })
  })

  describe('resetToDefault', () => {
    it('resets to default configuration', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const { resetToDefault } = useDefaultRaidsConfig()

      const raids = resetToDefault()

      expect(localStorageMock.setItem).toHaveBeenCalled()
      expect(Array.isArray(raids)).toBe(true)
    })

    it('marks hasCustomConfig as true', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const { resetToDefault, hasCustomConfig } = useDefaultRaidsConfig()

      resetToDefault()

      expect(hasCustomConfig.value).toBe(true)
    })
  })

  describe('updateConfig', () => {
    it('saves updated config', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const { updateConfig, getInitialRaids } = useDefaultRaidsConfig()

      // First call to initialize
      getInitialRaids()

      const newConfig = [{ id: 'new-raid', name: 'New Raid', difficulties: [] }]

      updateConfig(newConfig)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'la-raid-stats-raids-config',
        JSON.stringify({ version: 1, raids: newConfig })
      )
    })
  })

  describe('getDefaultRaids', () => {
    it('returns array of default raids', () => {
      const { getDefaultRaids } = useDefaultRaidsConfig()

      const defaults = getDefaultRaids()

      expect(Array.isArray(defaults)).toBe(true)
    })
  })
})