export interface MenuSubTriggerProps {
  disabled?: boolean
}

// eslint-disable-next-line ts/consistent-type-definitions
export type MenuSubTriggerEmits = {
  pointermove: [event: PointerEvent]
  pointerleave: [event: PointerEvent]
  keydown: [event: KeyboardEvent]
}
