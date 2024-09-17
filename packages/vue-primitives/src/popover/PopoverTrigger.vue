<script setup lang="ts">
import type { PopoverTriggerEmits } from './PopoverTrigger.ts'
import { shallowRef, watchEffect } from 'vue'
import { useComposedElements } from '../hooks/index.ts'
import { usePopperContext } from '../popper/index.ts'
import { composeEventHandlers } from '../utils/vue.ts'
import { usePopoverContext } from './PopoverRoot.ts'
import { getState } from './utilts.ts'

defineOptions({
  name: 'PopoverTrigger',
})

const emit = defineEmits<PopoverTriggerEmits>()
const context = usePopoverContext('PopoverTrigger')
const popperContext = usePopperContext('PopoverTrigger')

const $el = shallowRef<HTMLButtonElement>()

const composedElements = useComposedElements<HTMLButtonElement>((v) => {
  context.triggerRef.current = v
  $el.value = v
})

// COMP::PopperAnchor

const onClick = composeEventHandlers<MouseEvent>((event) => {
  emit('click', event)
}, context.onOpenToggle)

watchEffect(() => {
  if (!context.hasCustomAnchor.value && $el.value) {
    popperContext.onAnchorChange($el.value)
  }
})
</script>

<template>
  <button
    :ref="composedElements"
    type="button"
    aria-haspopup="dialog"
    :aria-expanded="context.open.value"
    :aria-controls="context.contentId"
    :data-state="getState(context.open.value)"
    @click="onClick"
  >
    <slot />
  </button>
</template>
