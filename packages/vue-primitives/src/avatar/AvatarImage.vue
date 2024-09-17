<script setup lang="ts">
import type { AvatarImageEmits, AvatarImageProps } from './AvatarImage.ts'
import { watchEffect } from 'vue'
import { type ImageLoadingStatus, useAvatarContext } from './AvatarRoot.ts'
import { useImageLoadingStatus } from './utils.ts'

defineOptions({
  name: 'AvatarImage',
})

const props = defineProps<AvatarImageProps>()

const emit = defineEmits<AvatarImageEmits>()

const context = useAvatarContext('AvatarImage')
const imageLoadingStatus = useImageLoadingStatus(() => props.src)

function handleLoadingStatusChange(status: ImageLoadingStatus) {
  emit('loadingStatusChange', status)
  context.onImageLoadingStatusChange(status)
}

watchEffect(() => {
  if (imageLoadingStatus.value !== 'idle') {
    handleLoadingStatusChange(imageLoadingStatus.value)
  }
})
</script>

<template>
  <img :hidden="imageLoadingStatus !== 'loaded'" :src="src">
</template>
