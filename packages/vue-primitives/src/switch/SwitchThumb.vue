<script setup lang="ts">
import type { SwitchThumbProps } from './SwitchThumb.ts'
import { Primitive } from '../primitive/index.ts'
import { getState, useSwitchContext } from './SwitchRoot.ts'

defineOptions({
  name: 'SwitchThumb',
})

withDefaults(defineProps<SwitchThumbProps>(), {
  as: 'span',
})

const context = useSwitchContext('SwitchThumb')
</script>

<template>
  <Primitive
    :as="as"
    :data-state="getState(context.checked.value)"
  >
    <slot />
  </Primitive>
</template>
