<script setup lang="ts">
import { useAccordionHeader } from './AccordionHeader.ts'

defineOptions({
  name: 'AccordionHeader',
})

const accordionHeader = useAccordionHeader()
</script>

<template>
  <h3 v-bind="accordionHeader()">
    <slot />
  </h3>
</template>
