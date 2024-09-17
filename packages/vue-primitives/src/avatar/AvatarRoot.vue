<script setup lang="ts">
import { shallowRef } from 'vue'
import { type ImageLoadingStatus, provideAvatarContext } from './AvatarRoot.ts'

defineOptions({
  name: 'AvatarRoot',
})

const imageLoadingStatus = shallowRef<ImageLoadingStatus>('idle')

provideAvatarContext({
  imageLoadingStatus,
  onImageLoadingStatusChange(newStatus) {
    imageLoadingStatus.value = newStatus
  },
})
</script>

<template>
  <span>
    <slot />
  </span>
</template>
