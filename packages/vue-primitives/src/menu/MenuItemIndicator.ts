import type { CheckedState } from '../checkbox/index.ts'
import { createContext } from '../hooks/index.ts'

export interface MenuItemIndicatorProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

export interface ItemIndicatorContext {
  checked: () => CheckedState
}

export const [provideItemIndicatorContext, useItemIndicatorContext] = createContext<ItemIndicatorContext>('MenuItemIndicator', {
  checked: () => false,
})
