import type { PrimitiveElAttrs, RadixPrimitiveReturns } from '../shared/index.ts'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useRovingFocusGroupItem } from '../roving-focus/index.ts'
import { mergeHooksAttrs } from '../shared/index.ts'
import { type ToggleProps, useToggle, type UseToggleProps } from '../toggle/index.ts'
import { useToggleGroupContext } from './ToggleGroupRoot.ts'

export interface ToggleGroupItemProps extends Omit<ToggleProps, 'pressed' | 'defaultPressed'> {
  /**
   * A string value for the toggle group item. All items within a toggle group should use a unique value.
   */
  value: string
}

export interface UseToggleGroupItemProps extends Omit<UseToggleProps, 'pressed' | 'defaultPressed' | 'onUpdatePressed'> {
  value: MaybeRefOrGetter<string>
}

export function useToggleGroupItem(props: UseToggleGroupItemProps): RadixPrimitiveReturns {
  const context = useToggleGroupContext('ToggleGroupItem')
  const pressed = computed(() => context.value.value?.includes(toValue(props.value)))
  const disabled = computed(() => context.disabled() || props.disabled?.())

  const toggle = useToggle({
    pressed() {
      return pressed.value
    },
    onUpdatePressed(pressed) {
      if (pressed) {
        context.onItemActivate(toValue(props.value))
      }
      else {
        context.onItemDeactivate(toValue(props.value))
      }
    },
    disabled() {
      return disabled.value
    },
  })

  const rovingFocusGroupItem = context.rovingFocus
    ? useRovingFocusGroupItem({
      focusable() {
        return !disabled.value
      },
      active() {
        return pressed.value
      },
    })
    : undefined

  return {
    attrs(extraAttrs = []) {
      const attrs = context.type === 'multiple'
        ? {}
        : {
            'role': 'radio',
            'aria-checked': pressed.value,
            'aria-pressed': undefined,
          }

      const extraAttrsList: PrimitiveElAttrs[] = [toggle.attrs()]

      if (rovingFocusGroupItem) {
        extraAttrsList.push(rovingFocusGroupItem.attrs())
      }

      if (extraAttrs) {
        extraAttrsList.push(...extraAttrs)
      }

      if (extraAttrsList.length > 0) {
        mergeHooksAttrs(attrs, extraAttrsList)
      }

      return attrs
    },
  }
}
