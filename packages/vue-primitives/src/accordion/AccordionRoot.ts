import { NOOP } from '@vue/shared'
import { type AriaAttributes, computed, type MaybeRefOrGetter, type Ref } from 'vue'
import { createCollection } from '../collection/index.ts'
import { type Direction, useDirection } from '../direction/index.ts'
import { createContext, type MutableRefObject, useControllableStateV2, useId, useRef } from '../hooks/index.ts'
import { type EmitsToHookProps, mergePrimitiveAttrs, type PrimitiveDefaultProps, type RadixPrimitiveReturns } from '../shared/index.ts'

export type AccordionType = 'single' | 'multiple' | undefined
export type IsSingle<T extends AccordionType> = T extends 'single' | undefined ? true : false

export interface AccordionRootProps<T extends AccordionType> extends AccordionImplProps {
  type?: T

  value?: T extends 'multiple' ? AccordionMultipleProps['value'] : AccordionSingleProps['value']

  defaultValue?: T extends 'multiple' ? AccordionMultipleProps['defaultValue'] : AccordionSingleProps['defaultValue']

  collapsible?: AccordionSingleProps['collapsible']
}

export const DEFAULT_ACCORDION_ROOT_PROPS = {
  collapsible: undefined,
  disabled: undefined,
} satisfies PrimitiveDefaultProps<AccordionRootProps<AccordionType>>

// eslint-disable-next-line ts/consistent-type-definitions
export type AccordionRootEmits<T extends AccordionType> = {
  /**
   * The callback that fires when the state of the toggle group changes.
   */
  'update:value': [value: T extends 'multiple' ? NonNullable<AccordionMultipleProps['value']> : NonNullable<AccordionSingleProps['value']>]
}

interface AccordionSingleProps {
  /**
   * The controlled stateful value of the accordion item whose content is expanded.
   */
  value?: string
  /**
   * The value of the item whose content is expanded when the accordion is initially rendered. Use
   * `defaultValue` if you do not need to control the state of an accordion.
   */
  defaultValue?: string
  /**
   * Whether an accordion item can be collapsed after it has been opened.
   * @default false
   */
  collapsible?: boolean
}

interface AccordionMultipleProps {
  /**
   * The controlled stateful value of the accordion items whose contents are expanded.
   */
  value?: string[]
  /**
   * The value of the items whose contents are expanded when the accordion is initially rendered. Use
   * `defaultValue` if you do not need to control the state of an accordion.
   */
  defaultValue?: string[]
}

export interface AccordionImplProps {
  /**
   * Whether or not an accordion is disabled from user interaction.
   *
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * The layout in which the Accordion operates.
   * @default vertical
   */
  orientation?: AriaAttributes['aria-orientation']
  /**
   * The language read direction.
   */
  dir?: Direction
}

