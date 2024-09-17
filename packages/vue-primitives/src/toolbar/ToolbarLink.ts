import type { RovingFocusGroupItemEmits } from '../roving-focus/index.ts'

export type ToolbarLinkEmits = {
  keydown: [event: KeyboardEvent]
} & RovingFocusGroupItemEmits
