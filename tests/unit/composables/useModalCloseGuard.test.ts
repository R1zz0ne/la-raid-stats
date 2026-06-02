// Tests for useModalCloseGuard composable

import { describe, it, expect, vi } from 'vitest'
import { useModalCloseGuard } from '@/composables/useModalCloseGuard'

describe('useModalCloseGuard', () => {
  describe('onOverlayClick', () => {
    it('calls closeHandler when overlay is clicked', () => {
      const onClose = vi.fn()
      const { onOverlayClick } = useModalCloseGuard(onClose)

      onOverlayClick()

      expect(onClose).toHaveBeenCalled()
    })

    it('returns void (calls handler directly)', () => {
      const onClose = vi.fn()
      const { onOverlayClick } = useModalCloseGuard(onClose)

      const result = onOverlayClick()

      expect(onClose).toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})