import type { ImageLoadingStatus } from './AvatarRoot.ts'

export interface AvatarImageProps {
  src?: string
}

// eslint-disable-next-line ts/consistent-type-definitions
export type AvatarImageEmits = {
  loadingStatusChange: [status: ImageLoadingStatus]
}
