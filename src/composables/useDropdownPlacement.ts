import { computed, ref } from 'vue'

const GAP = 8
const MIN_HEIGHT = 120

/**
 * Abre o menu para cima quando não cabe abaixo do gatilho dentro do container
 * (containers com overflow hidden cortam o menu absoluto).
 */
export function useDropdownPlacement(boundarySelector: string, maxHeight = 200) {
  const up = ref(false)
  const height = ref(maxHeight)

  function place(trigger: EventTarget | null) {
    if (!(trigger instanceof HTMLElement)) return
    const rect = trigger.getBoundingClientRect()
    const bounds = trigger.closest(boundarySelector)?.getBoundingClientRect()
    const below = (bounds?.bottom ?? window.innerHeight) - rect.bottom - GAP
    const above = rect.top - (bounds?.top ?? 0) - GAP

    up.value = below < maxHeight && above > below
    height.value = Math.max(MIN_HEIGHT, Math.min(maxHeight, up.value ? above : below))
  }

  const menuClass = computed(() => ({ 'night-select__menu--up': up.value }))
  const menuStyle = computed(() => ({ maxHeight: `${height.value}px` }))

  return { place, menuClass, menuStyle }
}
