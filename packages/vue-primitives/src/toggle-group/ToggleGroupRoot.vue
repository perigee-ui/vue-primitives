<script setup lang="ts" generic="T extends ToggleGroupType">
import { computed } from 'vue'
import { useDirection } from '../direction/Direction.ts'
import { useControllableState, useForwardElement, useRef } from '../hooks/index.ts'
import { useRovingFocusGroupRoot } from '../roving-focus/index.ts'
import { arrayify } from '../utils/array.ts'
import { provideToggleGroupContext, type ToggleGroupEmits, type ToggleGroupProps, type ToggleGroupType } from './ToggleGroupRoot.ts'

type SingleValue = Exclude<ToggleGroupProps<'single'>['value'], undefined>
type MultipleValue = Exclude<ToggleGroupProps<'multiple'>['value'], undefined>
type Value = T extends 'single' ? SingleValue : MultipleValue

defineOptions({
  name: 'ToggleGroup',
})

const props = withDefaults(defineProps<ToggleGroupProps<T>>(), {
  disabled: false,
  rovingFocus: true,
  loop: true,
})
const emit = defineEmits<ToggleGroupEmits<T>>()

const value = useControllableState(props, v => emit('update:value', v as Value), 'value', props.defaultValue)

const TYPE_SINGLE = 'single' as const satisfies ToggleGroupType

const direction = useDirection(() => props.dir)

provideToggleGroupContext({
  type() {
    return props.type
  },
  value: computed(() => {
    if (props.type === TYPE_SINGLE)
      return typeof value.value === 'string' ? [value.value] : []
    return Array.isArray(value.value) ? value.value : []
  }),
  onItemActivate(itemValue) {
    if (props.type === TYPE_SINGLE) {
      value.value = itemValue as Value
    }
    else {
      value.value = [...arrayify<SingleValue>(value.value || []), itemValue] as Value
    }
  },
  onItemDeactivate(itemValue) {
    if (props.type === TYPE_SINGLE) {
      value.value = '' as Value
    }
    else {
      value.value = arrayify<SingleValue>(value.value || []).filter(value => value !== itemValue) as Value
    }
  },
  rovingFocus: props.rovingFocus,
  disabled() {
    return props.disabled
  },
})

const elRef = useRef<HTMLElement>()
const forwardElement = useForwardElement(elRef)

let rovingFocusGroupRoot: ReturnType<typeof useRovingFocusGroupRoot> | undefined

if (props.rovingFocus) {
  rovingFocusGroupRoot = useRovingFocusGroupRoot(elRef, {
    currentTabStopId: undefined,
    orientation() {
      return props.orientation
    },
    loop() {
      return props.loop
    },
    dir: direction,
  }, {
    onMousedown(event) {
      emit('mousedown', event)
    },
    onFocus(event) {
      emit('focus', event)
    },
    onFocusout(event) {
      emit('focusout', event)
    },
  })
}

function onMousedown(event: MouseEvent) {
  emit('mousedown', event)
}

function onFocus(event: FocusEvent) {
  emit('focus', event)
}

function onFocusout(event: FocusEvent) {
  emit('focusout', event)
}

function attrs() {
  if (!rovingFocusGroupRoot) {
    return {
      onMousedown,
      onFocus,
      onFocusout,
    }
  }
  return {
    'ref': forwardElement,
    'tabindex': rovingFocusGroupRoot.tabindex?.(),
    'data-orientation': props.orientation,
    'style': 'outline: none;',
    'onMousedown': rovingFocusGroupRoot.onMousedown,
    'onFocus': rovingFocusGroupRoot.onFocus,
    'onFocusout': rovingFocusGroupRoot.onFocusout,
  }
}
</script>

<template>
  <div v-bind="attrs()" role="group" :dir="direction">
    <slot />
  </div>
</template>
