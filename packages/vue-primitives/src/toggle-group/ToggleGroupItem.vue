<script setup lang="ts">
import type { ToggleGroupItemEmits, ToggleGroupItemProps } from './ToggleGroupItem.ts'
import { computed } from 'vue'
import { DATA_COLLECTION_ITEM } from '../collection/Collection.ts'
import { useComposedElements } from '../hooks/useComposedElements.ts'
import { useRovingFocusGroupItem } from '../roving-focus/index.ts'
import { composeEventHandlers } from '../utils/vue.ts'
import { useToggleGroupContext } from './ToggleGroupRoot.ts'

defineOptions({
  name: 'ToggleGroupItem',
})

const props = withDefaults(defineProps<ToggleGroupItemProps>(), {
  disabled: undefined,
})
const emit = defineEmits<ToggleGroupItemEmits>()

const context = useToggleGroupContext('ToggleGroupItem')
const pressed = computed(() => context.value.value?.includes(props.value))
const disabled = computed(() => context.disabled() || props.disabled)

const onClick = composeEventHandlers<MouseEvent>((event) => {
  emit('click', event)
}, () => {
  if (props.disabled)
    return

  if (!pressed.value)
    context.onItemActivate(props.value)
  else
    context.onItemDeactivate(props.value)
})

let rovingFocusGroupItem: ReturnType<typeof useRovingFocusGroupItem> | undefined

if (context.rovingFocus) {
  rovingFocusGroupItem = useRovingFocusGroupItem({
    focusable() {
      return !props.disabled
    },
    active() {
      return pressed.value
    },
  }, {
    onMousedown(event) {
      emit('mousedown', event)
    },
    onFocus(event) {
      emit('focus', event)
    },
    onKeydown(event) {
      emit('keydown', event)
    },
  })
}

const forwardElement = useComposedElements((v) => {
  if (rovingFocusGroupItem) {
    rovingFocusGroupItem.useCollectionItem(v, rovingFocusGroupItem.itemData, rovingFocusGroupItem.collectionKey)
  }
})

function onMousedown(event: MouseEvent) {
  emit('mousedown', event)
}

function onFocus(event: FocusEvent) {
  emit('focus', event)
}

function onKeydown(event: KeyboardEvent) {
  emit('keydown', event)
}

function typeAttrs() {
  if (context.type() === 'single') {
    return {
      'role': 'radio',
      'aria-checked': pressed.value,
      'aria-pressed': undefined,
    }
  }

  return undefined
}

function attrs() {
  const _typeProps = typeAttrs()

  if (!rovingFocusGroupItem) {
    return {
      ..._typeProps,
      onMousedown,
      onFocus,
      onKeydown,
    }
  }

  return {
    ..._typeProps,
    'ref': forwardElement,
    [DATA_COLLECTION_ITEM]: true,
    'tabindex': rovingFocusGroupItem.tabindex(),
    'data-orientation': rovingFocusGroupItem.orientation(),
    'onMousedown': rovingFocusGroupItem.onMousedown,
    'onFocus': rovingFocusGroupItem.onFocus,
    'onKeydown': rovingFocusGroupItem.onKeydown,
  }
}
</script>

<template>
  <button
    v-bind="attrs()"
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
