// Lost Ark Raid Tracker - useModalCloseGuard Composable
// =====================================================

/**
 * Prevents modal from closing when user drags/selects text from modal content to outside.
 * Only closes on explicit click on overlay.
 *
 * Uses CSS pointer-events approach:
 * - overlay is behind modal-content and clicks pass through it except on the visible background
 * - modal-content blocks pointer events on the overlay underneath it
 *
 * @param closeHandler - Function to call when modal should close
 */
export function useModalCloseGuard(closeHandler: () => void) {
  function onOverlayClick() {
    // Simple close - since overlay clicks pass through to content,
    // clicking on the visible overlay background is intentional
    closeHandler()
  }

  return {
    onOverlayClick,
  }
}