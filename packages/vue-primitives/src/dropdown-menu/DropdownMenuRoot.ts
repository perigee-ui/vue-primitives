import type { Direction } from '../direction/index.ts'
import type { EmitsToHookProps, PrimitiveDefaultProps } from '../shared/index.ts'
import { type MaybeRefOrGetter, useId } from 'vue'
import { createContext, type MutableRefObject, useControllableStateV2, useRef } from '../hooks/index.ts'
import { type MenuRootProps, useMenuRoot } from '../menu/index.ts'

export interface DropdownMenuRootProps extends MenuRootProps {
  defaultOpen?: boolean
}

export const DEFAULT_DROPDOWN_MENU_ROOT_PROPS = {
  open: undefined,
  defaultOpen: undefined,
  modal: undefined,
} satisfies PrimitiveDefaultProps<DropdownMenuRootProps>

// eslint-disable-next-line ts/consistent-type-definitions
export type DropdownMenuRootEmits = {
  'update:open': [open: boolean]
}

export interface DropdownMenuContextValue {
  triggerId: string
  triggerRef: MutableRefObject<HTMLElement | undefined>
  contentId: string
  open: () => boolean
  onOpenChange: (open: boolean) => void
  onOpenToggle: () => void
  modal: boolean
}

export const [provideDropdownMenuContext, useDropdownMenuContext] = createContext<DropdownMenuContextValue>('DropdownMenu')

export interface UseDropdownMenuRootProps extends EmitsToHookProps<DropdownMenuRootEmits> {
  open?: () => boolean | undefined
  defaultOpen?: boolean
  dir?: MaybeRefOrGetter<Direction | undefined>
  modal?: boolean
}

export function useDropdownMenuRoot(props: UseDropdownMenuRootProps = {}) {
  const {
    defaultOpen = false,
    modal = true,
  } = props

  const triggerRef = useRef<HTMLElement>()

  const open = useControllableStateV2(props.open, props.onUpdateOpen, defaultOpen)

  provideDropdownMenuContext({
    triggerId: useId(),
    triggerRef,
    contentId: useId(),
    open() {
      return open.value
    },
    onOpenChange(value) {
      open.value = value
    },
    onOpenToggle() {
      open.value = !open.value
    },
    modal,
  })

  useMenuRoot({
    open() {
      return open.value
    },
    onUpdateOpen(v) {
      open.value = v
    },
    dir: props.dir,
    modal,
  })
}
