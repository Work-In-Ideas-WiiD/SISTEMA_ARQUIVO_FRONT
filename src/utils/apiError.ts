import { useAuthStore } from '@/stores/auth'

type ApiErrorData = {
  message?: string
  error_code?: string
  errors?: Record<string, string[] | string>
}

type AxiosLikeError = {
  response?: {
    status?: number
    data?: ApiErrorData
  }
}

function firstValidationMessage(errors: ApiErrorData['errors']): string | null {
  if (!errors || typeof errors !== 'object') return null
  const first = Object.values(errors)[0]
  if (Array.isArray(first) && first[0]) return String(first[0])
  if (typeof first === 'string' && first) return first
  return null
}

function isPlatformAdmin(): boolean {
  try {
    return useAuthStore().userRole === 'administrador'
  } catch {
    return false
  }
}

/**
 * Extrai mensagem de erro Axios/Laravel.
 * - ADMINISTRADOR: mensagem real da API
 * - Demais perfis: validação (422) em texto; outros erros mascarados com código
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const err = error as AxiosLikeError
  const status = err?.response?.status
  const data = err?.response?.data

  if (!data) return fallback

  const validationMsg = firstValidationMessage(data.errors)
  if (validationMsg) return validationMsg

  // 422 sem bag de errors — ainda é validação de negócio amigável
  if (status === 422 && data.message) {
    return String(data.message)
  }

  if (isPlatformAdmin()) {
    if (data.message) return String(data.message)
    return fallback
  }

  // Já mascarado pela API
  if (data.error_code) {
    return data.message || `Ocorreu um erro. Código: ${data.error_code}`
  }

  // Fallback se a API ainda devolver literal (ex.: antes do middleware)
  if (status && status >= 400 && status !== 422) {
    const code = data.error_code || 'AKI-GEN-500'
    return `Ocorreu um erro. Código: ${code}`
  }

  if (data.message) return String(data.message)

  return fallback
}
