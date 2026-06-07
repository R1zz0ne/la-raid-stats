// Lost Ark Raid Tracker - useDragDrop Composable
// ==============================================
// Uses character ID-based tracking for reliable drag-and-drop

import { ref, type Ref } from 'vue'

export interface UseDragDropOptions<T extends { id: string }> {
  onUpdate: (items: T[]) => void
  enabled?: Ref<boolean>
}

export interface UseDragDropReturn {
  listId: string
  isDragging: Ref<boolean>
  draggedId: Ref<string | null>
  handleDragStart: (event: DragEvent, id: string) => void
  handleDragOver: (event: DragEvent) => void
  handleDragEnd: () => void
  handleDrop: (event: DragEvent, targetId: string) => void
}

/**
 * Composable for drag-and-drop functionality using character IDs
 * Uses native HTML5 drag-and-drop API
 * 
 * Key features:
 * - Tracks drag by character ID (not index) - more reliable with CSS grid
 * - Finds actual position by looking up IDs in the items array
 * - Simpler logic: source → target swap
 */
export function useDragDrop<T extends { id: string }>(
  items: Ref<T[]>,
  options: UseDragDropOptions<T>,
): UseDragDropReturn {
  const { onUpdate, enabled } = options

  const listId = `drag-drop-${Math.random().toString(36).substring(2, 9)}`
  const isDragging = ref(false)
  const draggedId = ref<string | null>(null)

  function handleDragStart(event: DragEvent, id: string): void {
    if (enabled?.value === false) {
      event.preventDefault()
      return
    }

    isDragging.value = true
    draggedId.value = id

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('application/character-id', id)
      event.dataTransfer.setData('text/plain', id)
    }
  }

  function handleDragOver(event: DragEvent): void {
    if (enabled?.value === false) {
      return
    }

    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }

  function handleDragEnd(): void {
    isDragging.value = false
    draggedId.value = null
  }

  function handleDrop(event: DragEvent, targetId: string): void {
    event.preventDefault()

    if (enabled?.value === false) {
      handleDragEnd()
      return
    }

    const sourceId = draggedId.value

    if (!sourceId || sourceId === targetId) {
      handleDragEnd()
      return
    }

    // Find positions by ID
    const itemsCopy = [...items.value]
    const fromIndex = itemsCopy.findIndex(item => item.id === sourceId)
    const toIndex = itemsCopy.findIndex(item => item.id === targetId)

    if (fromIndex === -1 || toIndex === -1) {
      handleDragEnd()
      return
    }

    // Swap items
    const [movedItem] = itemsCopy.splice(fromIndex, 1)
    itemsCopy.splice(toIndex, 0, movedItem)

    // Update order property if items have it
    itemsCopy.forEach((item, index) => {
      if (item && typeof item === 'object' && 'order' in item) {
        (item as Record<string, unknown>).order = index
      }
    })

    onUpdate(itemsCopy)
    handleDragEnd()
  }

  return {
    listId,
    isDragging,
    draggedId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
  }
}