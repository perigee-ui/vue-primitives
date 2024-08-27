import { shallowRef } from 'vue'
import { createContext, useRef } from '../hooks/index.ts'

export interface ToastProviderProps {
  /**
   * An author-localized label for each toast. Used to help screen reader users
   * associate the interruption with a toast.
   * @defaultValue 'Notification'
   */
  label?: string
  /**
   * Time in milliseconds that each toast should remain visible for.
   * @defaultValue 5000
   */
  duration?: number
  /**
   * Direction of pointer swipe that should close the toast.
   * @defaultValue 'right'
   */
  swipeDirection?: SwipeDirection
  /**
   * Distance in pixels that the swipe must pass before a close is triggered.
   * @defaultValue 50
   */
  swipeThreshold?: number
}

export type SwipeDirection = 'up' | 'down' | 'left' | 'right'
export type ToastViewportElement = HTMLOListElement

export interface ToastProviderContextValue {
  label: string
  duration: number
  swipeDirection: SwipeDirection
  swipeThreshold: number
  toastCount: number
  viewport: ToastViewportElement | undefined
  onViewportChange: (viewport: ToastViewportElement) => void
  onToastAdd: () => void
  onToastRemove: () => void
  isFocusedToastEscapeKeyDownRef: React.MutableRefObject<boolean>
  isClosePausedRef: React.MutableRefObject<boolean>
}

export const [provideToastProviderContext, useToastProviderContext] = createContext<ToastProviderContextValue>('Toast')

export function useToastProvider(props: ToastProviderProps) {
  const { label = 'Notification', duration = 5000, swipeDirection = 'right', swipeThreshold = 50 } = props
  const viewport = shallowRef<ToastViewportElement>()
  const toastCount = shallowRef(0)
  const isFocusedToastEscapeKeyDownRef = useRef(false)
  const isClosePausedRef = useRef(false)

  provideToastProviderContext({
    label,
    duration,
    swipeDirection,
    swipeThreshold,
    toastCount: toastCount.value,
    viewport: viewport.value,
    onViewportChange(newViewport) {
      viewport.value = newViewport
    },
    onToastAdd() {
      toastCount.value += 1
    },
    onToastRemove() {
      toastCount.value -= 1
    },
    isFocusedToastEscapeKeyDownRef,
    isClosePausedRef,
  })
}
