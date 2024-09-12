import CStyled from './Styled.vue'
import CSubmenus from './Submenus.vue'
import CWithLabels from './WithLabels.vue'

export default {
  title: 'Utilities/Menu',
  excludeStories: ['TickIcon', 'classes'],
}

export function Styled() {
  return CStyled
}

export function Submenus() {
  return CSubmenus
}

export function WithLabels() {
  return CWithLabels
}
