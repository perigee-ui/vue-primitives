import type { EmitsToHookProps } from '../shared/typeUtils.ts'
import { onBeforeUnmount, type Ref, shallowRef, useId } from 'vue'
import { createContext, useControllableStateV2 } from '../hooks/index.ts'
import { usePooperRoot } from '../popper/PopperRoot.ts'
import { useTooltipProviderContext } from './TooltipProvider.ts'

export interface TooltipRootProps {
  open?: boolean
  defaultOpen?: boolean
  /**
   * The duration from when the pointer enters the trigger until the tooltip gets opened. This will
   * override the prop with the same name passed to Provider.
   * @defaultValue 700
   */
  delayDuration?: number
  /**
   * When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.
   * @defaultValue false
   */
  disableHoverableContent?: boolean
}

// eslint-disable-next-line ts/consistent-type-definitions
export type TooltipRootEmits = {
  'update:open': [open: boolean]
}

export const TOOLTIP_OPEN = 'tooltip.open'

export interface TooltipContext {
  contentId: string
  open: Ref<boolean>
  stateAttribute: () => 'closed' | 'delayed-open' | 'instant-open'
  trigger: Ref<HTMLElement | undefined>
  onTriggerEnter: () => void
  onTriggerLeave: () => void
  onOpen: () => void
  onClose: () => void
  disableHoverableContent: boolean
}

export const [provideTooltipContext, useTooltipContext] = createContext<TooltipContext>('Tooltip')

export interface UseTooltipRootProps extends EmitsToHookProps<TooltipRootEmits> {
  open?: () => boolean | undefined
  defaultOpen?: boolean
  delayDuration?: number
  disableHoverableContent?: boolean
}

export function useTooltipRoot(props: UseTooltipRootProps) {
  const providerContext = useTooltipProviderContext('Tooltip')
  const trigger = shallowRef<HTMLElement>()

  let openTimerRef = 0

  const disableHoverableContent = props.disableHoverableContent ?? providerContext.disableHoverableContent
  const delayDuration = () => props.delayDuration ?? providerContext.delayDuration
  let wasOpenDelayedRef = false

  const open = useControllableStateV2(
    props.open,
    (v: boolean) => {
      if (v) {
        providerContext.onOpen()

        // as `onChange` is called within a lifecycle method we
        // avoid dispatching via `dispatchDiscreteCustomEvent`.
        document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN))
      }
      else {
        providerContext.onClose()
      }

      props.onUpdateOpen?.(v)
    },
    props.defaultOpen ?? false,
  )

  function handleOpen() {
    window.clearTimeout(openTimerRef)
    openTimerRef = 0
    wasOpenDelayedRef = false
    open.value = true
  }

  function handleClose() {
    window.clearTimeout(openTimerRef)
    openTimerRef = 0
    open.value = false
  }

  function handleDelayedOpen() {
    window.clearTimeout(openTimerRef)
    openTimerRef = window.setTimeout(() => {
      wasOpenDelayedRef = true
      open.value = true
      openTimerRef = 0
    }, delayDuration())
  }

  onBeforeUnmount(() => {
    if (openTimerRef)
      window.clearTimeout(openTimerRef)
  })

  provideTooltipContext({
    contentId: useId(),
    open,
    stateAttribute() {
      return open.value ? (wasOpenDelayedRef ? 'delayed-open' : 'instant-open') : 'closed'
    },
    trigger,
    onTriggerEnter() {
      if (providerContext.isOpenDelayed.value)
        handleDelayedOpen()
      else handleOpen()
    },
    onTriggerLeave() {
      if (disableHoverableContent) {
        handleClose()
      }
      else {
        // Clear the timer in case the pointer leaves the trigger before the tooltip is opened.
        window.clearTimeout(openTimerRef)
        openTimerRef = 0
      }
    },
    onOpen: handleOpen,
    onClose: handleClose,
    disableHoverableContent,
  })

  usePooperRoot({ anchor: trigger })
}
