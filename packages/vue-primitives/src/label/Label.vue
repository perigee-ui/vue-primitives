<script setup lang="ts">
import { Primitive } from '../primitive/index.ts'
import { type LabelEmits, type LabelProps, useLabel } from './Label.ts'

defineOptions({
  name: 'RadixLabel',
})

withDefaults(defineProps<LabelProps>(), {
  as: 'label',
})
const emit = defineEmits<LabelEmits>()

const label = useLabel({
  onMousedown(event) {
    emit('mousedown', event)
  },
})
</script>

<template>
  <Primitive :as="as" v-bind="label">
    <slot />
  </Primitive>
</template>
