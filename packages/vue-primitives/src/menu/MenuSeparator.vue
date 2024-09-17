<script setup lang="ts">
defineOptions({
  name: 'MenuSeparator',
})
</script>

<template>
  <div role="separator" aria-orientation="horizontal">
    <slot />
  </div>
</template>
