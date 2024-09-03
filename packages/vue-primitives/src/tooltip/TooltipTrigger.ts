import type { PrimitiveProps } from '../primitive/index.ts'

export interface TooltipTriggerProps extends PrimitiveProps {}

// eslint-disable-next-line ts/consistent-type-definitions
export type TooltipTriggerEmits = {
  pointermove: [event: PointerEvent]
  pointerleave: [event: PointerEvent]
  pointerdown: [event: PointerEvent]
  focus: [event: PointerEvent]
  blur: [event: PointerEvent]
  click: [event: PointerEvent]
}

export type TooltipTriggerElement = HTMLButtonElement
