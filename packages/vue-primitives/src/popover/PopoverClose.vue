<script setup lang="ts">
import type { PopoverCloseEmits } from './PopoverClose.ts'
import { composeEventHandlers } from '../utils/vue.ts'
import { usePopoverContext } from './PopoverRoot.ts'

defineOptions({
  name: 'PopoverClose',
})

const emit = defineEmits<PopoverCloseEmits>()

const context = usePopoverContext('PopoverClose')

const onClick = composeEventHandlers<MouseEvent>((event) => {
  emit('click', event)
}, () => {
  context.onOpenChange(false)
})
</script>

<template>
  <button
    type="button"
    @click="onClick"
  >
    <slot />
  </button>
</template>
