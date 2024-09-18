<script setup lang="ts">
import { shallowRef } from 'vue'
import { useForwardElement } from '../hooks/index.ts'
import { Primitive } from '../primitive/index.ts'
import { type CollapsibleContentProps, useCollapsibleContent } from './CollapsibleContent.ts'

defineOptions({
  name: 'CollapsibleContent',
})

const props = defineProps<CollapsibleContentProps>()
const el = shallowRef<HTMLElement>()
const forwardElement = useForwardElement(el)

const isOpen = shallowRef(false)

const collapsibleContent = useCollapsibleContent({
  el,
  isOpen,
}, props)
</script>

<template>
  <Primitive :ref="forwardElement" v-bind="collapsibleContent()">
    <slot v-if="isOpen" />
  </Primitive>
</template>
