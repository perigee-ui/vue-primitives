<script setup lang="ts">
import type { SeparatorProps } from './Separator.ts'

defineOptions({
  name: 'Separator',
})

withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal',
})

const decorativeAttrs = { role: 'none' }
</script>

<template>
  <div
    :data-orientation="orientation"
    v-bind="decorative
      ? decorativeAttrs
      : {
        'aria-orientation': orientation === 'vertical' ? orientation : undefined,
        'role': 'separator',
      }
    "
  >
    <slot />
  </div>
</template>
