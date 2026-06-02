// Tests for useDragDrop composable

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useDragDrop } from '@/composables/useDragDrop'

describe('useDragDrop', () => {
  const createMockDragEvent = (): DragEvent => ({
    preventDefault: vi.fn(),
    dataTransfer: {
      effectAllowed: '',
      dropEffect: '',
      setData: vi.fn(),
    },
  }) as unknown as DragEvent

  const createItemsRef = () =>
    ref([
      { id: 1, name: 'Item 1', order: 0 },
      { id: 2, name: 'Item 2', order: 1 },
      { id: 3, name: 'Item 3', order: 2 },
    ])

  describe('initialization', () => {
    it('creates a drag drop handler with items ref', () => {
      const items = createItemsRef()
      const { handleDragStart } = useDragDrop(items, {
        onUpdate: vi.fn(),
      })

      expect(typeof handleDragStart).toBe('function')
    })

    it('generates unique listId', () => {
      const items = createItemsRef()
      const { listId } = useDragDrop(items, {
        onUpdate: vi.fn(),
      })

      expect(listId).toMatch(/^drag-drop-/)
      expect(listId.length).toBeGreaterThan(10)
    })

    it('starts with isDragging false', () => {
      const items = createItemsRef()
      const { isDragging } = useDragDrop(items, {
        onUpdate: vi.fn(),
      })

      expect(isDragging.value).toBe(false)
    })
  })

  describe('handleDragStart', () => {
    it('sets dragging state to true', () => {
      const items = createItemsRef()
      const { handleDragStart, isDragging } = useDragDrop(items, {
        onUpdate: vi.fn(),
      })

      handleDragStart(createMockDragEvent(), 0)

      expect(isDragging.value).toBe(true)
    })

    it('stores the dragged index', () => {
      const items = createItemsRef()
      const { handleDragStart } = useDragDrop(items, {
        onUpdate: vi.fn(),
      })

      // Access internal state indirectly through behavior
      handleDragStart(createMockDragEvent(), 2)
    })

    it('prevents drag when enabled is false', () => {
      const items = createItemsRef()
      const enabled = ref(false)
      const { handleDragStart } = useDragDrop(items, {
        onUpdate: vi.fn(),
        enabled,
      })

      const event = createMockDragEvent()
      handleDragStart(event, 0)

      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('sets dataTransfer effectAllowed to move', () => {
      const items = createItemsRef()
      const { handleDragStart } = useDragDrop(items, {
        onUpdate: vi.fn(),
      })

      const event = createMockDragEvent()
      handleDragStart(event, 0)

      expect(event.dataTransfer?.effectAllowed).toBe('move')
    })

    it('sets dataTransfer setData with index', () => {
      const items = createItemsRef()
      const { handleDragStart } = useDragDrop(items, {
        onUpdate: vi.fn(),
      })

      const event = createMockDragEvent()
      handleDragStart(event, 2)

      expect(event.dataTransfer?.setData).toHaveBeenCalledWith('text/plain', '2')
    })
  })

  describe('handleDragOver', () => {
    it('prevents default to allow drop', () => {
      const items = createItemsRef()
      const { handleDragStart, handleDragOver } = useDragDrop(items, {
        onUpdate: vi.fn(),
      })

      const event = createMockDragEvent()
      handleDragStart(event, 0)
      handleDragOver(event, 1)

      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('sets dataTransfer dropEffect to move', () => {
      const items = createItemsRef()
      const { handleDragStart, handleDragOver } = useDragDrop(items, {
        onUpdate: vi.fn(),
      })

      const event = createMockDragEvent()
      handleDragStart(event, 0)
      handleDragOver(event, 1)

      expect(event.dataTransfer?.dropEffect).toBe('move')
    })

    it('does not prevent default when disabled', () => {
      const items = createItemsRef()
      const enabled = ref(false)
      const { handleDragOver } = useDragDrop(items, {
        onUpdate: vi.fn(),
        enabled,
      })

      const event = createMockDragEvent()
      handleDragOver(event, 0)

      // Should not call preventDefault when disabled
      expect(event.preventDefault).not.toHaveBeenCalled()
    })
  })

  describe('handleDragEnd', () => {
    it('resets dragging state to false', () => {
      const items = createItemsRef()
      const { handleDragStart, handleDragEnd, isDragging } = useDragDrop(items, {
        onUpdate: vi.fn(),
      })

      handleDragStart(createMockDragEvent(), 0)
      expect(isDragging.value).toBe(true)

      handleDragEnd()

      expect(isDragging.value).toBe(false)
    })
  })

  describe('handleDrop', () => {
    it('reorders items when dropped at different index', () => {
      const items = createItemsRef()
      const onUpdate = vi.fn()
      const { handleDragStart, handleDrop } = useDragDrop(items, {
        onUpdate,
      })

      handleDragStart(createMockDragEvent(), 0)
      handleDrop(createMockDragEvent(), 2)

      expect(onUpdate).toHaveBeenCalled()
      const newItems = onUpdate.mock.calls[0][0]
      expect(newItems[0].name).toBe('Item 2')
      expect(newItems[2].name).toBe('Item 1')
    })

    it('does not call onUpdate when dropped at same index', () => {
      const items = createItemsRef()
      const onUpdate = vi.fn()
      const { handleDragStart, handleDrop } = useDragDrop(items, {
        onUpdate,
      })

      handleDragStart(createMockDragEvent(), 0)
      handleDrop(createMockDragEvent(), 0)

      expect(onUpdate).not.toHaveBeenCalled()
    })

    it('prevents default behavior', () => {
      const items = createItemsRef()
      const { handleDragStart, handleDrop } = useDragDrop(items, {
        onUpdate: vi.fn(),
      })

      const event = createMockDragEvent()
      handleDragStart(event, 0)
      handleDrop(event, 1)

      expect(event.preventDefault).toHaveBeenCalled()
    })

    it('updates order property on reorder', () => {
      const items = ref([
        { id: 1, name: 'Item 1', order: 0 },
        { id: 2, name: 'Item 2', order: 1 },
      ])
      const onUpdate = vi.fn()
      const { handleDragStart, handleDrop } = useDragDrop(items, {
        onUpdate,
      })

      handleDragStart(createMockDragEvent(), 0)
      handleDrop(createMockDragEvent(), 1)

      const newItems = onUpdate.mock.calls[0][0]
      expect(newItems[0].order).toBe(0)
      expect(newItems[1].order).toBe(1)
    })

    it('does not crash when fromIndex is null', () => {
      const items = createItemsRef()
      const onUpdate = vi.fn()
      const { handleDrop, handleDragEnd } = useDragDrop(items, {
        onUpdate,
      })

      // Simulate drop without prior drag start
      handleDragEnd()
      const event = createMockDragEvent()
      handleDrop(event, 1)

      // Should not call onUpdate when fromIndex is null
      expect(onUpdate).not.toHaveBeenCalled()
    })

    it('returns early when disabled', () => {
      const items = createItemsRef()
      const enabled = ref(false)
      const onUpdate = vi.fn()
      const { handleDragStart, handleDrop } = useDragDrop(items, {
        onUpdate,
        enabled,
      })

      const event = createMockDragEvent()
      handleDragStart(event, 0)
      handleDrop(event, 1)

      expect(onUpdate).not.toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('handles items without order property', () => {
      const items = ref([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ])
      const onUpdate = vi.fn()
      const { handleDragStart, handleDrop } = useDragDrop(items, {
        onUpdate,
      })

      handleDragStart(createMockDragEvent(), 0)
      handleDrop(createMockDragEvent(), 1)

      expect(onUpdate).toHaveBeenCalled()
      const newItems = onUpdate.mock.calls[0][0]
      expect(newItems[0].name).toBe('Item 2')
    })

    it('handles single item array', () => {
      const items = ref([{ id: 1, name: 'Only Item' }])
      const onUpdate = vi.fn()
      const { handleDragStart, handleDrop } = useDragDrop(items, {
        onUpdate,
      })

      handleDragStart(createMockDragEvent(), 0)
      handleDrop(createMockDragEvent(), 0)

      // Dropping at same index should not trigger update
      expect(onUpdate).not.toHaveBeenCalled()
    })
  })
})