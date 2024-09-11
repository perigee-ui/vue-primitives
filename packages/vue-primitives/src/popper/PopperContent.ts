import type { Ref } from 'vue'
import { createContext } from '../hooks/index.ts'
import type { Direction } from '../direction/index.ts'

export interface PopperContentProps {
  side?: Side
  sideOffset?: number
  align?: Align
  alignOffset?: number
  arrowPadding?: number
  avoidCollisions?: boolean
  collisionBoundary?: Boundary | Boundary[]
  collisionPadding?: number | Partial<Record<Side, number>>
  sticky?: 'partial' | 'always'
  hideWhenDetached?: boolean
  updatePositionStrategy?: 'optimized' | 'always'
  dir?: Direction
}

// eslint-disable-next-line ts/consistent-type-definitions
export type PopperContentEmits = {
  placed: []
}

type Boundary = Element | undefined

export const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
export const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export interface PopperContentContext {
  placedSide: Ref<Side>
  onArrowChange: (newArrow: HTMLSpanElement | undefined) => void
  arrowX: () => number | undefined
  arrowY: () => number | undefined
  shouldHideArrow: () => boolean
}

export const [provideContentContext, useContentContext] = createContext<PopperContentContext>('PopperContent')
