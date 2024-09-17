<script setup lang="ts">
import { useForwardElement } from '../hooks/index.ts'
import { useScrollAreaContext } from './ScrollAreaRoot.ts'

defineOptions({
  name: 'ScrollAreaContent',
})

const context = useScrollAreaContext('ScrollAreaContent')
const forwardedContentRef = useForwardElement(context.content)
</script>

<template>
  <div
    :ref="forwardedContentRef"
    style="min-width: 100%; display: table"
  >
    <slot />
  </div>
</template>
