import { ref } from 'vue'
import type { IDestinoArquivo } from '@/services/http/arquivos'

const MIME = 'application/x-akidocs-arquivos'

/**
 * Arrastar arquivos (tiles) e soltar em pastas/níveis. Separado do drop de arquivos
 * do computador (usePageFileDrop), que só reage a DataTransfer com "Files".
 */
export function useArquivoDragMove(onMove: (ids: string[], destino: IDestinoArquivo) => void) {
  const dragging = ref(false)
  const hoverKey = ref<string | null>(null)

  function isOurs(event: DragEvent) {
    return Array.from(event.dataTransfer?.types || []).includes(MIME)
  }

  function start(event: DragEvent, ids: string[], preview?: HTMLElement | null) {
    if (!event.dataTransfer || !ids.length) return
    event.dataTransfer.setData(MIME, JSON.stringify(ids))
    event.dataTransfer.effectAllowed = 'move'
    if (preview) setPreview(event, preview, ids.length)
    dragging.value = true
  }

  /**
   * O snapshot nativo do tile (botão transparente) captura o fundo do painel em volta
   * do card arredondado; usa um clone só do card, com fundo sólido.
   */
  function setPreview(event: DragEvent, card: HTMLElement, total: number) {
    const rect = card.getBoundingClientRect()
    const ghost = card.cloneNode(true) as HTMLElement
    Object.assign(ghost.style, {
      position: 'fixed',
      top: '-1000px',
      left: '-1000px',
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      background: '#23364d',
      borderColor: '#fffcff',
      boxShadow: 'none',
      opacity: '1',
      pointerEvents: 'none'
    })
    if (total > 1) {
      const badge = document.createElement('span')
      badge.textContent = String(total)
      Object.assign(badge.style, {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        minWidth: '24px',
        height: '24px',
        padding: '0 6px',
        borderRadius: '12px',
        background: '#b08d57',
        color: '#0b1b2b',
        font: '700 12px/24px Inter, sans-serif',
        textAlign: 'center',
        boxSizing: 'border-box'
      })
      ghost.style.overflow = 'visible'
      ghost.appendChild(badge)
    }
    document.body.appendChild(ghost)
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width)
    const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height)
    event.dataTransfer?.setDragImage(ghost, x, y)
    setTimeout(() => ghost.remove(), 0)
  }

  function end() {
    dragging.value = false
    hoverKey.value = null
  }

  function over(event: DragEvent, key: string) {
    if (!isOurs(event)) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
    hoverKey.value = key
  }

  function leave(key: string) {
    if (hoverKey.value === key) hoverKey.value = null
  }

  function drop(event: DragEvent, destino: IDestinoArquivo) {
    if (!isOurs(event)) return
    event.preventDefault()
    event.stopPropagation()
    let ids: string[] = []
    try {
      ids = JSON.parse(event.dataTransfer?.getData(MIME) || '[]')
    } catch {
      ids = []
    }
    end()
    if (ids.length) onMove(ids, destino)
  }

  return { dragging, hoverKey, start, end, over, leave, drop }
}
