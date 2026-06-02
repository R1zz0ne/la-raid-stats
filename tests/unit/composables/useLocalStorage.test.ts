// Tests for useLocalStorage composable

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

// Store for mock reference
let currentMockStorage: Record<string, string> = {}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn((key: string) => currentMockStorage[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    currentMockStorage[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    delete currentMockStorage[key]
  }),
}

vi.stubGlobal('localStorage', localStorageMock)

describe('useLocalStorage', () => {
  beforeEach(() => {
    currentMockStorage = {}
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('uses default value when localStorage is empty', () => {
      const { value } = useLocalStorage('test-key', 'default')
      expect(value.value).toBe('default')
    })

    it('uses stored value when available', () => {
      currentMockStorage['test-key'] = JSON.stringify('stored')
      const { value } = useLocalStorage('test-key', 'default')
      expect(value.value).toBe('stored')
    })

    it('parses object from localStorage', () => {
      const storedObj = { name: 'Test', count: 42 }
      currentMockStorage['test-key'] = JSON.stringify(storedObj)
      const { value } = useLocalStorage('test-key', { name: '', count: 0 })
      expect(value.value).toEqual(storedObj)
    })
  })

  describe('get', () => {
    it('returns current value', () => {
      currentMockStorage['test-key'] = JSON.stringify('test')
      const { get } = useLocalStorage('test-key', 'default')
      expect(get()).toBe('test')
    })
  })

  describe('set', () => {
    it('updates value', () => {
      const { value, set } = useLocalStorage('test-key', 'default')
      set('new-value')
      expect(value.value).toBe('new-value')
    })

    it('persists to localStorage', async () => {
      const { set } = useLocalStorage('test-key', 'default')
      set('new-value')
      
      // Wait for watch to trigger
      await nextTick()

      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"new-value"')
    })
  })

  describe('remove', () => {
    it('removes from localStorage', () => {
      currentMockStorage['test-key'] = JSON.stringify('test')
      const { remove } = useLocalStorage('test-key', 'default')
      remove()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key')
    })

    it('resets to default value', () => {
      currentMockStorage['test-key'] = JSON.stringify('test')
      const { value, remove } = useLocalStorage('test-key', 'default')
      remove()
      expect(value.value).toBe('default')
    })
  })
})