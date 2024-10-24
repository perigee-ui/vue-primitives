<script setup lang="ts">
import { Primitive } from '../primitive/index.ts'
import { convertPropsToHookProps, normalizeAttrs } from '../shared/index.ts'
import { type CollapsibleContentImplProps, useCollapsibleContentImpl } from './CollapsibleContentImpl.ts'

defineOptions({
  name: 'CollapsibleContentImpl',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<CollapsibleContentImplProps>(), {})

const collapsibleContent = useCollapsibleContentImpl(convertPropsToHookProps(props, ['present']))
</script>

<template>
  <Primitive v-bind="normalizeAttrs(collapsibleContent.attrs([$attrs]))">
    <slot v-if="collapsibleContent.isOpen.value" />
  </Primitive>
</template>
