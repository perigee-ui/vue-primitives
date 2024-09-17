<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger, useTooltipProvider } from '../index.ts'
import './styles.css'

useTooltipProvider()
</script>

<template>
  <div>
    <p>TODO: asChild </p>
    <TooltipRoot>
      <TooltipTrigger class="tooltip_triggerClass">
        Hover or Focus me
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent class="tooltip_contentClass" :side-offset="5">
          Nicely done!
          <TooltipArrow class="tooltip_arrowClas" :offset="10" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </div>
</template>
