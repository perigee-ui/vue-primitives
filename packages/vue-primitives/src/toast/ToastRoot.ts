import type { DismissableLayerEmits } from '../dismissable-layer/index.ts'
import { createContext } from '../hooks/index.ts'
import type { PrimitiveProps } from '../primitive/Primitive.ts'

export interface ToastRootProps {
  as?: PrimitiveProps['as']
  type?: 'foreground' | 'background'
  /**
   * Time in milliseconds that toast should remain visible for. Overrides value
   * given to `ToastProvider`.
   */
  duration?: number

  open?: boolean
  defaultOpen?: boolean
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

export type SwipeEvent = { currentTarget: EventTarget & HTMLLIElement } & Omit<
  CustomEvent<{ originalEvent: React.PointerEvent, delta: { x: number, y: number } }>,
  'currentTarget'
>

// eslint-disable-next-line ts/consistent-type-definitions
export type ToastRootEmits = {
  'update:open': [open: boolean]
  'escapeKeydown': DismissableLayerEmits['escapeKeydown']
  'pause': []
  'resume': []
  'swipeStart': [event: SwipeEvent]
  'swipeMove': [event: SwipeEvent]
  'swipeEnd': [event: SwipeEvent]
  'swipeCancel': [event: SwipeEvent]

  'keydown': [event: KeyboardEvent]
  'pointerdown': [event: PointerEvent]
  'pointermove': [event: PointerEvent]
  'pointerup': [event: PointerEvent]
}

export const TOAST_SWIPE_START = 'toast.swipeStart'
export const TOAST_SWIPE_MOVE = 'toast.swipeMove'
export const TOAST_SWIPE_CANCEL = 'toast.swipeCancel'
export const TOAST_SWIPE_END = 'toast.swipeEnd'

export const [provideToastInteractiveContext, useToastInteractiveContext] = createContext('Toast', {
  onClose() {},
})
