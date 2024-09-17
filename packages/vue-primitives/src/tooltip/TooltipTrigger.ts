// eslint-disable-next-line ts/consistent-type-definitions
export type TooltipTriggerEmits = {
  pointermove: [event: PointerEvent]
  pointerleave: [event: PointerEvent]
  pointerdown: [event: PointerEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  click: [event: MouseEvent]
}

export type TooltipTriggerElement = HTMLButtonElement
