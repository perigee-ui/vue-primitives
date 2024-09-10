<script setup lang="ts">
import { shallowRef, watchEffect } from 'vue'
import { DATA_COLLECTION_ITEM } from '../collection/Collection.ts'
import { useComposedElements } from '../hooks/index.ts'
import { Primitive } from '../primitive/index.ts'
import { RovingFocusGroupItem } from '../roving-focus/index.ts'
import { composeEventHandlers } from '../utils/vue.ts'
import { useMenuContentContext } from './MenuContent.ts'
import { Collection, type ItemData } from './MenuRoot.ts'
import type { MenuItemImplEmits, MenuItemImplProps } from './MenuItemImpl.ts'

defineOptions({
  name: 'MenuItemImpl',
  inheritAttrs: false,
})

const props = defineProps<MenuItemImplProps>()
const emit = defineEmits<MenuItemImplEmits>()

const contentContext = useMenuContentContext('MenuItemImpl')

const $el = shallowRef<HTMLDivElement>()

const isFocused = shallowRef(false)

const itemData: ItemData = { disabled: props.disabled, textValue: props.textValue || '' }
watchEffect(() => {
  itemData.disabled = props.disabled
  itemData.textValue = props.textValue ?? $el.value?.textContent ?? ''
})

const forwardElement = useComposedElements<HTMLDivElement>((v) => {
  Collection.useCollectionItem(v, itemData)
  $el.value = v
})

/**
 * We focus items on `pointerMove` to achieve the following:
 *
 * - Mouse over an item (it focuses)
 * - Leave mouse where it is and use keyboard to focus a different item
 * - Wiggle mouse without it leaving previously focused item
 * - Previously focused item should re-focus
 *
 * If we used `mouseOver`/`mouseEnter` it would not re-focus when the mouse
 * wiggles. This is to match native menu implementation.
 */
const onPointermove = composeEventHandlers<PointerEvent>(
  (event) => {
    emit('pointermove', event)
  },
  (event) => {
    if (event.pointerType !== 'mouse')
      return

    if (props.disabled) {
      contentContext.onItemLeave(event)
    }
    else {
      contentContext.onItemEnter(event)
      if (!event.defaultPrevented) {
        const item = event.currentTarget as HTMLElement | null
        item?.focus({ preventScroll: true })
      }
    }
  },
)

const onPointerleave = composeEventHandlers<PointerEvent>((event) => {
  emit('pointerleave', event)
}, (event) => {
  if (event.pointerType !== 'mouse')
    return

  contentContext.onItemLeave(event)
})

const onFocus = composeEventHandlers<FocusEvent>((event) => {
  emit('focus', event)
}, () => {
  isFocused.value = true
})

const onBlur = composeEventHandlers<FocusEvent>((event) => {
  emit('blur', event)
}, () => {
  isFocused.value = false
})

defineExpose({
  $el,
})
</script>

<template>
  <RovingFocusGroupItem as="template" :focusable="!disabled">
    <Primitive
      :ref="forwardElement"
      role="menuitem"
      :data-highlighted="isFocused ? '' : undefined"
      :aria-disabled="disabled || undefined"
      :data-disabled="disabled ? '' : undefined"
      :[DATA_COLLECTION_ITEM]="true"
      v-bind="$attrs"
      @pointermove="onPointermove"
      @pointerleave="onPointerleave"
      @focus="onFocus"
      @blur="onBlur"
    >
      <slot />
    </Primitive>
  </RovingFocusGroupItem>
</template>
