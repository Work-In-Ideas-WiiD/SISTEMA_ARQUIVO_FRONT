import { computed, ref, type Ref } from 'vue'
import { useToast } from 'vue-toastification'
import {
  moverArquivos,
  type IDestinoArquivo,
  type IGetArquivosDataRes
} from '@/services/http/arquivos'
import { getApiErrorMessage } from '@/utils/apiError'
import { useFileSelection, gridColumnCount } from '@/composables/useFileSelection'
import { useArquivoDragMove } from '@/composables/useArquivoDragMove'
import type { ContextMenuItem } from '@/components/ArquivoContextMenu/types'
import iconAbrir from '@/assets/imgs/arquivos/menu-abrir.svg'
import iconMover from '@/assets/imgs/arquivos/menu-mover.svg'
import iconPermissoes from '@/assets/imgs/arquivos/menu-permissoes.svg'
import iconCompartilhar from '@/assets/imgs/arquivos/share.svg'
import iconLog from '@/assets/imgs/arquivos/menu-log.svg'

type MenuKey = 'abrir' | 'mover' | 'permissoes' | 'compartilhar' | 'log'

/**
 * Interações dos tiles de arquivo no explorer: seleção (clique, Shift/Ctrl, setas),
 * duplo clique abre, menu de contexto e arrastar para pastas/níveis.
 */
export function useArquivoInteractions(opts: {
  arquivos: Ref<IGetArquivosDataRes[]>
  empresaId: Ref<string>
  abrir: (arquivo: IGetArquivosDataRes) => void
  recarregar: () => Promise<void> | void
}) {
  const toast = useToast()
  const selection = useFileSelection(opts.arquivos)

  const menu = ref({ open: false, x: 0, y: 0 })
  const moverOpen = ref(false)
  const permissoesOpen = ref(false)
  const compartilharOpen = ref(false)
  const logOpen = ref(false)
  /** Arquivos alvo da ação aberta (congelados ao abrir o modal). */
  const alvo = ref<IGetArquivosDataRes[]>([])

  const menuItems = computed<ContextMenuItem[]>(() => {
    const itens: ContextMenuItem[] = [
      { key: 'mover', label: 'Mover', icon: iconMover },
      { key: 'permissoes', label: 'Editar permissões', icon: iconPermissoes },
      { key: 'compartilhar', label: 'Compartilhar', icon: iconCompartilhar }
    ]
    if (selection.selectedItems.value.length <= 1) {
      itens.unshift({ key: 'abrir', label: 'Abrir', icon: iconAbrir })
      itens.push({ key: 'log', label: 'Log de acessos', icon: iconLog })
    }
    return itens
  })

  const menuTitle = computed(() => {
    const n = selection.selectedItems.value.length
    return n > 1 ? `${n} arquivos selecionados` : undefined
  })

  async function mover(ids: string[], destino: IDestinoArquivo) {
    try {
      const { data } = await moverArquivos(ids, opts.empresaId.value, destino)
      const n = data?.movidos ?? ids.length
      toast.success(n > 1 ? `${n} arquivos movidos` : 'Arquivo movido')
      selection.clear()
      await opts.recarregar()
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Erro ao mover arquivos'))
    }
  }

  const drag = useArquivoDragMove((ids, destino) => void mover(ids, destino))

  function onTileClick(index: number, event: MouseEvent) {
    selection.onItemClick(index, event)
  }

  function onTileDblClick(arquivo: IGetArquivosDataRes) {
    opts.abrir(arquivo)
  }

  function onTileContextMenu(index: number, event: MouseEvent) {
    selection.onItemContextMenu(index)
    menu.value = { open: true, x: event.clientX, y: event.clientY }
  }

  function onTileDragStart(event: DragEvent, arquivo: IGetArquivosDataRes) {
    const ids = selection.isSelected(arquivo.id)
      ? selection.selectedItems.value.map((a) => a.id)
      : [arquivo.id]
    const tile = event.currentTarget as HTMLElement | null
    drag.start(event, ids, tile?.querySelector<HTMLElement>('[data-drag-preview]'))
  }

  function onGridKeydown(event: KeyboardEvent, grid: HTMLElement | null, offset = 0) {
    if (event.key === 'Enter') {
      const [unico] = selection.selectedItems.value
      if (unico && selection.selectedItems.value.length === 1) {
        event.preventDefault()
        opts.abrir(unico)
      }
      return
    }
    if (!selection.onKeydown(event, gridColumnCount(grid), offset)) return
    const idx = selection.cursor.value
    if (idx !== null) {
      grid?.querySelector<HTMLElement>(`[data-arquivo-index="${idx}"]`)?.focus()
    }
  }

  function closeMenu() {
    menu.value = { ...menu.value, open: false }
  }

  function onMenuSelect(key: string) {
    closeMenu()
    alvo.value = [...selection.selectedItems.value]
    if (!alvo.value.length) return
    switch (key as MenuKey) {
      case 'abrir':
        opts.abrir(alvo.value[0])
        break
      case 'mover':
        moverOpen.value = true
        break
      case 'permissoes':
        permissoesOpen.value = true
        break
      case 'compartilhar':
        compartilharOpen.value = true
        break
      case 'log':
        logOpen.value = true
        break
    }
  }

  async function onMoved() {
    moverOpen.value = false
    selection.clear()
    await opts.recarregar()
  }

  async function onPermissoesSaved() {
    await opts.recarregar()
  }

  return {
    ...selection,
    drag,
    menu,
    menuItems,
    menuTitle,
    moverOpen,
    permissoesOpen,
    compartilharOpen,
    logOpen,
    alvo,
    mover,
    onTileClick,
    onTileDblClick,
    onTileContextMenu,
    onTileDragStart,
    onGridKeydown,
    closeMenu,
    onMenuSelect,
    onMoved,
    onPermissoesSaved
  }
}
