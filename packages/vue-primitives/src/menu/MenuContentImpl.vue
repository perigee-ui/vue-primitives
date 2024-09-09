<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from 'vue'
import { DismissableLayer, type FocusOutsideEvent, type PointerdownOutsideEvent } from '../dismissable-layer/index.ts'
import { useFocusGuards } from '../focus-guards/FocusGuards.ts'
import { FocusScope } from '../focus-scope/index.ts'
import { useForwardElement, useRef } from '../hooks/index.ts'
import { PopperContent } from '../popper/index.ts'
import { RovingFocusGroupRoot } from '../roving-focus/index.ts'
import { focusFirst } from '../utils/focusFirst.ts'
import { composeEventHandlers } from '../utils/vue.ts'
import { provideMenuContentContext } from './MenuContent.ts'
import { FIRST_LAST_KEYS, LAST_KEYS, useCollection, useMenuContext, useMenuRootContext } from './MenuRoot.ts'
import { getNextMatch, getOpenState, type GraceIntent, isPointerInGraceArea, type Side } from './utils.ts'
import type { MenuContentImplEmits, MenuContentImplProps } from './MenuContentImpl.ts'

defineOptions({
  name: 'MenuContentImpl',
  inheritAttrs: false,
})

withDefaults(defineProps<MenuContentImplProps>(), {
  loop: false,
})

const emit = defineEmits<MenuContentImplEmits>()

const context = useMenuContext('MenuContentImpl')
const rootContext = useMenuRootContext('MenuContentImpl')
const getItems = useCollection()
const currentItemId = shallowRef<string>()
const forwardElement = useForwardElement<HTMLDivElement>(context.content)
let timerRef = 0
const searchRef = useRef('')
const pointerGraceTimerRef = useRef(0)
let pointerGraceIntentRef: GraceIntent | undefined
let pointerDirRef: Side = 'right'
let lastPointerXRef = 0

// TODO: ScrollLock
// const ScrollLockWrapper = disableOutsideScroll ? RemoveScroll : React.Fragment
// const scrollLockWrapperProps = disableOutsideScroll
// ? { as: Slot, allowPinchZoom: true }
// : undefined

function handleTypeaheadSearch(key: string) {
  const search = searchRef.current + key
  const items = getItems().filter(item => !item.$$rcid.disabled)
  const currentItem = document.activeElement
  const currentMatch = items.find(item => item === currentItem)?.$$rcid.textValue
  const values = items.map(item => item.$$rcid.textValue)
  const nextMatch = getNextMatch(values, search, currentMatch)
  const newItem = items.find(item => item.$$rcid.textValue === nextMatch);

  // Reset `searchRef` 1 second after it was last updated
  (function updateSearch(value: string) {
    searchRef.current = value
    window.clearTimeout(timerRef)
    if (value !== '')
      timerRef = window.setTimeout(() => updateSearch(''), 1000)
  })(search)

  if (newItem) {
    /**
     * Imperative focus during keydown is risky so we prevent React's batching updates
     * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
     */
    setTimeout(() => (newItem as HTMLElement).focus())
  }
}

onBeforeUnmount(() => {
  window.clearTimeout(timerRef)
})

// Make sure the whole tree has focus guards as our `MenuContent` may be
// the last element in the DOM (because of the `Portal`)
useFocusGuards()

function isPointerMovingToSubmenu(event: PointerEvent) {
  const isMovingTowards = pointerDirRef === pointerGraceIntentRef?.side
  return isMovingTowards && isPointerInGraceArea(event, pointerGraceIntentRef?.area)
}

provideMenuContentContext({
  onItemEnter(event) {
    if (isPointerMovingToSubmenu(event))
      event.preventDefault()
  },
  onItemLeave(event) {
    if (isPointerMovingToSubmenu(event))
      return
    context.content.value?.focus()
    currentItemId.value = undefined
  },
  onTriggerLeave(event) {
    if (isPointerMovingToSubmenu(event))
      event.preventDefault()
  },
  searchRef,
  pointerGraceTimerRef,
  onPointerGraceIntentChange(intent) {
    pointerGraceIntentRef = intent
  },
})

// Hanldlers

// FocusScope

const onMountAutoFocus = composeEventHandlers((event) => {
  emit('openAutoFocus', event)
}, (event) => {
  // when opening, explicitly focus the content area only and leave
  // `onEntryFocus` in  control of focusing first item
  event.preventDefault()
  context.content.value?.focus({ preventScroll: true })
})

