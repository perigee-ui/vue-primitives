<script setup lang="ts">
import { useDialogContext } from './DialogRoot.ts'

defineOptions({
  name: 'DialogDescription',
})

const context = useDialogContext('DialogDescription')
</script>

<template>
  <p :id="context.descriptionId">
    <slot />
  </p>
</template>
