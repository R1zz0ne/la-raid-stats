// Lost Ark Raid Tracker - useModalCloseGuard Composable
// =====================================================

/**
 * Prevents modal from closing when user drags/selects text from modal content to outside.
 * Only closes on explicit click on overlay.
 *
 * Tracks mouse state to detect if user was interacting with modal content
 * (e.g., selecting text in input) when mouse is released outside.
 *
 * @param closeHandler - Function to call when modal should close
 */
export function useModalCloseGuard(closeHandler: () => void) {
  let isMouseDownOnContent = false

  function onContentMouseDown() {
    isMouseDownOnContent = true
  }

  function onContentMouseUp() {
    isMouseDownOnContent = false
  }

  function onOverlayClick() {
    // Only close if mouse was NOT pressed down on modal content
    // This prevents closing when user selects text and releases outside
    if (!isMouseDownOnContent) {
      closeHandler()
    }
  }

  return {
    onOverlayClick,
    onContentMouseDown,
    onContentMouseUp,
  }
}