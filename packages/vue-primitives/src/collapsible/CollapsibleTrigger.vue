<script setup lang="ts">
import type { CollapsibleTriggerEmits } from './CollapsibleTrigger.ts'
import { composeEventHandlers } from '../utils/vue.ts'
import { useCollapsibleContext } from './CollapsibleRoot.ts'
import { getState } from './utils.ts'

defineOptions({
  name: 'CollapsibleTrigger',
})

const emit = defineEmits<CollapsibleTriggerEmits>()

const context = useCollapsibleContext('CollapsibleTrigger')

const onClick = composeEventHandlers<MouseEvent>((event) => {
  emit('click', event)
}, context.onOpenToggle)
</script>

<template>
  <button
    type="button"
    :aria-controls="context.contentId"
    :aria-expanded="context.open.value || false"
    :data-state="getState(context.open.value)"
    :data-disabled="context.disabled() ? '' : undefined"
    :disabled="context.disabled()"
    @click="onClick"
  >
    <slot />
  </button>
</template>
