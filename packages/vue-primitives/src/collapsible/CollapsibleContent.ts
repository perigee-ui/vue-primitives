import { computed, type CSSProperties, nextTick, onMounted, type Ref, shallowRef } from 'vue'
import { usePresence } from '../presence/index.ts'
import { mergePrimitiveAttrs, type PrimitiveDefaultProps, type RadixPrimitiveGetAttrs, type RadixPrimitiveReturns } from '../shared/index.ts'
import { useCollapsibleContext } from './CollapsibleRoot.ts'

export interface CollapsibleContentProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with Vue animation libraries.
   */
  forceMount?: boolean
}

export const DEFAULT_COLLAPSIBLE_CONTENT_PROPS = {
  forceMount: undefined,
} satisfies PrimitiveDefaultProps<CollapsibleContentProps>

export interface UseCollapsibleContentProps {
  el?: Ref<HTMLElement | undefined>
  forceMount?: boolean
}

export function useCollapsibleContent(props: UseCollapsibleContentProps): RadixPrimitiveReturns<{
  isPresent: Ref<boolean>
  attrs: RadixPrimitiveGetAttrs
}> {
  const context = useCollapsibleContext('CollapsibleContent')

  const el = shallowRef<HTMLElement | undefined>(undefined)
  const setElRef = (value: HTMLElement | undefined) => el.value = value
  const isPresent = props.forceMount ? shallowRef(true) : usePresence(context.content, () => context.open.value)

  return {
    isPresent,
    attrs(extraAttrs) {
      const attrs = {
        elRef: setElRef,
      }

      if (extraAttrs && extraAttrs.length > 0) {
        mergePrimitiveAttrs(attrs, extraAttrs)
      }

      return attrs
    },
  }
}
