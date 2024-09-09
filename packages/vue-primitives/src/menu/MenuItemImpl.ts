export interface MenuItemImplProps {
  disabled?: boolean
  textValue?: string
}

// eslint-disable-next-line ts/consistent-type-definitions
export type MenuItemImplEmits = {
  pointerleave: [event: PointerEvent]
  pointermove: [event: PointerEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}
