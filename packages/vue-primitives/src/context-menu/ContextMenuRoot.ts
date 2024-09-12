import type { Ref } from 'vue'
import { createContext } from '../hooks/index.ts'
import type { Direction } from '../direction/index.ts'

export interface ContextMenuProps {
  dir?: Direction
  modal?: boolean
}

// eslint-disable-next-line ts/consistent-type-definitions
export type ContextMenuEmits = {
  'update:open': [open: boolean]
}

interface ContextMenuContextValue {
  open: Ref<boolean>
  onOpenChange: (open: boolean) => void
  modal: boolean
}

export const [provideContextMenuContext, useContextMenuContext] = createContext<ContextMenuContextValue>('ContextMenu')
