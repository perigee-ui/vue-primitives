<script setup lang="ts">
import { shallowRef } from 'vue'
import { PopperAnchor, PopperContent, PopperRoot } from '../index.ts'
import CustomArrow from './CustomArrow.vue'
import Scrollable from './Scrollable.vue'
import './styles.css'

const open = shallowRef(false)

function openFn() {
  open.value = true
}

function closeFn() {
  open.value = false
}
</script>

<template>
  <div>
    <Scrollable>
      <PopperRoot>
        <PopperAnchor class="popper_anchorClass" @click="openFn">
          open
        </PopperAnchor>

        <PopperContent v-if="open" class="popper_contentClass" side="right" :side-offset="5">
          <button @click="closeFn">
            close
          </button>
          <CustomArrow class="popper_arrowClass" />
        </PopperContent>
      </PopperRoot>
    </Scrollable>
  </div>
</template>
