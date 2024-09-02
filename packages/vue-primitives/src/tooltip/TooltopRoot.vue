<script setup lang="ts">
import { shallowRef } from 'vue'
import { tryOnScopeDispose } from '@vueuse/core'
import { useControllableState } from '../hooks/index.ts'
import { PopperRoot } from '../popper/index.ts'
import { useTooltipProviderContext } from './TooltipProvider.ts'
import { TOOLTIP_OPEN, type TooltipEmits, type TooltipProps, provideTooltipContext } from './TooltopRoot.ts'

defineOptions({
  name: 'Tooltip',
})

const props = withDefaults(defineProps<TooltipProps>(), {
  open: undefined,
  defaultOpen: false,
  delayDuration: undefined,
  disableHoverableContent: undefined,
})
const emit = defineEmits<TooltipEmits>()

const providerContext = useTooltipProviderContext('Tooltip')
const trigger = shallowRef<HTMLButtonElement>()

let openTimerRef = 0

const disableHoverableContent = () => props.disableHoverableContent ?? providerContext.disableHoverableContent
const delayDuration = () => props.delayDuration ?? providerContext.delayDuration
let wasOpenDelayedRef = false

const open = useControllableState(
  props,
  (v) => {
    if (v) {
      providerContext.onOpen()

      // as `onChange` is called within a lifecycle method we
      // avoid dispatching via `dispatchDiscreteCustomEvent`.
      document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN))
    }
    else {
      providerContext.onClose()
    }
    emit('update:open', v)
  },
  'open',
  props.defaultOpen,
)

function handleOpen() {
  window.clearTimeout(openTimerRef)
  wasOpenDelayedRef = false
  open.value = true
}

function handleClose() {
  window.clearTimeout(openTimerRef)
  open.value = false
}

function handleDelayedOpen() {
  window.clearTimeout(openTimerRef)
  openTimerRef = window.setTimeout(() => {
    wasOpenDelayedRef = true
    open.value = true
  }, delayDuration())
}

tryOnScopeDispose(() => {
  window.clearTimeout(openTimerRef)
})

provideTooltipContext({
  contentId: undefined,
  open,
  stateAttribute() {
    return open.value ? (wasOpenDelayedRef ? 'delayed-open' : 'instant-open') : 'closed'
  },
  trigger,
  onTriggerChange(v) {
    trigger.value = v
  },
  onTriggerEnter() {
    if (providerContext.isOpenDelayed)
      handleDelayedOpen()
    else handleOpen()
  },
  onTriggerLeave() {
    if (disableHoverableContent()) {
      handleClose()
    }
    else {
      // Clear the timer in case the pointer leaves the trigger before the tooltip is opened.
      window.clearTimeout(openTimerRef)
    }
  },
  onOpen: handleOpen,
  onClose: handleClose,
  disableHoverableContent,
})
</script>

<template>
  <PopperRoot>
    <slot />
  </PopperRoot>
</template>
