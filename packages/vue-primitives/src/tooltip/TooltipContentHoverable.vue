<script setup lang="ts">
import { isClient } from '@vueuse/core'
import { onBeforeUnmount, onWatcherCleanup, shallowRef, watchEffect } from 'vue'
import { usePopperContext } from '../popper/index.ts'
import { isPointInPolygon, type Polygon } from '../shared/index.ts'
import TooltipContentImpl from './TooltipContentImpl.vue'
import { useTooltipProviderContext } from './TooltipProvider.ts'
import { useTooltipContext } from './TooltipRoot.ts'
import { getExitSideFromRect, getHull, getPaddedExitPoints, getPointsFromRect } from './utils.ts'

defineOptions({
  name: 'TooltipContentHoverable',
})

const context = useTooltipContext('TooltipContentHoverable')
const providerContext = useTooltipProviderContext('TooltipContentHoverable')
const popperContext = usePopperContext('TooltipContentHoverable')

const pointerGraceArea = shallowRef<Polygon>()

function handleRemoveGraceArea() {
  pointerGraceArea.value = undefined
  providerContext.onPointerInTransitChange(false)
}

function handleCreateGraceArea(event: PointerEvent, hoverTarget: HTMLElement) {
  const currentTarget = event.currentTarget as HTMLElement
  const exitPoint = { x: event.clientX, y: event.clientY }
  const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect())
  const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide)
  const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect())
  const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints])
  pointerGraceArea.value = graceArea
  providerContext.onPointerInTransitChange(true)
}

onBeforeUnmount(() => {
  handleRemoveGraceArea()
})

if (isClient) {
  watchEffect(() => {
    const triggerVal = context.trigger.value
    const contentVal = popperContext.content.value

    if (!triggerVal || !contentVal)
      return

    const handleTriggerLeave = (event: PointerEvent) => handleCreateGraceArea(event, contentVal)
    const handleContentLeave = (event: PointerEvent) => handleCreateGraceArea(event, triggerVal)

    triggerVal.addEventListener('pointerleave', handleTriggerLeave)
    contentVal.addEventListener('pointerleave', handleContentLeave)

    onWatcherCleanup(() => {
      triggerVal.removeEventListener('pointerleave', handleTriggerLeave)
      contentVal.removeEventListener('pointerleave', handleContentLeave)
    })
  })

  function handleTrackPointerGrace(event: PointerEvent) {
    const target = event.target as HTMLElement
    const pointerPosition = { x: event.clientX, y: event.clientY }
    const hasEnteredTarget = context.trigger.value?.contains(target) || popperContext.content.value?.contains(target)
    const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea.value!)

    if (hasEnteredTarget) {
      handleRemoveGraceArea()
    }
    else if (isPointerOutsideGraceArea) {
      handleRemoveGraceArea()
      context.onClose()
    }
  }

  watchEffect(() => {
    if (!pointerGraceArea.value)
      return

    document.addEventListener('pointermove', handleTrackPointerGrace)

    onWatcherCleanup(() => {
      document.removeEventListener('pointermove', handleTrackPointerGrace)
    })
  })
}
</script>

<template>
  <TooltipContentImpl>
    <slot />
  </TooltipContentImpl>
</template>
