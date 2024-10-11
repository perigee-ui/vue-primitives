import type { Ref } from 'vue'
import type { RadixPrimitiveReturns } from '../shared'
import { usePopperContext } from '../popper/index.ts'
import { usePresence } from '../presence/index.ts'
import { useMenuContext } from './MenuRoot.ts'

export interface MenuContentProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: boolean
}

export interface UseMenuContentProps {
  forceMount?: boolean
}

export function useMenuContent(props: UseMenuContentProps = {}): RadixPrimitiveReturns<{
  isPresent: Ref<boolean>
}> {
  const context = useMenuContext('MenuContent')
  const popperContext = usePopperContext('MenuContent')

  const isPresent = usePresence(popperContext.content, () => props.forceMount || context.open())

  return {
    isPresent,
  }
}
