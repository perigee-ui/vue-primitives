export interface TabsTriggerProps {
  value: string
  disabled?: boolean
}

// eslint-disable-next-line ts/consistent-type-definitions
export type TabsTriggerEmits = {
  mousedown: [event: MouseEvent]
  keydown: [event: KeyboardEvent]
  focus: [event: FocusEvent]
}
