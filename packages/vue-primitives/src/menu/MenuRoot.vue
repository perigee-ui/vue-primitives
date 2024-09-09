<script setup lang="ts">
import { shallowRef } from 'vue'
import { useDirection } from '../direction/Direction.ts'
import { providePopperContext } from '../popper/index.ts'
import {
  type MenuRootEmits,
  type MenuRootProps,
  provedeMenuContext,
  provideMenuRootContext,
  useIsUsingKeyboard,
} from './MenuRoot.ts'
import type { Measurable } from '../popper/index.ts'

defineOptions({
  name: 'MenuRoot',
})

const props = withDefaults(defineProps<MenuRootProps>(), {
  open: false,
  modal: true,
})

const emit = defineEmits<MenuRootEmits>()

const content = shallowRef<HTMLDivElement>()
const isUsingKeyboardRef = useIsUsingKeyboard()
const direction = useDirection(() => props.dir)

provedeMenuContext({
  open() {
    return props.open
  },
  onOpenChange(open) {
    emit('update:open', open)
  },
  content,
  onContentChange(payload) {
    content.value = payload
  },
})

provideMenuRootContext({
  onClose() {
    emit('update:open', false)
  },
  isUsingKeyboardRef,
  dir: direction,
  modal: props.modal,
})

// COMP::PopperRoot

const anchor = shallowRef<Measurable>()

providePopperContext({
  anchor,
  onAnchorChange(newAnchor: Measurable | undefined) {
    anchor.value = newAnchor
  },
})
</script>

<template>
  <slot />
</template>
