<script setup lang="ts">
import { useDialogContext } from './DialogRoot.ts'

defineOptions({
  name: 'DialogTitle',
})

const context = useDialogContext('DialogTitle')
</script>

<template>
  <h2 :id="context.titleId">
    <slot />
  </h2>
</template>
