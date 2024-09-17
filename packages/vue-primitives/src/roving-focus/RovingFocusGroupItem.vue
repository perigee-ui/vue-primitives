<script setup lang="ts">
import { DATA_COLLECTION_ITEM } from '../collection/index.ts'
import { useComposedElements } from '../hooks/index.ts'
import { type RovingFocusGroupItemEmits, type RovingFocusGroupItemProps, useRovingFocusGroupItem } from './RovingFocusGroupItem.ts'

defineOptions({
  name: 'RovingFocusGroupItem',
})

const props = withDefaults(defineProps<RovingFocusGroupItemProps>(), {
  focusable: true,
  active: false,
})
const emit = defineEmits<RovingFocusGroupItemEmits>()

const rovingFocusGroupItem = useRovingFocusGroupItem(props, {
  onMousedown(event) {
    emit('mousedown', event)
  },
  onFocus(event) {
    emit('focus', event)
  },
  onKeydown(event) {
    emit('keydown', event)
  },
})

const forwardElement = useComposedElements((v) => {
  rovingFocusGroupItem.useCollectionItem(v, rovingFocusGroupItem.itemData, rovingFocusGroupItem.collectionKey)
})
</script>

<template>
  <span
    :ref="forwardElement"
    :[DATA_COLLECTION_ITEM]="true"

    :tabindex="rovingFocusGroupItem.tabindex()"
    :data-orientation="rovingFocusGroupItem.orientation()"

    @mousedown="rovingFocusGroupItem.onMousedown"
    @focus="rovingFocusGroupItem.onFocus"
    @keydown="rovingFocusGroupItem.onKeydown"
  >
    <slot />
  </span>
</template>
