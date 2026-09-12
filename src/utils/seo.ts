export interface ISeoOptions {
  title: string
  description: string
  canonicalUrl?: string
  robots?: string
  ogImage?: string
  ogType?: string
  jsonLd?: Record<string, any> | Array<Record<string, any>>
}

const DEFAULT_ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'https://akidocs.com.br'
const DEFAULT_IMAGE = `${DEFAULT_ORIGIN}/logo-akidocs-white.png`

/**
 * Atualiza dinamicamente as meta tags da página para SEO, Open Graph, Twitter e Schema.org
 */
export function setPageSeo(options: ISeoOptions): void {
  if (typeof document === 'undefined') return

  // 1. Title
  document.title = options.title

  // 2. Meta tags auxiliares
  setMetaTag('description', options.description)
  setMetaTag('robots', options.robots || 'index, follow')

  // 3. Canonical URL
  const canonical = options.canonicalUrl || (typeof window !== 'undefined' ? window.location.href.split('?')[0] : DEFAULT_ORIGIN)
  setLinkTag('canonical', canonical)

  // 4. Open Graph
  setMetaProperty('og:title', options.title)
  setMetaProperty('og:description', options.description)
  setMetaProperty('og:url', canonical)
  setMetaProperty('og:type', options.ogType || 'website')
  setMetaProperty('og:image', options.ogImage || DEFAULT_IMAGE)
  setMetaProperty('og:site_name', 'AkiDocs')
  setMetaProperty('og:locale', 'pt_BR')

  // 5. Twitter Card
  setMetaTag('twitter:card', 'summary_large_image')
  setMetaTag('twitter:title', options.title)
  setMetaTag('twitter:description', options.description)
  setMetaTag('twitter:image', options.ogImage || DEFAULT_IMAGE)

  // 6. Schema.org JSON-LD
  if (options.jsonLd) {
    setJsonLd(options.jsonLd)
  }
}

function setMetaTag(name: string, content: string): void {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setMetaProperty(property: string, content: string): void {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setLinkTag(rel: string, href: string): void {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

const JSON_LD_SCRIPT_ID = 'akidocs-schema-jsonld'

function setJsonLd(data: Record<string, any> | Array<Record<string, any>>): void {
  let script = document.getElementById(JSON_LD_SCRIPT_ID) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = JSON_LD_SCRIPT_ID
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}
