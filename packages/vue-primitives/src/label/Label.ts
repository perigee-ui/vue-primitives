import type { PrimitiveProps } from '../primitive/index.ts'

export interface LabelProps {
  as?: PrimitiveProps['as']
}

// eslint-disable-next-line ts/consistent-type-definitions
export type LabelEmits = {
  mousedown: [event: MouseEvent]
}

export interface UseLabelEmits {
  onMousedown?: (event: MouseEvent) => void
}

export interface UseLabelReturns {
  onMousedown?: (event: MouseEvent) => void
}

export function useLabel(emits?: UseLabelEmits): () => UseLabelReturns {
  function onMousedown(event: MouseEvent) {
    // only prevent text selection if clicking inside the label itself
    const target = event.target as HTMLElement
    if (target.closest('button, input, select, textarea'))
      return

    emits?.onMousedown?.(event)
    // prevent text selection when double clicking label
    if (!event.defaultPrevented && event.detail > 1)
      event.preventDefault()
  }

  return () => ({
    onMousedown,
  })
}
