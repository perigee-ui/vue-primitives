<script setup lang="ts">
import { shallowRef, watchEffect } from 'vue'
import { useId } from '../hooks/index.ts'
import { PopperRoot } from '../popper/index.ts'
import { provedeMenuContext, useMenuContext } from './MenuRoot.ts'
import { type MenuSubEmits, type MenuSubProps, provideMenuSubContext } from './MenuSub.ts'

defineOptions({
  name: 'MenuSub',
})

const props = withDefaults(defineProps<MenuSubProps>(), {
  open: false,
})
const emit = defineEmits<MenuSubEmits>()

const parentMenuContext = useMenuContext('MenuSub')
const trigger = shallowRef<HTMLDivElement>()
const content = shallowRef<HTMLDivElement>()

// Prevent the parent menu from reopening with open submenus.
watchEffect((onCleanup) => {
  if (parentMenuContext.open() === false)
    emit('update:open', false)

  onCleanup(() => {
    emit('update:open', false)
  })
})

provedeMenuContext({
  open() {
    return props.open
  },
  onOpenChange(open) {
    emit('update:open', open)
  },
  content,
  onContentChange(el) {
    content.value = el
  },
})

provideMenuSubContext({
  contentId: useId(),
  triggerId: useId(),
  trigger,
  onTriggerChange(el) {
    trigger.value = el
  },
})
</script>

<template>
  <PopperRoot>
    <slot />
  </PopperRoot>
</template>
