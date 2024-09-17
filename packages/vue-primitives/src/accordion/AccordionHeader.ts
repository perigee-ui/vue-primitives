import { useAccordionItemContext } from './AccordionItem.ts'
import { useAccordionContext } from './AccordionRoot.ts'
import { getState } from './utils.ts'

export function useAccordionHeader() {
  const accordionContext = useAccordionContext('AccordionHeader')
  const itemContext = useAccordionItemContext('AccordionHeader')

  return () => ({
    dataOrientation: accordionContext.orientation,
    dataState: getState(itemContext.open.value),
    dataDisabled: itemContext.disabled.value ? '' : undefined,
  })
}
