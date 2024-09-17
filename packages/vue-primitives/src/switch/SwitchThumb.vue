<script setup lang="ts">
import { getState, useSwitchContext } from './SwitchRoot.ts'

defineOptions({
  name: 'SwitchThumb',
})

const context = useSwitchContext('SwitchThumb')
</script>

<template>
  <span :data-state="getState(context.checked.value)">
    <slot />
  </span>
</template>
