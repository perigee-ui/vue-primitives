export interface ContextMenuTriggerProps {
  disabled?: boolean
}

// eslint-disable-next-line ts/consistent-type-definitions
export type ContextMenuTriggerEmits = {
  contextmenu: [event: MouseEvent]
  pointerdown: [event: MouseEvent]
  pointermove: [event: MouseEvent]
  pointercancel: [event: MouseEvent]
  pointerup: [event: MouseEvent]
}
