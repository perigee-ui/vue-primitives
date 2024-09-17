<script setup lang="ts">
import type { RadioGroupIndicatorProps } from './RadioGroupIndicator.ts'
import { shallowRef } from 'vue'
import { useForwardElement } from '../hooks/index.ts'
import { usePresence } from '../presence/index.ts'
import { getState, useRadioContext } from './Radio.ts'

defineOptions({
  name: 'RadioGroupIndicator',
})

const props = defineProps<RadioGroupIndicatorProps>()
const $el = shallowRef<HTMLSpanElement>()
const forwardElement = useForwardElement($el)

const context = useRadioContext('RadioGroupIndicator')

const isPresent = usePresence($el, () => props.forceMount || context.checked())
</script>

<template>
  <span
    v-if="isPresent"
    :ref="forwardElement"
    :data-state="getState(context.checked())"
    :data-disabled="context.disabled() ? '' : undefined"
  >
    <slot />
  </span>
</template>
