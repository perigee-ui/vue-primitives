import type { PrimitiveProps } from '../primitive/index.ts'
import type { PrimitiveElAttrs, RadixPrimitiveGetAttrs, RadixPrimitiveReturns } from '../shared/index.ts'
import { type Ref, shallowRef } from 'vue'
import { usePresence } from '../presence/index.ts'
import { mergePrimitiveAttrs } from '../shared/index.ts'
import { useCheckboxContext } from './CheckboxRoot.ts'
import { getState, isIndeterminate } from './utils.ts'

export interface CheckboxIndicatorProps {
  as?: PrimitiveProps['as']
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: boolean
}

export interface UseCheckboxIndicatorProps {
  el?: Ref<HTMLElement | undefined>
  forceMount?: boolean
}

export function useCheckboxIndicator(props: UseCheckboxIndicatorProps): RadixPrimitiveReturns<{
  isPresent: Ref<boolean>
  attrs: RadixPrimitiveGetAttrs
}> {
  const el = props.el || shallowRef<HTMLElement>()
  const setTemplateEl = props.el ? undefined : (value: HTMLElement | undefined) => el.value = value

  const context = useCheckboxContext('CheckboxIndicator')

  const isPresent = usePresence(el, () => props.forceMount || isIndeterminate(context.state.value) || context.state.value === true)

  return {
    isPresent,
    attrs(extraAttrs) {
      const attrs: PrimitiveElAttrs = {
        'elRef': setTemplateEl,
        'data-state': getState(context.state.value),
        'data-disabled': context.disabled() ? '' : undefined,
        'style': {
          pointerEvents: 'none',
        },
      }

      if (extraAttrs && extraAttrs.length > 0) {
        mergePrimitiveAttrs(attrs, extraAttrs)
      }

      return attrs
    },
  }
}
