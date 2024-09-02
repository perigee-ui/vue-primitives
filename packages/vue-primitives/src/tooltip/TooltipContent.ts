import type { DismissableLayerEmits } from '../dismissable-layer/DismissableLayer.ts'
import type { TooltipContentImplProps } from './TooltipContentImpl.ts'

export interface TooltipContentProps extends TooltipContentImplProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

// eslint-disable-next-line ts/consistent-type-definitions
export type TooltipContentEmits = {
  /**
   * Event handler called when the escape key is down.
   * Can be prevented.
   */
  escapeKeydown: DismissableLayerEmits['escapeKeydown']
  /**
   * Event handler called when the a `pointerdown` event happens outside of the `Tooltip`.
   * Can be prevented.
   */
  pointerdownOutside: DismissableLayerEmits['pointerdownOutside']
}
