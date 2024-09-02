<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, useAttrs, watch } from 'vue'
import DismissableLayer from '../dismissable-layer/DismissableLayer.vue'
import { PopperContent } from '../popper/index.ts'
import type { FocusOutsideEvent } from '../dismissable-layer/DismissableLayer.ts'
import { useForwardElement } from '../hooks/index.ts'
import { TOOLTIP_OPEN, useTooltipContext } from './TooltopRoot.ts'
import type { TooltipContentImplEmits, TooltipContentImplProps } from './TooltipContentImpl.ts'

defineOptions({
  name: 'TooltipContentImpl',
  inheritAttrs: false,
})

const props = defineProps<TooltipContentImplProps>()
const emit = defineEmits<TooltipContentImplEmits>()

const $el = shallowRef<HTMLElement>()
const forwardElement = useForwardElement($el)

const attrs = useAttrs()

const context = useTooltipContext('TooltipContentImpl')

onMounted(() => {
  document.addEventListener(TOOLTIP_OPEN, context.onClose)
})

onBeforeUnmount(() => {
  document.removeEventListener(TOOLTIP_OPEN, context.onClose)
})

// Close the tooltip if the trigger is scrolled
watch(context.trigger, (trigger, _, onCleanup) => {
  if (!trigger)
    return

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement
    if (target?.contains(trigger))
      context.onClose()
  }

  window.addEventListener('scroll', handleScroll, { capture: true })

  onCleanup(() => {
    window.removeEventListener('scroll', handleScroll, { capture: true })
  })
})

function focusOutside(event: FocusOutsideEvent) {
  event.preventDefault()
}

defineExpose({
  $el,
})
</script>

<template>
  <DismissableLayer
    as-child
    :disable-outside-pointer-events="false"
    @escape-keydown="emit('escapeKeydown', $event)"
    @pointerdown-outside="emit('pointerdownOutside', $event)"
    @focus-outside="focusOutside"
    @dismiss="context.onClose"
  >
    <PopperContent
      :ref="forwardElement"
      :data-state="context.stateAttribute()"
      v-bind="attrs"
      style="--radix-tooltip-content-transform-origin: var(--radix-popper-transform-origin); --radix-tooltip-content-available-width: var(--radix-popper-available-width); --radix-tooltip-content-available-height: var(--radix-popper-available-height); --radix-tooltip-trigger-width: var(--radix-popper-anchor-width); --radix-tooltip-trigger-height: var(--radix-popper-anchor-height);"
    >
      <slot />
    </PopperContent>
  </DismissableLayer>
</template>
