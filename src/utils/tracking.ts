export interface IUtmParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

export interface ISelectedPlan {
  id: string
  nome: string
  valor_mensal_centavos: number
  periodicidade?: string
}

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-6DQ5G4E85Q'

const STORAGE_KEY = 'akidocs_utm_params'
const PLANO_STORAGE_KEY = 'akidocs_selected_plan'

let isFirstNavigation = true

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
export function saveSelectedPlan(plan: ISelectedPlan): void {
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
export function getSelectedPlan(): ISelectedPlan | null {
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

/**
 * Dispara evento de visualização de página virtual no GA4 em transições de rotas SPA
 */
export function trackPageView(pagePath?: string, pageTitle?: string): void {
  if (typeof window === 'undefined') return

  // O script gtag('config', ...) no index.html já dispara o primeiro page_view na carga inicial.
  // Evitamos contagem duplicada no primeiro acesso.
  if (isFirstNavigation) {
    isFirstNavigation = false
    return
  }

  const path = pagePath || window.location.pathname + window.location.search
  const title = pageTitle || document.title

  const pageParams = {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
    ...getStoredUtmParams()
  }

  if (typeof (window as any).gtag === 'function') {
    ;(window as any).gtag('event', 'page_view', pageParams)
  }

  if ((window as any).dataLayer && Array.isArray((window as any).dataLayer)) {
    ;(window as any).dataLayer.push({
      event: 'page_view',
      ...pageParams
    })
  }

  if (import.meta.env.DEV) {
    console.log('[Analytics PageView]', pageParams)
  }
}

/**
 * Rastreia cliques nos botões de chamada para ação (CTAs) como "Começar Agora"
 */
export function trackCtaClick(ctaName: string, local: string, extra: Record<string, any> = {}): void {
  trackEvent('clique_comecar_agora', {
    cta_name: ctaName,
    local,
    ...extra
  })

  // Evento recomendado GA4 para seleção de conteúdo
  trackEvent('select_content', {
    content_type: 'cta_button',
    item_id: ctaName,
    local,
    ...extra
  })
}

/**
 * Rastreia cliques no botão de login
 */
export function trackLoginClick(local: string): void {
  trackEvent('clique_login', { local })

  trackEvent('select_content', {
    content_type: 'login_button',
    item_id: 'login',
    local
  })
}

/**
 * Rastreia a seleção de um plano na Landing Page
 */
export function trackPlanSelection(plano: ISelectedPlan): void {
  const price = plano.valor_mensal_centavos / 100

  trackEvent('selecionar_plano', {
    plano_id: plano.id,
    plano_nome: plano.nome,
    periodicidade: plano.periodicidade || 'mensal',
    valor: price
  })

  // Evento padrão do GA4: select_item
  trackEvent('select_item', {
    item_list_name: 'planos_landing',
    items: [
      {
        item_id: plano.id,
        item_name: plano.nome,
        price,
        item_category: 'plano_assinatura',
        item_variant: plano.periodicidade || 'mensal',
        quantity: 1
      }
    ]
  })
}

/**
 * Rastreia o início do fluxo de contratação / checkout
 */
export function trackBeginCheckout(plano: ISelectedPlan): void {
  const price = plano.valor_mensal_centavos / 100

  trackEvent('contratar_plano', {
    plano_id: plano.id,
    plano_nome: plano.nome,
    periodicidade: plano.periodicidade || 'mensal',
    valor: price
  })

  // Evento padrão do GA4: begin_checkout
  trackEvent('begin_checkout', {
    currency: 'BRL',
    value: price,
    items: [
      {
        item_id: plano.id,
        item_name: plano.nome,
        price,
        item_category: 'plano_assinatura',
        item_variant: plano.periodicidade || 'mensal',
        quantity: 1
      }
    ]
  })
}

/**
 * Rastreia cadastro concluído com sucesso
 */
export function trackSignUp(method: string = 'email'): void {
  trackEvent('cadastro_concluido', { method })

  // Evento padrão do GA4: sign_up
  trackEvent('sign_up', { method })
}

/**
 * Rastreia login concluído com sucesso
 */
export function trackLogin(method: string = 'email'): void {
  // Evento padrão do GA4: login
  trackEvent('login', { method })
}

/**
 * Rastreia cliques em canais de contato (WhatsApp, E-mail, Telefone)
 */
export function trackContactClick(
  channel: 'whatsapp' | 'email' | 'telefone',
  local: string,
  destination?: string
): void {
  trackEvent('clique_contato', {
    canal: channel,
    local,
    destino: destination
  })

  // Evento padrão do GA4: generate_lead (contato direto é forte sinal de intenção)
  trackEvent('generate_lead', {
    lead_type: 'contato_direto',
    contact_method: channel,
    local,
    destination: destination || channel
  })
}

/**
 * Rastreia contratação / assinatura concluída com sucesso (conversão final)
 */
export function trackPurchase(details: {
  transactionId?: string
  plano: ISelectedPlan
}): void {
  const price = details.plano.valor_mensal_centavos / 100

  trackEvent('assinatura_confirmada', {
    transaction_id: details.transactionId,
    plano_id: details.plano.id,
    plano_nome: details.plano.nome,
    valor: price
  })

  // Evento padrão do GA4: purchase
  trackEvent('purchase', {
    transaction_id: details.transactionId || `sub_${Date.now()}`,
    value: price,
    currency: 'BRL',
    items: [
      {
        item_id: details.plano.id,
        item_name: details.plano.nome,
        price,
        item_category: 'plano_assinatura',
        item_variant: details.plano.periodicidade || 'mensal',
        quantity: 1
      }
    ]
  })
}