function onUnmountAutoFocus(event: Event) {
  emit('closeAutoFocus', event)
}

// DismissableLayer

function onEscapeKeydown(event: KeyboardEvent) {
  emit('escapeKeydown', event)
}

function onPointerDownOutside(event: PointerdownOutsideEvent) {
  emit('pointerdownOutside', event)
}

function onFocusOutside(event: FocusOutsideEvent) {
  emit('focusOutside', event)
}

function onInteractOutside(event: PointerdownOutsideEvent | FocusOutsideEvent) {
  emit('interactOutside', event)
}

function onDismiss() {
  emit('dismiss')
}

// RovingFocusGroupRoot
function onCurrentTabStopIdChange(tabStopId: string | undefined) {
  currentItemId.value = tabStopId
}
const onEntryFocus = composeEventHandlers((event) => {
  emit('entryFocus', event)
}, (event) => {
  // only focus first item when using keyboard
  if (!rootContext.isUsingKeyboardRef.current)
    event.preventDefault()
})

// PopperRoot

const onKeydown = composeEventHandlers<KeyboardEvent>((event) => {
  emit('keydowm', event)
}, (event) => {
  // submenu key events bubble through portals. We only care about keys in this menu.
  const target = event.target as HTMLElement
  const isKeyDownInside = target.closest('[data-radix-menu-content]') === event.currentTarget
  const isModifierKey = event.ctrlKey || event.altKey || event.metaKey
  const isCharacterKey = event.key.length === 1

  if (isKeyDownInside) {
    // menus should not be navigated using tab key so we prevent it
    if (event.key === 'Tab')
      event.preventDefault()

    if (!isModifierKey && isCharacterKey)
      handleTypeaheadSearch(event.key)
  }

  // focus first/last item based on key pressed
  const content = context.content.value

  if (event.target !== content)
    return

  if (!FIRST_LAST_KEYS.includes(event.key))
    return

  event.preventDefault()
  const candidateNodes = getItems().filter(item => !item)

  if (LAST_KEYS.includes(event.key))
    candidateNodes.reverse()
  focusFirst(candidateNodes)
})

const onBlur = composeEventHandlers<FocusEvent>((event) => {
  emit('blur', event)
}, (event) => {
  // clear search buffer when leaving the menu
  if (!(event.currentTarget as HTMLElement | null)?.contains(event.target as HTMLElement | null)) {
    window.clearTimeout(timerRef)
    searchRef.current = ''
  }
})

const onPointermove = composeEventHandlers<PointerEvent>((event) => {
  emit('pointermove', event)
}, (event) => {
  if (event.pointerType !== 'mouse')
    return
  const target = event.target as HTMLElement
  const pointerXHasChanged = lastPointerXRef !== event.clientX

  // We don't use `event.movementX` for this check because Safari will
  // always return `0` on a pointer event.
  if ((event.currentTarget as HTMLElement | null)?.contains(target) && pointerXHasChanged) {
    const newDir = event.clientX > lastPointerXRef ? 'right' : 'left'
    pointerDirRef = newDir
    lastPointerXRef = event.clientX
  }
})

defineExpose({
  $el: context.content,
})
</script>

<template>
  <FocusScope
    as="template"
    :trapped="trapFocus"
    @mount-auto-focus="onMountAutoFocus"
    @unmount-auto-focus="onUnmountAutoFocus"
  >
    <DismissableLayer
      as="template"
      :disable-outside-pointer-events="disableOutsidePointerEvents"
      @escape-keydown="onEscapeKeydown"
      @pointerdown-outside="onPointerDownOutside"
      @focus-outside="onFocusOutside"
      @interact-outside="onInteractOutside"
      @dismiss="onDismiss"
    >
      <RovingFocusGroupRoot
        as="template"
        :dir="rootContext.dir.value"
        orientation="vertical"
        :loop="loop"
        :current-tab-stop-id="currentItemId"
        prevent-scroll-on-entry-focus
        @update:current-tab-stop-id="onCurrentTabStopIdChange"
        @entry-focus="onEntryFocus"
      >
        <PopperContent
          :ref="forwardElement"
          role="menu"
          aria-orientation="vertical"
          :data-state="getOpenState(context.open())"
          data-radix-menu-content=""
          :dir="rootContext.dir.value"
          style="outline: none"
          v-bind="$attrs"
          @keydown="onKeydown"
          @blur="onBlur"
          @pointermove="onPointermove"
        >
          <slot />
        </PopperContent>
      </RovingFocusGroupRoot>
    </DismissableLayer>
  </FocusScope>
</template>
