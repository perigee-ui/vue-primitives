import type { DismissableLayerEmits } from '../dismissable-layer/index.ts'
import type { MenuContentImplSharedEmits } from '../menu/MenuContentImpl.ts'

// eslint-disable-next-line ts/consistent-type-definitions
export type DropdownMenuContentEmits = {
  closeAutoFocus: MenuContentImplSharedEmits['closeAutoFocus']
  interactOutside: DismissableLayerEmits['interactOutside']
}
