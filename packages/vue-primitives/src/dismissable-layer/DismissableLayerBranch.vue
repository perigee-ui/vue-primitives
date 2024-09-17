<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useForwardElement, useRef } from '../hooks/index.ts'
import { context } from './DismissableLayer.ts'

defineOptions({
  name: 'DismissableLayerBranch',
})

const elRef = useRef<HTMLElement>()
const forwardElement = useForwardElement(elRef)

onMounted(() => {
  context.branches.add(elRef.current!)
})

onBeforeUnmount(() => {
  context.branches.delete(elRef.current!)
})
</script>

<template>
  <div :ref="forwardElement">
    <slot />
  </div>
</template>
