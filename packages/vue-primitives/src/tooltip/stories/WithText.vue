<script setup lang="ts">
import { TooltipTrigger, useTooltipProvider } from '../index.ts'
import SimpleTooltip from './SimpleTooltip.vue'
import './styles.css'

useTooltipProvider()
</script>

<template>
  <div>
    <p>TODO: asChild </p>
    <p>
      Hello this is a test with{{ ' ' }}
      <SimpleTooltip label="This is a tooltip">
        <TooltipTrigger>
          TooltipRoot
        </TooltipTrigger>
      </SimpleTooltip>{{ ' ' }}
      inside a Text Component{{ ' ' }}
      <SimpleTooltip label="This is a tooltip" side="top">
        <TooltipTrigger>
          TooltipRoot
        </TooltipTrigger>
      </SimpleTooltip>{{ ' ' }}
      some more text{{ ' ' }}
      <SimpleTooltip label="This is a tooltip" side="right" align="center">
        <TooltipTrigger>
          TooltipRoot
        </TooltipTrigger>
      </SimpleTooltip>{{ ' ' }}
    </p>
  </div>
</template>
