<script setup lang="ts">
import { shallowRef } from 'vue'
import { FocusScope } from '../../focus-scope/index.ts'
import { useForwardElement } from '../../hooks/index.ts'
import { useDismissableLayer } from '../index.ts'

const open = shallowRef(false)
const openButtonRef = shallowRef<HTMLElement | null>(null)

function toggleOpen() {
  open.value = !open.value
}
function openAlert() {
  // eslint-disable-next-line no-alert
  window.alert('hey!')
}

// COMP::DismissableLayer

const $el = shallowRef<HTMLDivElement>()
const forwardElement = useForwardElement($el)

const dismissableLayer = useDismissableLayer($el, {
  disableOutsidePointerEvents() {
    return true
  },
}, {
  onDismiss() {
    open.value = false
  },
  onPointerdownOutside(event) {
    if (event.target === openButtonRef.value) {
      event.preventDefault()
    }
  },
})
</script>

<template>
  <div :style="{ fontFamily: 'sans-serif', textAlign: 'center' }">
    <h1>DismissableLayer + FocusScope</h1>
    <div :style="{ marginBottom: '20px' }">
      <button ref="openButtonRef" type="button" @click="toggleOpen">
        {{ open ? 'Close' : 'Open' }} layer
      </button>
    </div>

    <FocusScope
      v-if="open"
      :ref="forwardElement"
      trapped
      data-dismissable-layer
      :style="{
        pointerEvents: dismissableLayer.pointerEvents(),
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        verticalAlign: 'middle',
        width: '400px',
        height: '300px',
        backgroundColor: 'black',
        borderRadius: '10px',
        marginBottom: '20px',
      }"
    >
      <input type="text">
    </FocusScope>

    <div :style="{ marginBottom: '20px' }">
      <input type="text" defaultValue="hello" :style="{ marginRight: '20px' }">
      <button type="button" @mousedown="openAlert">
        hey!
      </button>
    </div>
  </div>
</template>
