<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useForwardElement, useRef } from '../hooks/index.ts'
import { Primitive } from '../primitive/index.ts'
import { context } from './DismissableLayer.ts'

defineOptions({
  name: 'DismissableLayerBranch',
})

const elRef = useRef<HTMLElement>()
const forwardElement = useForwardElement(elRef)

onMounted(() => {
  context.branches.add(elRef.value!)
})

onBeforeUnmount(() => {
  context.branches.delete(elRef.value!)
})
</script>

<template>
  <Primitive :ref="forwardElement">
    <slot />
  </Primitive>
</template>
