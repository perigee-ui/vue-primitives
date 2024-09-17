export interface DropdownMenuTriggerProps {
  disabled?: boolean
}

// eslint-disable-next-line ts/consistent-type-definitions
export type DropdownMenuTriggerEmits = {
  pointerdown: [event: PointerEvent]
  keydown: [event: KeyboardEvent]
}
