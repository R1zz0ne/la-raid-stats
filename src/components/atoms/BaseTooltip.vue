<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  disabled?: boolean
}>()

const isVisible = ref(false)
</script>

<template>
  <div
    class="base-tooltip"
    :class="{ 'base-tooltip--disabled': disabled }"
    @mouseenter="isVisible = true"
    @mouseleave="isVisible = false"
    @focusin="isVisible = true"
    @focusout="isVisible = false"
  >
    <slot />
    <Transition name="tooltip">
      <div
        v-if="isVisible && content && !disabled"
        class="base-tooltip__content"
        :class="[`base-tooltip__content--${position ?? 'top'}`]"
        role="tooltip"
      >
        {{ content }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.base-tooltip {
  position: relative;
  display: inline-flex;
}

.base-tooltip--disabled {
  pointer-events: none;
}

.base-tooltip__content {
  position: absolute;
  z-index: 1000;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-text);
  color: var(--color-bg);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
  white-space: nowrap;
  pointer-events: none;
}

/* Position variants */
.base-tooltip__content--top {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.base-tooltip__content--bottom {
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.base-tooltip__content--left {
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

.base-tooltip__content--right {
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

/* Transitions */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}

.base-tooltip__content--top.tooltip-enter-from,
.base-tooltip__content--top.tooltip-leave-to {
  transform: translateX(-50%) translateY(4px);
}

.base-tooltip__content--bottom.tooltip-enter-from,
.base-tooltip__content--bottom.tooltip-leave-to {
  transform: translateX(-50%) translateY(-4px);
}
</style>