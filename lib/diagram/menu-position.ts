/** Clamps a context-menu anchor point so a menu of the estimated size stays inside the viewport. */
export function clampMenuPosition(
  x: number,
  y: number,
  estWidth = 176,
  estHeight = 240,
): { x: number; y: number } {
  if (typeof window === 'undefined') return { x, y }
  return {
    x: Math.max(8, Math.min(x, window.innerWidth - estWidth - 8)),
    y: Math.max(8, Math.min(y, window.innerHeight - estHeight - 8)),
  }
}
