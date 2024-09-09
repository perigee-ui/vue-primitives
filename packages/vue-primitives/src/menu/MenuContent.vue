<script setup lang="ts">
import { useForwardElement, useRef } from '../hooks/index.ts'
import { usePresence } from '../presence/index.ts'
import { Collection, useMenuContext, useMenuRootContext } from './MenuRoot.ts'
import MenuRootContentModal from './MenuRootContentModal.vue'
import MenuRootContentNonModal from './MenuRootContentNonModal.vue'
import type { MenuContentProps } from './MenuContent.ts'

defineOptions({
  name: 'MenuContent',
})

const props = defineProps<MenuContentProps>()

const elRef = useRef<HTMLElement>()
const forwardElement = useForwardElement(elRef)

Collection.provideCollectionContext(elRef)

const context = useMenuContext('MenuContent')
const rootContext = useMenuRootContext('MenuContent')

const isPresent = usePresence(context.content, () => props.forceMount || context.open())

const Comp = rootContext.modal ? MenuRootContentModal : MenuRootContentNonModal

defineExpose({
  $el: context.content,
})
</script>

<template>
  <Comp v-if="isPresent" :ref="forwardElement">
    <slot />
  </Comp>
</template>
