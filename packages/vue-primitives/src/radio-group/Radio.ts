import { createContext } from '../hooks/index.ts'

export interface RadioContext {
  checked: () => boolean
  disabled: () => boolean
}
export const [provideRadioContext, useRadioContext] = createContext<RadioContext>('Radio')

export function getState(checked: boolean) {
  return checked ? 'checked' : 'unchecked'
}
