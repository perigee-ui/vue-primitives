import type { PrimitiveProps } from '../primitive/index.ts'
import type { RovingFocusGroupItemEmits } from '../roving-focus/RovingFocusGroupItem.ts'

export interface ToolbarButtonProps {
  as?: PrimitiveProps['as']
  disabled?: boolean
}

export type ToolbarButtonEmits = RovingFocusGroupItemEmits
