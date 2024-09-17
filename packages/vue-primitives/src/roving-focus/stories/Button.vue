<script setup lang="ts">
import { computed } from 'vue'
import { DATA_COLLECTION_ITEM } from '../../collection/index.ts'
import { useComposedElements } from '../../hooks/index.ts'
import { composeEventHandlers } from '../../utils/vue.ts'
import { RovingFocusGroupItem, useRovingFocusGroupItem } from '../index.ts'
import { useButtonGroupContext } from './utils.ts'

const props = withDefaults(defineProps<{
  value: string
  disabled?: boolean
}>(), {
  disabled: false,
})

const context = useButtonGroupContext('button')

const isSelected = computed(() => context.value.value !== undefined
  && props.value !== undefined
  && context.value.value === props.value)

// COMP::RovingFocusGroupItem

const rovingFocusGroupItem = useRovingFocusGroupItem({
  active() {
    return isSelected.value
  },
  focusable() {
    return !props.disabled
  },
})

// Handlers

const onFocus = composeEventHandlers(rovingFocusGroupItem.onFocus, (event) => {
  if (context.value.value !== undefined) {
    (event.target as HTMLElement).click()
  }
})

const forwardElement = useComposedElements((v) => {
  rovingFocusGroupItem.useCollectionItem(v, rovingFocusGroupItem.itemData, rovingFocusGroupItem.collectionKey)
})
</script>

<template>
  <RovingFocusGroupItem as="template" :active="isSelected" :focusable="!disabled">
    <button
      :ref="forwardElement"
      :[DATA_COLLECTION_ITEM]="true"
      :tabindex="rovingFocusGroupItem.tabindex()"
      :data-orientation="rovingFocusGroupItem.orientation()"

      :value="value"
      :disabled="disabled"
      :style="{
        border: '1px solid',
        borderColor: '#ccc',
        padding: '5px 10px',
        borderRadius: '5px',
        ...(isSelected
          ? {
            borderColor: '#111',
            backgroundColor: '#111',
            color: 'white',
          }
          : {}),
      }"

      @click="() => {
        if (disabled)
          return
        context.setValue(value)
      }"

      @mousedown="rovingFocusGroupItem.onMousedown"
      @focus="onFocus"
      @keydown="rovingFocusGroupItem.onKeydown"
    >
      <slot />
    </button>
  </RovingFocusGroupItem>
</template>
