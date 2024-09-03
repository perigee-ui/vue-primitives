<script setup lang="ts">
import './styles.css'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipRoot, TooltipTrigger, useTooltipProvider } from '../index.ts'

useTooltipProvider()
</script>

<template>
  <div>
    <h1>Delay duration</h1>
    <h2>Default (700ms)</h2>

    <div :style="{ display: 'flex', gap: '50px' }">
      <TooltipRoot>
        <TooltipTrigger class="tooltip_triggerClass">
          Hover me
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent class="tooltip_contentClass" :side-offset="5">
            Nicely done!
            <TooltipArrow class="tooltip_arrowClass" :offset="10" />
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
      <TooltipRoot>
        <TooltipTrigger class="tooltip_triggerClass">
          Hover me
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent class="tooltip_contentClass" :side-offset="5">
            Nicely done!
            <TooltipArrow class="tooltip_arrowClass" :offset="10" />
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
      <TooltipRoot>
        <TooltipTrigger class="tooltip_triggerClass">
          Hover me
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent class="tooltip_contentClass" :side-offset="5">
            Nicely done!
            <TooltipArrow class="tooltip_arrowClass" :offset="10" />
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </div>

    <h2>Custom (0ms = instant open)</h2>
    <div :style="{ display: 'flex', gap: '50px' }">
      <TooltipProvider delay-duration="{0}">
        <TooltipRoot>
          <TooltipTrigger class="tooltip_triggerClass">
            Hover me
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent class="tooltip_contentClass" :side-offset="5">
              Nicely done!
              <TooltipArrow class="tooltip_arrowClass" :offset="10" />
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
        <TooltipRoot>
          <TooltipTrigger class="tooltip_triggerClass">
            Hover me
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent class="tooltip_contentClass" :side-offset="5">
              Nicely done!
              <TooltipArrow class="tooltip_arrowClass" :offset="10" />
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
        <TooltipRoot>
          <TooltipTrigger class="tooltip_triggerClass">
            Hover me
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent class="tooltip_contentClass" :side-offset="5">
              Nicely done!
              <TooltipArrow class="tooltip_arrowClass" :offset="10" />
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </TooltipProvider>
    </div>
  </div>
</template>
