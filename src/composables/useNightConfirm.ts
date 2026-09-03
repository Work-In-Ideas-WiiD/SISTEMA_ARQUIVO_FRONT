import { reactive, ref } from 'vue'

export type NightConfirmOptions = {
  title: string
  body: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

export function useNightConfirm() {
  const open = ref(false)
  const loading = ref(false)
  const options = reactive<NightConfirmOptions>({
    title: '',
    body: '',
    confirmLabel: 'CONFIRMAR',
    cancelLabel: 'VOLTAR',
    danger: true
  })

  let resolvePromise: ((value: boolean) => void) | null = null

  function askConfirm(next: NightConfirmOptions): Promise<boolean> {
    options.title = next.title
    options.body = next.body
    options.confirmLabel = next.confirmLabel || 'CONFIRMAR'
    options.cancelLabel = next.cancelLabel || 'VOLTAR'
    options.danger = next.danger ?? true
    open.value = true

    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve
    })
  }

  function resolveConfirm(value: boolean) {
    if (loading.value && value) return
    open.value = false
    loading.value = false
    resolvePromise?.(value)
    resolvePromise = null
  }

  function onConfirm() {
    resolveConfirm(true)
  }

  function onCancel() {
    resolveConfirm(false)
  }

  return {
    open,
    loading,
    options,
    askConfirm,
    onConfirm,
    onCancel
  }
}
