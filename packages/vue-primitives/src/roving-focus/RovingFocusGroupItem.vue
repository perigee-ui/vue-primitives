<script setup lang="ts">
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
</script>

<template>
  <span v-bind="rovingFocusGroupItem()">
    <slot />
  </span>
</template>
