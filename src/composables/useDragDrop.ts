// Lost Ark Raid Tracker - useDragDrop Composable
// ==============================================

import { ref, type Ref } from 'vue'

export interface UseDragDropOptions<T> {
  onUpdate: (items: T[]) => void
  enabled?: Ref<boolean>
}

export interface UseDragDropReturn {
  listId: string
  isDragging: Ref<boolean>
  handleDragStart: (event: DragEvent, index: number) => void
  handleDragOver: (event: DragEvent, index: number) => void
  handleDragEnd: () => void
  handleDrop: (event: DragEvent, toIndex: number) => void
}

/**
 * Composable for drag-and-drop functionality
 * Uses native HTML5 drag-and-drop API
 */
export function useDragDrop<T>(
  items: Ref<T[]>,
  options: UseDragDropOptions<T>,
): UseDragDropReturn {
  const { onUpdate, enabled } = options

  const listId = `drag-drop-${Math.random().toString(36).substring(2, 9)}`
  const isDragging = ref(false)
  const draggedIndex = ref<number | null>(null)
  const dropTargetIndex = ref<number | null>(null)

  function handleDragStart(event: DragEvent, index: number): void {
    if (enabled?.value === false) {
      event.preventDefault()
      return
    }

    isDragging.value = true
    draggedIndex.value = index

    // Set drag data
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
    }
  }

  function handleDragOver(event: DragEvent, index: number): void {
    if (enabled?.value === false) {
      return
    }

    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
    dropTargetIndex.value = index
  }

  function handleDragEnd(): void {
    isDragging.value = false
    draggedIndex.value = null
    dropTargetIndex.value = null
  }

  function handleDrop(event: DragEvent, toIndex: number): void {
    event.preventDefault()

    if (enabled?.value === false) {
      return
    }

    const fromIndex = draggedIndex.value

    if (fromIndex === null || fromIndex === toIndex) {
      handleDragEnd()
      return
    }

    // Reorder items
    const newItems = [...items.value]
    const [movedItem] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, movedItem)

    // Update order property if items have it
    newItems.forEach((item, index) => {
      if (item && typeof item === 'object' && 'order' in item) {
        (item as Record<string, unknown>).order = index
      }
    })

    onUpdate(newItems)
    handleDragEnd()
  }

  return {
    listId,
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
  }
}