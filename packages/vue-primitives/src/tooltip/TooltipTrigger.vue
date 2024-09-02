<script setup lang="ts">
import { onBeforeUnmount, useAttrs } from 'vue'
import { PopperAnchor } from '../popper/index.ts'
import { Primitive } from '../primitive/index.ts'
import { composeEventHandlers } from '../utils/vue.ts'
import { isFunction } from '../utils/is.ts'
import { useTooltipProviderContext } from './TooltipProvider.ts'
import type { TooltipTriggerProps } from './TooltipTrigger'
import { useTooltipContext } from './TooltopRoot.ts'

defineOptions({
  name: 'TooltipTrigger',
  inheritAttrs: false,
})

defineProps<TooltipTriggerProps>()
const attrs = useAttrs()

const context = useTooltipContext('TooltipTrigger')
const providerContext = useTooltipProviderContext('TooltipTrigger')

function onTriggerChange(nodeRef: any) {
  const node = nodeRef ? nodeRef.$el : undefined
  context.onTriggerChange(node)
}

let isPointerDownRef = false
let hasPointerMoveOpenedRef = false

function handlePointerUp() {
  isPointerDownRef = false
}

onBeforeUnmount(() => {
  document.removeEventListener('pointerup', handlePointerUp)
})

const onPointermove = composeEventHandlers<PointerEvent>((event) => {
  if (isFunction(attrs.onPointermove))
    attrs.onPointermove(event)
}, (event) => {
  if (event.pointerType === 'touch')
    return
  if (
    !hasPointerMoveOpenedRef
    && !providerContext.isPointerInTransitRef.current
  ) {
    context.onTriggerEnter()
    hasPointerMoveOpenedRef = true
  }
})

const onPointerleave = composeEventHandlers<PointerEvent>((event) => {
  if (isFunction(attrs.onPointerleave))
    attrs.onPointerleave(event)
}, () => {
  context.onTriggerLeave()
  hasPointerMoveOpenedRef = false
})

const onPointerdown = composeEventHandlers<PointerEvent>((event) => {
  if (isFunction(attrs.onPointerdown))
    attrs.onPointerdown(event)
}, () => {
  isPointerDownRef = true
  document.addEventListener('pointerup', handlePointerUp, { once: true })
})

const onFocus = composeEventHandlers((event) => {
  if (isFunction(attrs.onFocus))
    attrs.onFocus(event)
}, () => {
  if (!isPointerDownRef)
    context.onOpen()
})

const onBlur = composeEventHandlers((event) => {
  if (isFunction(attrs.onBlur)) {
    attrs.onBlur(event)
  }
}, context.onClose)

const onClick = composeEventHandlers((event) => {
  if (isFunction(attrs.onClick)) {
    attrs.onClick(event)
  }
}, context.onClose)

defineExpose({
  $el: context.trigger,
})
</script>

<template>
  <PopperAnchor as-child>
    <Primitive
      :ref="onTriggerChange"
      :as="as"
      :as-child="asChild"
      :aria-describedby="context.open.value ? context.contentId : undefined"
      :data-state="context.stateAttribute()"
      data-grace-area-trigger
      v-bind="{
        ...attrs,
        onPointermove,
        onPointerleave,
        onPointerdown,
        onFocus,
        onBlur,
        onClick,
      }"
    >
      <slot />
    </Primitive>
  </PopperAnchor>
</template>
