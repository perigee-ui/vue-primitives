<script setup lang="ts">
import type { ToggleEmits, ToggleProps } from './Toggle.ts'
import { useControllableState } from '../hooks/index.ts'
import { composeEventHandlers } from '../utils/vue.ts'

defineOptions({
  name: 'Toggle',
})

const props = withDefaults(defineProps<ToggleProps>(), {
  pressed: undefined,
  disabled: undefined,
})
const emit = defineEmits<ToggleEmits>()

const pressed = useControllableState(props, v => emit('update:pressed', v), 'pressed', props.defaultPressed)

const onClick = composeEventHandlers<MouseEvent>((event) => {
  emit('click', event)
}, () => {
  if (!props.disabled)
    pressed.value = !pressed.value
})
</script>

<template>
  <button
    type="button"
    :aria-pressed="pressed"
    :data-state="pressed ? 'on' : 'off'"
    :disabled="disabled"
    :data-disabled="disabled"
    @click="onClick"
  >
    <slot />
  </button>
</template>
