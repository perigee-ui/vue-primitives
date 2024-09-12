<script setup lang="ts">
import { useRef } from '../hooks/index.ts'
import { useContextMenuContext } from './ContextMenuRoot.ts'
import type { Point } from '../utils/isPointInPolygon.ts'
import type { ContextMenuTriggerEmits, ContextMenuTriggerProps } from './ContextMenuTrigger'
import { composeEventHandlers } from '../utils/vue.ts';
import { Primitive } from '../primitive/index.ts';

defineOptions({
  name: 'ContextMenuTrigger',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ContextMenuTriggerProps>(), {
  as: 'span',
  disabled: false,
})

const emit = defineEmits<ContextMenuTriggerEmits>()

const context = useContextMenuContext('ContextMenuTrigger')
const pointRef = useRef<Point>({ x: 0, y: 0 })
const virtualRef = useRef({
  getBoundingClientRect: () => DOMRect.fromRect({ width: 0, height: 0, ...pointRef.current }),
})
const longPressTimerRef = useRef(0)

const clearLongPress = () => {
  window.clearTimeout(longPressTimerRef.current),
}

function handleOpen(event: MouseEvent | PointerEvent) {
  pointRef.current = { x: event.clientX, y: event.clientY }
  context.onOpenChange(true)
}

// React.useEffect(() => clearLongPress, [clearLongPress])
// React.useEffect(() => void (disabled && clearLongPress()), [disabled, clearLongPress])


const onContextmenu = composeEventHandlers<MouseEvent>((event) => {
  emit('contextmenu', event)
}, (event) => {
  // clearing the long press here because some platforms already support
  // long press to trigger a `contextmenu` event
  clearLongPress();
  handleOpen(event);
  event.preventDefault();
})

const onPointerdown = composeEventHandlers<PointerEvent>(
  (event) => {
    emit('pointerdown', event);
  },
  (event) => {
    if (props.disabled) return
    if (event.pointerType === 'mouse') return
    // clear the long press here in case there's multiple touch points
    clearLongPress();
    longPressTimerRef.current = window.setTimeout(() => handleOpen(event), 700);
  })


const onPointermove = composeEventHandlers<PointerEvent>((event) => {
  emit('pointermove', event);
}, (event) => {

  if (props.disabled) return
  if (event.pointerType === 'mouse') return
  clearLongPress()
})

const onPointercancel = composeEventHandlers<PointerEvent>((event) => {
  emit('pointercancel', event);
}, (event) => {
  if (props.disabled) return
  if (event.pointerType === 'mouse') return
  clearLongPress()
})

const onPointerup = composeEventHandlers<PointerEvent>((event) => {
  emit('pointerup', event);
}, (event) => {
  if (props.disabled) return
  if (event.pointerType === 'mouse') return
  clearLongPress()
})


</script>

<template>
  <Primitive
    :as="as"
    :data-state="context.open.value ? 'open' : 'closed'"
    :data-disabled="disabled ? '' : undefined"
    style="-webkit-touch-callout: none"
    v-bind="$attrs"
    @contextmenu="onContextmenu"
    @pointerdown="onPointerdown"
    @pointermove="onPointermove"
    @pointercancel="onPointercancel"
    @pointerup="onPointerup"
  >
    <slot />
  </Primitive>
</template>
