<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

export interface ToastItem {
  id: string
  message: string
  progress?: number
  total?: number
  status: 'progress' | 'success' | 'error'
}

const toasts = ref<ToastItem[]>([])

function addToast(item: Omit<ToastItem, 'id'>): string {
  const id = `toast-${Date.now()}-${Math.random()}`
  toasts.value.push({ ...item, id })
  return id
}

function updateToast(id: string, updates: Partial<Omit<ToastItem, 'id'>>) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value[index] = { ...toasts.value[index], ...updates }
  }
}

function removeToast(id: string) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

function clearAll() {
  toasts.value = []
}

// Auto-remove progress toasts after 3 seconds
onUnmounted(() => {
  toasts.value = []
})

defineExpose({
  addToast,
  updateToast,
  removeToast,
  clearAll,
})
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.status}`"
        >
          <div class="toast__content">
            <span class="toast__message">{{ toast.message }}</span>
            <span v-if="toast.total" class="toast__progress">
              {{ toast.progress }}/{{ toast.total }}
            </span>
          </div>
          <div v-if="toast.status === 'progress' && toast.total" class="toast__bar">
            <div
              class="toast__bar-fill"
              :style="{ width: `${(toast.progress || 0) / toast.total * 100}%` }"
            />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: var(--spacing-md);
  right: var(--spacing-md);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-width: 320px;
}

.toast {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast--progress {
  border-color: var(--color-primary);
}

.toast--success {
  border-color: var(--color-success);
}

.toast--error {
  border-color: var(--color-danger);
}

.toast__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.toast__message {
  font-size: var(--text-sm);
  color: var(--color-text);
}

.toast__progress {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.toast__bar {
  height: 3px;
  background-color: var(--color-border);
  border-radius: 2px;
  margin-top: var(--spacing-xs);
  overflow: hidden;
}

.toast__bar-fill {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.2s ease;
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>