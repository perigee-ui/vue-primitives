<script setup lang="ts">
import type { ToastCloseEmits, ToastCloseProps } from './ToastClose.ts'
import { composeEventHandlers } from '../utils/vue.ts'
import { useToastInteractiveContext } from './ToastRoot.ts'

defineOptions({
  name: 'ToastClose',
})

defineProps<ToastCloseProps>()

const emit = defineEmits<ToastCloseEmits>()

const interactiveContext = useToastInteractiveContext('ToastClose')

const onClick = composeEventHandlers<MouseEvent>((event) => {
  emit('click', event)
}, interactiveContext.onClose)
</script>

<template>
  <button
    type="button"
    data-radix-toast-announce-exclude=""
    :data-radix-toast-announce-alt="altText || undefined"
    @click="onClick"
  >
    <slot />
  </button>
</template>
