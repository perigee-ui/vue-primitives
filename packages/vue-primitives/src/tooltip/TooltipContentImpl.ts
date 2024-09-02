export interface TooltipContentImplProps {
  /**
   * A more descriptive label for accessibility purpose
   */
  'aria-label'?: string
}

// eslint-disable-next-line ts/consistent-type-definitions
export type TooltipContentImplEmits = {
  /** Event handler called when focus moves to the destructive action after opening. It can be prevented by calling `event.preventDefault` */
  escapeKeydown: [event: KeyboardEvent]
  /** Event handler called when a pointer event occurs outside the bounds of the component. It can be prevented by calling `event.preventDefault`. */
  pointerdownOutside: [event: Event]
}
