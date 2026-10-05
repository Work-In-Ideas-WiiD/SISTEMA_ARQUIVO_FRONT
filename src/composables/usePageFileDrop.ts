import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Habilita overlay de drag-and-drop na janela apenas enquanto a página de upload
 * estiver montada. Não altera regras de validação — apenas entrega o File ao caller.
 */
export function usePageFileDrop(onFileDropped: (file: File) => void): {
  isDragging: Ref<boolean>
} {
  const isDragging = ref(false)
  let dragDepth = 0
  /**
   * Arrastes iniciados dentro da página (imagens, tiles) também podem trazer "Files"
   * no Chrome; só arquivos vindos do sistema operacional devem abrir o upload.
   */
  let internalDrag = false

  function onDragStart() {
    internalDrag = true
  }

  function onDragEnd() {
    internalDrag = false
  }

  /** O tile de origem pode sair do DOM após o drop (sem dragend); limpa depois do drop. */
  function onAnyDrop() {
    setTimeout(onDragEnd, 0)
  }

  function hasFiles(event: DragEvent): boolean {
    if (internalDrag) return false
    const types = event.dataTransfer?.types
    if (!types) return false
    return Array.from(types).includes('Files')
  }

  function onDragEnter(event: DragEvent) {
    if (!hasFiles(event)) return
    event.preventDefault()
    dragDepth += 1
    isDragging.value = true
  }

  function onDragOver(event: DragEvent) {
    if (!hasFiles(event)) return
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy'
    }
  }

  function onDragLeave(event: DragEvent) {
    if (!hasFiles(event)) return
    event.preventDefault()
    dragDepth = Math.max(0, dragDepth - 1)
    if (dragDepth === 0) {
      isDragging.value = false
    }
  }

  function onDrop(event: DragEvent) {
    if (internalDrag) {
      event.preventDefault()
      internalDrag = false
      return
    }
    if (!hasFiles(event)) return
    event.preventDefault()
    dragDepth = 0
    isDragging.value = false

    const files = event.dataTransfer?.files
    if (!files || files.length === 0) return

    // Upload atual da plataforma é de 1 arquivo por vez
    onFileDropped(files[0])
  }

  onMounted(() => {
    window.addEventListener('dragstart', onDragStart)
    window.addEventListener('dragend', onDragEnd)
    window.addEventListener('drop', onAnyDrop, true)
    window.addEventListener('dragenter', onDragEnter)
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('dragleave', onDragLeave)
    window.addEventListener('drop', onDrop)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('dragstart', onDragStart)
    window.removeEventListener('dragend', onDragEnd)
    window.removeEventListener('drop', onAnyDrop, true)
    window.removeEventListener('dragenter', onDragEnter)
    window.removeEventListener('dragover', onDragOver)
    window.removeEventListener('dragleave', onDragLeave)
    window.removeEventListener('drop', onDrop)
  })

  return { isDragging }
}
