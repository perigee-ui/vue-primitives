import type { Ref } from 'vue'
import type { ScrollAreaScrollbarVisibleProps } from './ScrollAreaScrollbarVisible.ts'
import { createContext } from '../hooks/index.ts'

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
