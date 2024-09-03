import type { PopperContentProps } from '../popper/PopperContent.ts'
import type { TooltipContentImplProps } from './TooltipContentImpl.ts'

export interface TooltipContentProps extends TooltipContentImplProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true

  side?: PopperContentProps['side']
}
