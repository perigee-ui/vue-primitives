import { isClient } from '@vueuse/core'
import { computed, type CSSProperties, nextTick, onMounted, type Ref, shallowRef, watchEffect } from 'vue'
import { usePresence } from '../presence/index.ts'
import { mergePrimitiveAttrs, type PrimitiveDefaultProps, type RadixPrimitiveGetAttrs, type RadixPrimitiveReturns } from '../shared/index.ts'
import { useCollapsibleContext } from './CollapsibleRoot.ts'

export interface CollapsibleContentImplProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with Vue animation libraries.
   */
  present: boolean
}

export const DEFAULT_COLLAPSIBLE_CONTENT_PROPS = {
  forceMount: undefined,
} satisfies PrimitiveDefaultProps<CollapsibleContentImplProps>

export interface UseCollapsibleContentProps {
  present: () => boolean
}

export function useCollapsibleContentImpl(props: UseCollapsibleContentProps): RadixPrimitiveReturns<{
  isOpen: Ref<boolean>
  attrs: RadixPrimitiveGetAttrs
}> {
  const context = useCollapsibleContext('CollapsibleContent')
  const el = context.content
  const setElRef = (value: HTMLElement | undefined) => el.value = value

  // when opening we want it to immediately open to retrieve dimensions
  // when closing we delay `present` to retrieve dimensions before closing
  const isOpen = computed(() => context.open.value || props.present())
  let isMountAnimationPrevented = false

  let originalStyles: Pick<CSSStyleDeclaration, 'transitionDuration' | 'animationName'>

  if (isClient) {
    watchEffect(async () => {
      if (!isOpen.value)
        return
      // await nextTick()
      // const node = el.value
      // if (!node)
      //   return

      // const nodeStyle = node.style

      // originalStyles = originalStyles || {
      //   transitionDuration: nodeStyle.transitionDuration,
      //   animationName: nodeStyle.animationName,
      // }

      // console.error('originalStyles', originalStyles)
      // // block any animations/transitions so the element renders at its full dimensions
      // nodeStyle.transitionDuration = '0s'
      // nodeStyle.animationName = 'none'

      // // get width and height from full dimensions
      // const rect = node.getBoundingClientRect()
      // nodeStyle.setProperty('--radix-collapsible-content-height', `${rect.height}px`)
      // nodeStyle.setProperty('--radix-collapsible-content-width', `${rect.width}px`)

      // // kick off any animations/transitions that were originally set up if it isn't the initial mount
      // if (!isMountAnimationPrevented) {
      //   console.error('ORIGINAL STYLES', originalStyles)
      //   nodeStyle.transitionDuration = originalStyles.transitionDuration
      //   nodeStyle.animationName = originalStyles.animationName
      // }
    })
  }

  onMounted(() => {
    requestAnimationFrame(() => {
      isMountAnimationPrevented = false
    })

    const node = el.value
    if (!node)
      return

    const nodeStyle = node.style

    originalStyles = originalStyles || {
      transitionDuration: nodeStyle.transitionDuration,
      animationName: nodeStyle.animationName,
    }

    console.error('originalStyles', originalStyles)
    // block any animations/transitions so the element renders at its full dimensions
    nodeStyle.transitionDuration = '0s'
    nodeStyle.animationName = 'none'

    // get width and height from full dimensions
    nodeStyle.setProperty('--radix-collapsible-content-height', `38.75px`)
    nodeStyle.setProperty('--radix-collapsible-content-width', '320px')

    nodeStyle.transitionDuration = originalStyles.transitionDuration
    nodeStyle.animationName = originalStyles.animationName
  })
  return {
    isOpen,
    attrs(extraAttrs) {
      const attrs = {
        'elRef': setElRef,
        'id': context.contentId,
        'data-state': context.open.value ? 'open' : 'closed',
        'data-disabled': context.disabled() ? '' : undefined,
        'hidden': !isOpen.value,
        'style': {
          '--radix-collapsible-content-height': '0px',
          '--radix-collapsible-content-width': '0px',
        },
      }

      if (extraAttrs && extraAttrs.length > 0) {
        mergePrimitiveAttrs(attrs, extraAttrs)
      }

      return attrs
    },
  }
}
