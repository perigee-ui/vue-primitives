import type { ComponentPublicInstance, Ref } from 'vue'
import type { MutableRefObject } from './useRef.ts'

export function useForwardElement<T extends HTMLElement = HTMLElement>(elRef: Ref<T | undefined> | MutableRefObject<T | undefined>) {
  function setRef(nodeRef: Element | ComponentPublicInstance | null | undefined) {
    let node: T | undefined = (nodeRef as ComponentPublicInstance)?.$el ?? nodeRef

    if (node && node.nodeType !== 1)
      node = undefined

    elRef.value = node
  }

  return setRef
}
