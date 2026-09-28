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

  function start(event: DragEvent, ids: string[]) {
    if (!event.dataTransfer || !ids.length) return
    event.dataTransfer.setData(MIME, JSON.stringify(ids))
    event.dataTransfer.effectAllowed = 'move'
    dragging.value = true
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
