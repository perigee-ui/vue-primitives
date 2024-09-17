<script setup lang="ts">
import { shallowRef } from 'vue'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from '../index.ts'
import './styles.css'

const open = shallowRef(false)
</script>

<template>
  <div>
    <p>TODO: asChild </p>
    <CollapsibleRoot v-model:open="open" class="collapsible_root">
      <CollapsibleTrigger class="collapsible_trigger">
        {{ open ? 'close' : 'open' }}
      </CollapsibleTrigger>
      <CollapsibleContent class="collapsible_content">
        Content 1
      </CollapsibleContent>
    </CollapsibleRoot>
  </div>
</template>
