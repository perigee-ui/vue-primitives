import type { Ref } from 'vue'
import { createContext } from '../hooks/index.ts'

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

export interface AvatarContext {
  imageLoadingStatus: Ref<ImageLoadingStatus>
  onImageLoadingStatusChange: (status: ImageLoadingStatus) => void
};

export const [provideAvatarContext, useAvatarContext] = createContext<AvatarContext>('Avatar')
