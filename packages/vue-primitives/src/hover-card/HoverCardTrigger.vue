<script setup lang="ts">
import type { HoverCardTriggerEmits, HoverCardTriggerProps } from './HoverCardTrigger.ts'
import { onMounted } from 'vue'
import { useForwardElement, useRef } from '../hooks/index.ts'
import { usePopperContext } from '../popper/index.ts'
import { Primitive } from '../primitive/index.ts'
import { composeEventHandlers } from '../shared/index.ts'
import { useHoverCardContext } from './HoverCardRoot.ts'
import { excludeTouch } from './utils.ts'

defineOptions({
  name: 'HoverCardTrigger',
})

const props = withDefaults(defineProps<HoverCardTriggerProps>(), {
  as: 'a',
})

const emit = defineEmits<HoverCardTriggerEmits>()

const context = useHoverCardContext('HoverCardTrigger')

const onPointerenter = composeEventHandlers<PointerEvent>((event) => {
  emit('pointerenter', event)
}, excludeTouch(context.onOpen))

const onPointerleave = composeEventHandlers<PointerEvent>((event) => {
  emit('pointerleave', event)
}, excludeTouch(context.onClose))

const onFocus = composeEventHandlers<FocusEvent>((event) => {
  emit('focus', event)
}, context.onOpen)

const onBlur = composeEventHandlers<FocusEvent>((event) => {
  emit('blur', event)
}, context.onClose)

// prevent focus event on touch devices
const onTouchstart = composeEventHandlers<TouchEvent>((event) => {
  emit('touchstart', event)
}, event => event.preventDefault())

// COMP::PopperAnchor

const popperContext = usePopperContext('PopperAnchor')

const elRef = useRef<HTMLDivElement>()
const forwardElement = useForwardElement(elRef)

onMounted(() => {
  popperContext.onAnchorChange(props.virtualRef?.current || elRef.current)
})
</script>

<template>
  <Primitive
    v-if="!virtualRef"
    :ref="forwardElement"
    :as="as"
    :data-state="context.open.value ? 'open' : 'closed'"
    @pointerenter="onPointerenter"
    @pointerleave="onPointerleave"
    @focus="onFocus"
    @blur="onBlur"
    @touchstart="onTouchstart"
  >
    <slot />
  </Primitive>
</template>
