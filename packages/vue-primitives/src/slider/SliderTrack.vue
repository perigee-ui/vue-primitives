<script setup lang="ts">
import { useSliderContext } from './SliderRoot.ts'

defineOptions({
  name: 'SliderTrack',
})

const context = useSliderContext('SliderTrack')
</script>

<template>
  <span
    :data-disabled="context.disabled() ? '' : undefined"
    :data-orientation="context.orientation()"
  >
    <slot />
  </span>
</template>
