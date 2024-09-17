import type { RovingFocusGroupItemEmits } from '../roving-focus'

export interface ToggleGroupItemProps {
  /**
   * A string value for the toggle group item. All items within a toggle group should use a unique value.
   */
  value: string

  disabled?: boolean
}

export type ToggleGroupItemEmits = {
  /**
   * Emitted when the toggle group item is clicked.
   */
  click: [event: MouseEvent]
} & RovingFocusGroupItemEmits