export const ACCORDION_KEYS = ['Home', 'End', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']

export const [Collection, useCollection] = createCollection<HTMLButtonElement>('Accordion')

export interface AccordionContext {
  id: string
  collapsible?: boolean

  disabled?: () => boolean | undefined
  direction: Ref<Direction>
  orientation: Exclude<AccordionImplProps['orientation'], undefined>

  value: Ref<string[]>
  onItemOpen: (value: string) => void
  onItemClose: (value: string) => void
}

export const [provideAccordionContext, useAccordionContext] = createContext<AccordionContext>('AccordionContext')

type SingleValue = AccordionRootProps<'single'>['value']
type MultipleValue = Exclude<AccordionRootProps<'multiple'>['value'], undefined>
type Value<T extends AccordionType> = T extends 'multiple' ? MultipleValue : SingleValue

export interface UseAccordionRootProps<T extends AccordionType> extends EmitsToHookProps<AccordionRootEmits<T>> {
  elRef?: MutableRefObject<HTMLElement | undefined>

  value?: () => AccordionRootProps<T>['value']
  defaultValue?: AccordionRootProps<T>['defaultValue']

  collapsible?: AccordionSingleProps['collapsible']

  type?: T
  disabled?: () => boolean | undefined
  orientation?: AccordionImplProps['orientation']
  dir?: MaybeRefOrGetter<Direction | undefined>
}

export function useAccordionRoot<T extends AccordionType>(props: UseAccordionRootProps<T>): RadixPrimitiveReturns {
  const { orientation = 'vertical' } = props

  const direction = useDirection(props.dir)
  const value = useControllableStateV2(
    props.value,
    props.onUpdateValue,
    (props.type === 'multiple' ? props.defaultValue ?? [] : props.defaultValue) as Value<T>,
  )
  const TYPE_MULTIPLE = 'multiple' as const satisfies AccordionType

  const elRef = props.elRef || useRef<HTMLElement>()
  const setTemplateEl = props.elRef ? undefined : (value: HTMLElement | undefined) => elRef.value = value

  const getItems = useCollection(Collection.provideCollectionContext(elRef))

  function onKeydown(event: KeyboardEvent) {
    if (event.defaultPrevented)
      return

    if (!ACCORDION_KEYS.includes(event.key))
      return
    const target = event.target as HTMLElement
    const triggerCollection = getItems().filter(item => !item.disabled)
    const triggerIndex = triggerCollection.findIndex(item => item === target)
    const triggerCount = triggerCollection.length

    if (triggerIndex === -1)
      return

    // Prevents page scroll while user is navigating
    event.preventDefault()

    let nextIndex = triggerIndex
    const homeIndex = 0
    const endIndex = triggerCount - 1

    const moveNext = () => {
      nextIndex = triggerIndex + 1
      if (nextIndex > endIndex) {
        nextIndex = homeIndex
      }
    }

    const movePrev = () => {
      nextIndex = triggerIndex - 1
      if (nextIndex < homeIndex) {
        nextIndex = endIndex
      }
    }

    switch (event.key) {
      case 'Home':
        nextIndex = homeIndex
        break
      case 'End':
        nextIndex = endIndex
        break
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          if (direction.value === 'ltr') {
            moveNext()
          }
          else {
            movePrev()
          }
        }
        break
      case 'ArrowDown':
        if (orientation === 'vertical') {
          moveNext()
        }
        break
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          if (direction.value === 'ltr') {
            movePrev()
          }
          else {
            moveNext()
          }
        }
        break
      case 'ArrowUp':
        if (orientation === 'vertical') {
          movePrev()
        }
        break
    }

    const clampedIndex = nextIndex % triggerCount
    triggerCollection[clampedIndex]?.focus()
  }

  provideAccordionContext({
    id: useId(),
    collapsible: props.collapsible,

    disabled: props.disabled,
    direction,
    orientation: orientation ?? 'vertical',
    value: props.type === TYPE_MULTIPLE
      ? value as Ref<string[]>
      : computed<string[]>(() => value.value ? [value.value as string] : []),
    onItemOpen: props.type === TYPE_MULTIPLE
      ? (itemValue) => {
          value.value = [...value.value || [], itemValue] as Value<T>
        }
      : (itemValue) => {
          value.value = itemValue as Value<T>
        },
    onItemClose: props.type === TYPE_MULTIPLE
      ? (itemValue) => {
          value.value = ((value.value || []) as string[]).filter(value => value !== itemValue) as Value<T>
        }
      : () => {
          if (props.collapsible) {
            value.value = '' as Value<T>
          }
        },
  })

  return {
    attrs(extraAttrs) {
      const _disabled = props.disabled?.()
      const attrs = {
        'elRef': setTemplateEl,
        'data-disabled': _disabled ? '' : undefined,
        'data-orientation': orientation,
        'onKeydown': _disabled ? NOOP : onKeydown,
      }

      if (extraAttrs && extraAttrs.length > 0) {
        mergePrimitiveAttrs(attrs, extraAttrs)
      }

      return attrs
    },
  }
}
