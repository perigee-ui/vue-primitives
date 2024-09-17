<script setup lang="ts">
import { PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from '../index.ts'
import './styles.css'

function onClick() {
  // eslint-disable-next-line no-console
  console.log('StyledTrigger click')
}
</script>

<template>
  <div>
    <p>TODO: asChild </p>
    <PopoverRoot>
      <PopoverTrigger class="popover_triggerClass" @click="onClick">
        open
      </PopoverTrigger>

      <PopoverPortal>
        <PopoverContent class="popover_contentClass" :side-offset="5">
          <PopoverClose class="popover_closeClass">
            close
          </PopoverClose>
          <PopoverArrow class="popover_arrowClass" :width="20" :height="10" :offset="10" />
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </div>
</template>
