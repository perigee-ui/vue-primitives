import { type ShallowReactive, type ShallowRef, onBeforeUnmount, onBeforeUpdate, onMounted, shallowReactive } from 'vue'
import { createContext } from '../hooks/createContext.ts'

export const ITEM_DATA_ATTR = 'data-radix-collection-item'

interface ContextValue<ItemElement extends HTMLElement, ItemData = object> {
  collectionRef: ShallowRef<ItemElement | undefined>
  itemMap: ShallowReactive<Map<ItemElement, { ref: ItemElement, attrs: ItemData }>>
}

export function createCollection<ItemElement extends HTMLElement, ItemData = object>(name: string) {
  const [_provideCollectionContext, useCollectionContext] = createContext<ContextValue<ItemElement, ItemData>>(`${name}CollectionProvider`)

  function provideCollectionContext(collectionRef: ContextValue<ItemElement, ItemData>['collectionRef']) {
    const itemMap = shallowReactive(new Map<ItemElement, { ref: ItemElement, attrs: ItemData }>())

    _provideCollectionContext({
      collectionRef,
      itemMap,
    })
  }

  function useCollectionItem(currentElement: ShallowRef<ItemElement | undefined>, attrs: Record<string, unknown> = {}) {
    const { itemMap } = useCollectionContext()

    let unrefElement: ItemElement | undefined

    onMounted(() => {
      unrefElement = currentElement.value
      if (!unrefElement)
        return

      itemMap.set(unrefElement, {
        ref: unrefElement,
        attrs: attrs as ItemData,
      })
    })

    onBeforeUpdate(() => {
      if (!unrefElement)
        return

      itemMap.set(unrefElement, {
        ref: unrefElement,
        attrs: attrs as ItemData,
      })
    })

    onBeforeUnmount(() => {
      if (!unrefElement)
        return

      itemMap.delete(unrefElement)
    })

    // TODO: watch attrs -> onBeforeUpdate
    // watch([currentElement, attrs], (_, __, onClean) => {
    //   const unrefElement = currentElement.value
    //   if (!unrefElement)
    //     return

    //   itemMap.set(unrefElement, {
    //     ref: unrefElement,
    //     attrs: attrs as ItemData,
    //   })

    //   onClean(() => {
    //     itemMap.delete(unrefElement)
    //   })
    // })

    return {
      itemMap,
    }
  }

  function useCollection() {
    const context = useCollectionContext(`${name}CollectionConsumer`)

    const getItems = () => {
      const collectionNode = context.collectionRef.value
      if (!collectionNode)
        return []

      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`))
      const items = Array.from(context.itemMap.values())
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref) - orderedNodes.indexOf(b.ref),
      )

      return orderedItems
    }

    return getItems
  }

  return [{ provideCollectionContext, useCollectionContext, useCollectionItem }, useCollection] as const
}
