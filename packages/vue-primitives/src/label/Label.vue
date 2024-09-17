<script setup lang="ts">
import type { LabelEmits } from './Label.ts'

defineOptions({
  name: 'RadixLabel',
})

const emit = defineEmits<LabelEmits>()

function onMousedown(event: MouseEvent) {
  // only prevent text selection if clicking inside the label itself
  const target = event.target as HTMLElement
  if (target.closest('button, input, select, textarea'))
    return

  emit('mousedown', event)
  // prevent text selection when double clicking label
  if (!event.defaultPrevented && event.detail > 1)
    event.preventDefault()
}
</script>

<template>
  <label @mousedown="onMousedown">
    <slot />
  </label>
</template>
