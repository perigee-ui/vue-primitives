<script setup lang="ts">
import type { DialogCloseEmits } from './DialogClose.ts'
import { composeEventHandlers } from '../utils/vue.ts'
import { useDialogContext } from './DialogRoot.ts'

defineOptions({
  name: 'DialogClose',
})

const emit = defineEmits<DialogCloseEmits>()

const context = useDialogContext('DialogClose')

const onClick = composeEventHandlers<MouseEvent>((event) => {
  emit('click', event)
}, () => context.onOpenChange(false))
</script>

<template>
  <button type="button" @click="onClick">
    <slot />
  </button>
</template>
