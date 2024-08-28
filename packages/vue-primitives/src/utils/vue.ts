import { type ComponentPublicInstance, type Ref, isRef } from 'vue'
import type { MutableRefObject } from '../hooks'

export function useForwardElement<T extends HTMLElement = HTMLElement>(elRef: Ref<T | undefined> | MutableRefObject<T | undefined>) {
  function setRef(nodeRef: Element | ComponentPublicInstance | null | undefined) {
    let node: T | undefined = (nodeRef as ComponentPublicInstance)?.$el ?? nodeRef

    if (node && node.nodeType !== 1)
      node = undefined

    if (isRef(elRef))
      elRef.value = node
    else
      elRef.current = node
  }

  return setRef
}

export function useComposedElements<T extends HTMLElement = HTMLElement>(cb: (el: T | undefined) => void, eq?: (a: T | undefined) => boolean) {
  function setRef(nodeRef: any) {
    let node: T | undefined = (nodeRef as ComponentPublicInstance)?.$el ?? nodeRef

    if (node && node.nodeType !== 1)
      node = undefined

    if (eq && eq(node))
      return

    cb(node)
  }

  return setRef
}

export function composeEventHandlers<E extends Event>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event)

    if (checkForDefaultPrevented === false || !((event as unknown) as Event).defaultPrevented)
      ourEventHandler?.(event)
  }
}
