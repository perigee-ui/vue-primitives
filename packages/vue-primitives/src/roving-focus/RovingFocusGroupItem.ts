import type { PrimitiveProps } from '../primitive/index.ts'
import { computed, onWatcherCleanup, watch, watchEffect } from 'vue'
import { DATA_COLLECTION_ITEM } from '../collection/Collection.ts'
import { useId } from '../hooks/index.ts'
import { focusFirst, mergeHooksAttrs, type RadixPrimitiveReturns, wrapArray } from '../shared/index.ts'
import { Collection, type ItemData, useCollection, useRovingFocusContext } from './RovingFocusGroupRoot.ts'
import { getFocusIntent } from './utils.ts'

export interface RovingFocusGroupItemProps {
  as?: PrimitiveProps['as']
  tabStopId?: string
  focusable?: boolean
  active?: boolean
}

export interface UseRovingFocusGroupItemProps {
  tabStopId?: () => string | undefined
  focusable?: () => boolean
  active?: () => boolean
}

export function useRovingFocusGroupItem(props: UseRovingFocusGroupItemProps): RadixPrimitiveReturns {
  const {
    focusable = () => true,
    active = () => false,
  } = props

  const _id = useId()

  const id = computed(() => props.tabStopId?.() ?? _id)
  const context = useRovingFocusContext('RovingFocusGroupItem')
  const isCurrentTabStop = computed(() => context.currentTabStopId.value === id.value)

  const getItems = useCollection()

  watch(focusable, (value) => {
    if (value) {
      context.onFocusableItemAdd()
      onWatcherCleanup(context.onFocusableItemRemove)
    }
  }, { immediate: true })

  const itemData: ItemData['rfg'] = { id: id.value, focusable: focusable(), active: active() }

  watchEffect(() => {
    itemData.active = active()
    itemData.focusable = focusable()
    itemData.id = id.value
  })

  function onMousedown(event: MouseEvent) {
    if (event.defaultPrevented)
      return
    // We prevent focusing non-focusable items on `mousedown`.
    // Even though the item has tabIndex={-1}, that only means take it out of the tab order.
    if (!focusable())
      event.preventDefault()
    // Safari doesn't focus a button when clicked so we run our logic on mousedown also
    else context.onItemFocus(id.value)
  }

  function onFocus(event: FocusEvent) {
    if (event.defaultPrevented)
      return
    context.onItemFocus(id.value)
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab' && event.shiftKey) {
      context.onItemShiftTab()
      return
    }

    if (event.target !== event.currentTarget)
      return

    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
      return

    const focusIntent = getFocusIntent(event, context.orientation, context.dir.value)

    if (!focusIntent)
      return

    event.preventDefault()
    let candidateNodes = getItems().filter(item => item.$$rcid.rfg.focusable)

    if (focusIntent === 'last') {
      candidateNodes.reverse()
    }
    else if (focusIntent === 'prev' || focusIntent === 'next') {
      if (focusIntent === 'prev')
        candidateNodes.reverse()
      const currentIndex = (candidateNodes as HTMLElement[]).indexOf(event.currentTarget as HTMLElement)
      candidateNodes = context.loop
        ? wrapArray(candidateNodes, currentIndex + 1)
        : candidateNodes.slice(currentIndex + 1)
    }

    // TODO: wip
    /**
     * Imperative focus during keydown is risky so we prevent React's batching updates
     * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
     */
    setTimeout(() => {
      focusFirst(candidateNodes)
    })
  }

  function setTemplateEl(templateEl: HTMLElement | undefined) {
    Collection.useCollectionItem(templateEl, itemData, 'rfg')
  }

  return {
    attrs(extraAttrs) {
      const attrs = {
        'ref': setTemplateEl,
        [DATA_COLLECTION_ITEM]: true,
        'tabindex': isCurrentTabStop.value ? 0 : -1,
        'data-orientation': context.orientation,
        onFocus,
        onMousedown,
        onKeydown,
      }

      if (extraAttrs) {
        mergeHooksAttrs(attrs, extraAttrs)
      }

      return attrs
    },
  }
}
