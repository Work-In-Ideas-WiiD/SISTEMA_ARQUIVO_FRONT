import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type UploadStatus = 'uploading' | 'success' | 'error'

export interface UploadItem {
  id: string
  fileName: string
  progress: number
  status: UploadStatus
  errorMessage?: string
}

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `upload-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useUploadProgressStore = defineStore('uploadProgress', () => {
  const items = ref<UploadItem[]>([])

  const hasItems = computed(() => items.value.length > 0)

  function startUpload(fileName: string): string {
    const id = createId()
    items.value = [
      ...items.value,
      {
        id,
        fileName,
        progress: 0,
        status: 'uploading'
      }
    ]
    return id
  }

  function setProgress(id: string, progress: number) {
    const item = items.value.find((entry) => entry.id === id)
    if (!item || item.status !== 'uploading') return
    // Mantém em no máximo 99% até a API confirmar (evita "100% + Enviando")
    item.progress = Math.min(99, Math.max(0, Math.round(progress)))
  }

  function setSuccess(id: string) {
    const item = items.value.find((entry) => entry.id === id)
    if (!item) return
    item.progress = 100
    item.status = 'success'
    window.setTimeout(() => removeUpload(id), 4000)
  }

  function setError(id: string, errorMessage?: string) {
    const item = items.value.find((entry) => entry.id === id)
    if (!item) return
    item.status = 'error'
    item.errorMessage = errorMessage || 'Falha no envio'
  }

  function removeUpload(id: string) {
    items.value = items.value.filter((entry) => entry.id !== id)
  }

  return {
    items,
    hasItems,
    startUpload,
    setProgress,
    setSuccess,
    setError,
    removeUpload
  }
})
