<script setup lang="ts">
import { shallowRef, watch, watchEffect } from 'vue'
import {
  autoUpdate,
  flip,
  arrow as floatingUIarrow,
  hide,
  limitShift,
  offset,
  type Placement,
  shift,
  size,
  useFloating,
  type UseFloatingCofnig,
} from '../floating/index.ts'
import { useForwardElement, useSize } from '../hooks/index.ts'
import { Primitive } from '../primitive/index.ts'
import { type Align, type PopperContentEmits, type PopperContentProps, provideContentContext, type Side } from './PopperContent.ts'
import { usePopperContext } from './PopperRoot.ts'
import { getSideAndAlignFromPlacement, isNotNull, transformOrigin } from './utils.ts'

defineOptions({
  name: 'PopperContent',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PopperContentProps>(), {
  side: 'bottom',
  sideOffset: 0,
  align: 'center',
  alignOffset: 0,
  arrowPadding: 0,
  avoidCollisions: true,
  collisionBoundary: () => [],
  collisionPadding: 0,
  sticky: 'partial',
  hideWhenDetached: false,
  updatePositionStrategy: 'optimized',
})
const emit = defineEmits<PopperContentEmits>()

const context = usePopperContext('PopperContent')

const forwardElement = useForwardElement(context.content)
const floatingEl = shallowRef<HTMLDivElement>()

const arrow = shallowRef<HTMLSpanElement>()

const arrowSize = useSize(arrow)

function getDetectOverflowOptions() {
  const collisionPadding = typeof props.collisionPadding === 'number'
    ? props.collisionPadding
    : { top: 0, right: 0, bottom: 0, left: 0, ...props.collisionPadding }

  const boundary = Array.isArray(props.collisionBoundary) ? props.collisionBoundary : [props.collisionBoundary]
  const hasExplicitBoundaries = boundary.length > 0

  return {
    padding: collisionPadding,
    boundary: boundary.filter(isNotNull),
    // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
    altBoundary: hasExplicitBoundaries,
  }
}

function floatingConfig(): UseFloatingCofnig {
  const detectOverflowOptions = getDetectOverflowOptions()

  const placement = (props.side + (props.align !== 'center' ? `-${props.align}` : '')) as Placement
  const arrowHeight = arrowSize.value?.height || 0
  const arrowWidth = arrowSize.value?.width || 0

  const middleware: UseFloatingCofnig['middleware'] = [
    offset({ mainAxis: props.sideOffset + arrowHeight, alignmentAxis: props.alignOffset }),
  ]

  if (props.avoidCollisions) {
    middleware.push(
      shift({
        mainAxis: true,
        crossAxis: false,
        limiter: props.sticky === 'partial' ? limitShift() : undefined,
        ...detectOverflowOptions,
      }),
      flip(detectOverflowOptions),
    )
  }

  middleware.push(size({
    ...detectOverflowOptions,
    apply: (state) => {
      const { width: anchorWidth, height: anchorHeight } = state.rects.reference
      const contentStyle = state.elements.floating.style
      contentStyle.setProperty('--radix-popper-available-width', `${state.availableWidth}px`)
      contentStyle.setProperty('--radix-popper-available-height', `${state.availableHeight}px`)
      contentStyle.setProperty('--radix-popper-anchor-width', `${anchorWidth}px`)
      contentStyle.setProperty('--radix-popper-anchor-height', `${anchorHeight}px`)
    },
  }))

  if (arrow.value) {
    middleware.push(floatingUIarrow({ element: arrow, padding: props.arrowPadding }))
  }

  middleware.push(transformOrigin({ arrowWidth, arrowHeight }))

  if (props.hideWhenDetached) {
    middleware.push(hide({ strategy: 'referenceHidden', ...detectOverflowOptions }))
  }

  return {
    strategy: 'fixed',
    placement,
    middleware,
  }
}

const { floatingStyles, placement, isPositioned, middlewareData } = useFloating(
  {
    elements: {
      floatingEl,
      referenceEl: context.anchor,
    },
    whileElementsMounted(reference, floating, update) {
      return autoUpdate(reference, floating, update, {
        animationFrame: props.updatePositionStrategy === 'always',
      })
    },
  },
  floatingConfig,
)

const placedSide = shallowRef<Side>('bottom')
const placedAlign = shallowRef<Align>('center')

watchEffect(() => {
  const [side, align] = getSideAndAlignFromPlacement(placement.value)
  placedSide.value = side
  placedAlign.value = align
})

watchEffect(() => {
  if (isPositioned.value)
    emit('placed')
}, { flush: 'post' })

const contentZIndex = shallowRef('')

watch(context.content, (contentVal) => {
  if (contentVal) {
    contentZIndex.value = window.getComputedStyle(contentVal).zIndex
  }
})

provideContentContext({
  placedSide,
  onArrowChange(newArrow) {
    arrow.value = newArrow
  },
  arrowX() {
    return middlewareData.value.arrow?.x ?? undefined
  },
  arrowY() {
    return middlewareData.value.arrow?.y ?? undefined
  },
  shouldHideArrow() {
    return middlewareData.value.arrow?.centerOffset !== 0
  },
})
</script>

<template>
  <div
    ref="floatingEl"
    data-radix-popper-content-wrapper=""
    :style="{
      ...floatingStyles,
      'transform': isPositioned ? floatingStyles.transform : 'translate(0, -200%)', // keep off the page when measuring
      'minWidth': 'max-content',
      'zIndex': contentZIndex,
      '--radix-popper-transform-origin': [
        middlewareData.transformOrigin?.x,
        middlewareData.transformOrigin?.y,
      ].join(' '),

      // hide the content if using the hide middleware and should be hidden
      // set visibility to hidden and disable pointer events so the UI behaves
      // as if the PopperContent isn't there at all
      ...(middlewareData.hide?.referenceHidden && {
        visibility: 'hidden',
        pointerEvents: 'none',
      }),
    }"
    :dir="dir"
  >
    <Primitive
      :ref="forwardElement"
      :data-side="placedSide"
      :data-align="placedAlign"
      v-bind="$attrs"
      :style="{
        // if the PopperContent hasn't been placed yet (not all measurements done)
        // we prevent animations so that users's animation don't kick in too early referring wrong sides
        animation: !isPositioned ? 'none' : undefined,
      }"
    >
      <slot />
    </Primitive>
  </div>
</template>
