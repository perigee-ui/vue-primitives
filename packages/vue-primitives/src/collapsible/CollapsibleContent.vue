<script setup lang="ts">
import { convertPropsToHookProps, normalizeAttrs } from '../shared/index.ts'
import { type CollapsibleContentProps, DEFAULT_COLLAPSIBLE_CONTENT_PROPS, useCollapsibleContent } from './CollapsibleContent.ts'
import CollapsibleContentImpl from './CollapsibleContentImpl.vue'

defineOptions({
  name: 'CollapsibleContent',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<CollapsibleContentProps>(), DEFAULT_COLLAPSIBLE_CONTENT_PROPS)

const collapsibleContent = useCollapsibleContent(convertPropsToHookProps(props))
</script>

<template>
  <CollapsibleContentImpl :present="collapsibleContent.isPresent.value" v-bind="normalizeAttrs(collapsibleContent.attrs([$attrs]))">
    <slot />
  </CollapsibleContentImpl>
</template>
