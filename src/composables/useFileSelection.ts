import { computed, ref, watch, type Ref } from 'vue'

/**
 * Seleção estilo gerenciador de arquivos: clique seleciona um, Shift+clique/Shift+seta
 * seleciona intervalo, Ctrl/Cmd+clique alterna.
 */
export function useFileSelection<T extends { id: string }>(items: Ref<T[]>) {
  const selectedIds = ref(new Set<string>())
  const anchor = ref<number | null>(null)
  const cursor = ref<number | null>(null)

  const selectedItems = computed(() => items.value.filter((i) => selectedIds.value.has(i.id)))

  function isSelected(id: string) {
    return selectedIds.value.has(id)
  }

  function clear() {
    selectedIds.value = new Set()
    anchor.value = null
    cursor.value = null
  }

  function selectOnly(index: number) {
    const item = items.value[index]
    if (!item) return
    selectedIds.value = new Set([item.id])
    anchor.value = index
    cursor.value = index
  }

  function selectRange(from: number, to: number, keepCurrent = false) {
    const [start, end] = from <= to ? [from, to] : [to, from]
    const next = keepCurrent ? new Set(selectedIds.value) : new Set<string>()
    items.value.slice(start, end + 1).forEach((i) => next.add(i.id))
    selectedIds.value = next
    cursor.value = to
  }

  function onItemClick(index: number, event: MouseEvent) {
    const additive = event.ctrlKey || event.metaKey
    if (event.shiftKey && anchor.value !== null) {
      selectRange(anchor.value, index, additive)
      return
    }
    if (additive) {
      const item = items.value[index]
      const next = new Set(selectedIds.value)
      if (next.has(item.id)) next.delete(item.id)
      else next.add(item.id)
      selectedIds.value = next
      anchor.value = index
      cursor.value = index
      return
    }
    selectOnly(index)
  }

  function onItemContextMenu(index: number) {
    const item = items.value[index]
    if (item && !selectedIds.value.has(item.id)) selectOnly(index)
  }

  /**
   * `offset` = quantos tiles (ex.: pastas) vêm antes dos arquivos no grid, para ↑/↓
   * manterem a coluna visual. Retorna true se tratou a tecla.
   */
  function onKeydown(event: KeyboardEvent, columns: number, offset = 0): boolean {
    const total = items.value.length
    if (!total) return false

    if (event.key === 'Escape') {
      clear()
      return true
    }

    const deltas: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -Math.max(1, columns),
      ArrowDown: Math.max(1, columns)
    }
    const delta = deltas[event.key]
    if (delta === undefined) return false

    const atual = cursor.value ?? (delta > 0 ? -1 : total)
    const alvoNoGrid = atual + offset + delta
    const alvo = Math.min(total - 1, Math.max(0, alvoNoGrid - offset))
    event.preventDefault()

    if (event.shiftKey) {
      if (anchor.value === null) anchor.value = cursor.value ?? alvo
      selectRange(anchor.value, alvo)
    } else {
      selectOnly(alvo)
    }
    return true
  }

  watch(items, (lista) => {
    const ids = new Set(lista.map((i) => i.id))
    const restantes = [...selectedIds.value].filter((id) => ids.has(id))
    if (restantes.length !== selectedIds.value.size) selectedIds.value = new Set(restantes)
    if (!restantes.length) {
      anchor.value = null
      cursor.value = null
    }
  })

  return {
    selectedIds,
    selectedItems,
    cursor,
    isSelected,
    clear,
    onItemClick,
    onItemContextMenu,
    onKeydown
  }
}

export function gridColumnCount(grid: HTMLElement | null): number {
  if (!grid) return 1
  const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean)
  return Math.max(1, cols.length)
}
