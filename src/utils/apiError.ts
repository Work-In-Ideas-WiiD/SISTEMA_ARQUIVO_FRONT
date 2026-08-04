/**
 * Extrai mensagem amigável de erro Axios/Laravel (422 etc.).
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    response?: { data?: { message?: string; errors?: Record<string, string[] | string> } }
  }

  const data = err?.response?.data
  if (!data) return fallback

  if (data.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors)[0]
    if (Array.isArray(first) && first[0]) return String(first[0])
    if (typeof first === 'string' && first) return first
  }

  if (data.message) return String(data.message)

  return fallback
}
