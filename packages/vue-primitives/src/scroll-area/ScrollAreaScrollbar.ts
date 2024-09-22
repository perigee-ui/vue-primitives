import type { ScrollAreaScrollbarVisibleProps } from './ScrollAreaScrollbarVisible.ts'
import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { createContext } from '../hooks/index.ts'
import { mergeHooksAttrs, type RadixPrimitiveReturns } from '../shared/index.ts'
import { useScrollAreaContext } from './ScrollAreaRoot.ts'

export interface ScrollAreaScrollbarProps {
  orientation?: ScrollAreaScrollbarVisibleProps['orientation']
}

export interface ScrollbarContext {
  hasThumb: Ref<boolean>
  thumb: Ref<HTMLElement | undefined>
  onThumbPointerUp: () => void
  onThumbPointerDown: (pointerPos: { x: number, y: number }) => void
  onThumbPositionChange: () => void
}

export const [provideScrollbarContext, useScrollbarContext] = createContext<ScrollbarContext>('ScrollAreaScrollbar')

export interface UseScrollbarProps {
  orientation?: ScrollAreaScrollbarVisibleProps['orientation']
}

export function useScrollAreaScrollbar(props: UseScrollbarProps): RadixPrimitiveReturns {
  const isHorizontal = props.orientation === 'horizontal'

  const context = useScrollAreaContext('ScrollAreaScrollbar')

  onMounted(() => {
    if (isHorizontal)
      context.onScrollbarXEnabledChange(true)
    else
      context.onScrollbarYEnabledChange(true)
  })

  onBeforeUnmount(() => {
    if (isHorizontal)
      context.onScrollbarXEnabledChange(false)
    else
      context.onScrollbarYEnabledChange(false)
  })

  return {
    attrs(extraAttrs) {
      const attrs = {
        orientation: props.orientation,
      }

      if (extraAttrs) {
        mergeHooksAttrs(attrs, extraAttrs)
      }

      return attrs
    },
  }
}
