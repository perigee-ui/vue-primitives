<script setup lang="ts">
import { onBeforeUnmount, onMounted, watchEffect } from 'vue'
import { isClient } from '@vueuse/core'
import { useToastProviderContext } from './ToastProvider.ts'
import { type ToastViewportProps, VIEWPORT_PAUSE, VIEWPORT_RESUME } from './ToastViewport'

defineOptions({
  name: 'ToastViewport',
})

const props = withDefaults(defineProps<ToastViewportProps>(), {
  hotkey: () => ['F8'],
  label: 'Notifications ({hotkey})',
})

const context = useToastProviderContext('ToastViewport')
let wrapperRef: HTMLDivElement | undefined
let headFocusProxyRef: FocusProxyElement | undefined
let tailFocusProxyRef: FocusProxyElement | undefined
let $el: ToastViewportElement | undefined
// const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
const hotkeyLabel = hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, '')
const hasToasts = context.toastCount > 0

function handleKeyDown(event: KeyboardEvent) {
  // we use `event.code` as it is consistent regardless of meta keys that were pressed.
  // for example, `event.key` for `Control+Alt+t` is `†` and `t !== †`
  const isHotkeyPressed = props.hotkey.every(key => (event as any)[key] || event.code === key)
  if (isHotkeyPressed)
    $el.value?.focus()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

if (isClient) {
  watchEffect((onCleanup) => {
    const viewport = $el.current
    if (!hasToasts || !wrapperRef || !viewport)
      return

    const handlePause = () => {
      if (!context.isClosePausedRef.current) {
        const pauseEvent = new CustomEvent(VIEWPORT_PAUSE)
        viewport.dispatchEvent(pauseEvent)
        context.isClosePausedRef.current = true
      }
    }

    const handleResume = () => {
      if (context.isClosePausedRef.current) {
        const resumeEvent = new CustomEvent(VIEWPORT_RESUME)
        viewport.dispatchEvent(resumeEvent)
        context.isClosePausedRef.current = false
      }
    }

    const handleFocusOutResume = (event: FocusEvent) => {
      const isFocusMovingOutside = !wrapperRef.contains(event.relatedTarget as HTMLElement)
      if (isFocusMovingOutside)
        handleResume()
    }

    const handlePointerLeaveResume = () => {
      const isFocusInside = wrapperRef.contains(document.activeElement)
      if (!isFocusInside)
        handleResume()
    }

    // Toasts are not in the viewport React tree so we need to bind DOM events
    wrapperRef.addEventListener('focusin', handlePause)
    wrapperRef.addEventListener('focusout', handleFocusOutResume)
    wrapperRef.addEventListener('pointermove', handlePause)
    wrapperRef.addEventListener('pointerleave', handlePointerLeaveResume)
    window.addEventListener('blur', handlePause)
    window.addEventListener('focus', handleResume)

    onCleanup(() => {
      wrapperRef.removeEventListener('focusin', handlePause)
      wrapperRef.removeEventListener('focusout', handleFocusOutResume)
      wrapperRef.removeEventListener('pointermove', handlePause)
      wrapperRef.removeEventListener('pointerleave', handlePointerLeaveResume)
      window.removeEventListener('blur', handlePause)
      window.removeEventListener('focus', handleResume)
    })
  })
}

function getSortedTabbableCandidates({ tabbingDirection }: { tabbingDirection: 'forwards' | 'backwards' }) {
  const toastItems = getItems()

  const tabbableCandidates = toastItems.map((toastItem) => {
    const toastNode = toastItem.ref.current!
    const toastTabbableCandidates = [toastNode, ...getTabbableCandidates(toastNode)]
    return tabbingDirection === 'forwards'
      ? toastTabbableCandidates
      : toastTabbableCandidates.reverse()
  })

  return (
    tabbingDirection === 'forwards' ? tabbableCandidates.reverse() : tabbableCandidates
  ).flat()
}

watchEffect(() => {
  const viewport = $el.current
  // We programmatically manage tabbing as we are unable to influence
  // the source order with portals, this allows us to reverse the
  // tab order so that it runs from most recent toast to least
  if (!viewport)
    return
  const handleKeyDown = (event: KeyboardEvent) => {
    const isMetaKey = event.altKey || event.ctrlKey || event.metaKey
    const isTabKey = event.key === 'Tab' && !isMetaKey

    if (isTabKey) {
      const focusedElement = document.activeElement
      const isTabbingBackwards = event.shiftKey
      const targetIsViewport = event.target === viewport

      // If we're back tabbing after jumping to the viewport then we simply
      // proxy focus out to the preceding document
      if (targetIsViewport && isTabbingBackwards) {
        headFocusProxyRef.current?.focus()
        return
      }

      const tabbingDirection = isTabbingBackwards ? 'backwards' : 'forwards'
      const sortedCandidates = getSortedTabbableCandidates({ tabbingDirection })
      const index = sortedCandidates.findIndex(candidate => candidate === focusedElement)
      if (focusFirst(sortedCandidates.slice(index + 1))) {
        event.preventDefault()
      }
      else {
        // If we can't focus that means we're at the edges so we
        // proxy to the corresponding exit point and let the browser handle
        // tab/shift+tab keypress and implicitly pass focus to the next valid element in the document
        isTabbingBackwards
          ? headFocusProxyRef.current?.focus()
          : tailFocusProxyRef.current?.focus()
      }
    }
  }

  // Toasts are not in the viewport React tree so we need to bind DOM events
  viewport.addEventListener('keydown', handleKeyDown)
  return () => viewport.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
</template>
