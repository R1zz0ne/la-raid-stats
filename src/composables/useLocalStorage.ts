// Lost Ark Raid Tracker - useLocalStorage Composable
// =================================================

import { shallowRef, watch } from 'vue'

/**
 * Composable for reactive localStorage synchronization
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  // Read initial value from localStorage
  const storedValue = localStorage.getItem(key)
  const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue

  const _value = shallowRef<T>(initialValue)

  // Sync to localStorage on change
  watch(
    _value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true },
  )

  function get(): T {
    return _value.value
  }

  function set(val: T): void {
    _value.value = val
  }

  function remove(): void {
    localStorage.removeItem(key)
    _value.value = defaultValue
  }

  return {
    value: _value,
    get,
    set,
    remove,
  }
}