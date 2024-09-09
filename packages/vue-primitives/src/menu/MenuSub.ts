import type { Ref } from 'vue'
import { createContext } from '../hooks/index.ts'

export interface MenuSubProps {
  open?: boolean
}

// eslint-disable-next-line ts/consistent-type-definitions
export type MenuSubEmits = {
  'update:open': [open: boolean]
}

export interface MenuSubContext {
  contentId: string
  triggerId: string
  trigger: Ref<HTMLDivElement | undefined>
  onTriggerChange: (trigger: HTMLDivElement | undefined) => void
}

export const [provideMenuSubContext, useMenuSubContext] = createContext<MenuSubContext>('MenuSub')
