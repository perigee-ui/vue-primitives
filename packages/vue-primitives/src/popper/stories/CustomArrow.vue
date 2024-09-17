<script setup lang="ts">
import { OPPOSITE_SIDE, useContentContext } from '../index.ts'

const contentContext = useContentContext('PopperArrow')
</script>

<template>
  <span
    :ref="(contentContext.onArrowChange as any)"
    :style="{
      position: 'absolute',
      left: contentContext.arrowX() ? `${contentContext.arrowX()}px` : undefined,
      top: contentContext.arrowY() ? `${contentContext.arrowY()}px` : undefined,
      [OPPOSITE_SIDE[contentContext.placedSide.value]]: 0,
      transformOrigin: {
        top: '',
        right: '0 0',
        bottom: 'center 0',
        left: '100% 0',
      }[contentContext.placedSide.value],
      transform: {
        top: 'translateY(100%)',
        right: 'translateY(50%) rotate(90deg) translateX(-50%)',
        bottom: `rotate(180deg)`,
        left: 'translateY(50%) rotate(-90deg) translateX(50%)',
      }[contentContext.placedSide.value],
      visibility: contentContext.shouldHideArrow() ? 'hidden' : undefined,
    }"
  >
    <div
      :style="{
        width: '20px',
        height: '10px',
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
        backgroundColor: 'tomato',
      }"
    />
  </span>
</template>
