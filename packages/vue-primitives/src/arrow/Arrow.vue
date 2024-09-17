<script setup lang="ts">
import type { ArrowProps } from './Arrow.ts'

defineOptions({
  name: 'Arrow',
})

withDefaults(defineProps<ArrowProps>(), {
  width: 10,
  height: 5,
})
</script>

<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 30 10"
    preserveAspectRatio="none"
  >
    <slot><polygon points="0,0 30,0 15,10" /></slot>
  </svg>
</template>
