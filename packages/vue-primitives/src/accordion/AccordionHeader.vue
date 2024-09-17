<script setup lang="ts">
import { useAccordionItemContext } from './AccordionItem.ts'
import { useAccordionContext } from './AccordionRoot.ts'
import { getState } from './utils.ts'

defineOptions({
  name: 'AccordionHeader',
})

const accordionContext = useAccordionContext('AccordionHeader')
const itemContext = useAccordionItemContext('AccordionHeader')
</script>

<template>
  <h3
    :data-orientation="accordionContext.orientation"
    :data-state="getState(itemContext.open.value)"
    :data-disabled="itemContext.disabled.value ? '' : undefined"
  >
    <slot />
  </h3>
</template>
