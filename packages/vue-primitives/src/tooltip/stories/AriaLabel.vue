<script setup lang="ts">
import { TooltipTrigger, useTooltipProvider } from '../index.ts'
import SimpleTooltip from './SimpleTooltip.vue'
import './styles.css'

useTooltipProvider()
</script>

<template>
  <div>
    <p>The first button will display AND enunciate the label.</p>
    <p>The second button will display the label, but enunciate the aria label.</p>
    <div :style="{ display: 'flex' }">
      <SimpleTooltip label="Notifications">
        <TooltipTrigger :style="{ margin: '5px' }">
          <span aria-hidden="true">🔔(3)</span>
        </TooltipTrigger>
      </SimpleTooltip>

      <SimpleTooltip label="Notifications" aria-label="3 notifications">
        <TooltipTrigger :style="{ margin: '5px' }">
          <span aria-hidden="true">🔔(3)</span>
        </TooltipTrigger>
      </SimpleTooltip>
    </div>
  </div>
</template>
