export interface IUtmParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

const STORAGE_KEY = 'wiidocs_utm_params'
const PLANO_STORAGE_KEY = 'wiidocs_selected_plan'

/**
 * Inicializa a captura de parâmetros UTM da URL e persiste em sessionStorage
 */
export function initUtmTracking(): IUtmParams {
  if (typeof window === 'undefined') return {}

  try {
    const searchParams = new URLSearchParams(window.location.search)
    const currentParams: IUtmParams = {}

    const keys: (keyof IUtmParams)[] = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content'
    ]

    let found = false
    for (const key of keys) {
      const val = searchParams.get(key)
      if (val) {
        currentParams[key] = val
        found = true
      }
    }

    if (found) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentParams))
      return currentParams
    }

    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as IUtmParams
    }
  } catch (err) {
    console.warn('Erro ao processar parâmetros UTM:', err)
  }

  return {}
}

/**
 * Retorna os parâmetros UTM salvos
 */
export function getStoredUtmParams(): IUtmParams {
  if (typeof window === 'undefined') return {}
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

/**
 * Salva a intenção de contratação de um plano (selecionado na Landing Page)
 */
export function saveSelectedPlan(plan: { id: string; nome: string; valor_mensal_centavos: number; periodicidade?: string }): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(PLANO_STORAGE_KEY, JSON.stringify(plan))
  } catch (err) {
    console.warn('Erro ao salvar plano selecionado:', err)
  }
}

/**
 * Recupera o plano pré-selecionado
 */
export function getSelectedPlan(): { id: string; nome: string; valor_mensal_centavos: number; periodicidade?: string } | null {
  if (typeof window === 'undefined') return null
  try {
    const data = sessionStorage.getItem(PLANO_STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

/**
 * Dispara evento de conversão para Google Analytics (gtag) e dataLayer
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return

  const enrichedParams = {
    ...getStoredUtmParams(),
    ...params,
    timestamp: new Date().toISOString()
  }

  // 1. Google Tag Manager / dataLayer
  if ((window as any).dataLayer && Array.isArray((window as any).dataLayer)) {
    ;(window as any).dataLayer.push({
      event: eventName,
      ...enrichedParams
    })
  }

  // 2. Google Analytics 4 (gtag)
  if (typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', eventName, enrichedParams)
  }

  // 3. Fallback / Log de Desenvolvimento
  if (import.meta.env.DEV) {
    console.log(`[Analytics Event] ${eventName}:`, enrichedParams)
  }
}
