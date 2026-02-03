interface ClicksignInstance {
  endpoint: string
  origin: string
  mount: (elementId: string) => HTMLIFrameElement
  unmount: () => boolean
  on: (event: string, callback: (data: any) => void) => void
  trigger: (event: any) => void
}

export function Clicksign(key: string): ClicksignInstance {
  'use strict'

  const origin = window.location.protocol + '//' + window.location.host
  const events: Record<string, ((data: any) => void)[]> = {}
  let iframe: HTMLIFrameElement | null = null
  let container: HTMLElement | null = null

  function trigger(event: any) {
    const handlers = events[event.name || event] || []
    handlers.forEach((handler) => {
      handler(event.data)
    })
  }

  function messageHandler(event: MessageEvent) {
    trigger(event.data)
  }

  return {
    endpoint: 'https://app.clicksign.com',
    origin,
    mount(elementId: string) {
      const path = '/sign/' + key
      const query = '?embedded=true&origin=' + this.origin
      const src = this.endpoint + path + query

      container = document.getElementById(elementId)
      iframe = document.createElement('iframe')
      iframe.setAttribute('src', src)
      iframe.setAttribute('style', 'width: 100%; height: 100%;')
      iframe.setAttribute('allow', 'camera;geolocation')

      window.addEventListener('message', messageHandler)
      container?.appendChild(iframe)

      return iframe
    },
    unmount() {
      if (iframe && container) {
        container.removeChild(iframe)
        iframe = null
        container = null
        window.removeEventListener('message', messageHandler)
      }
      return true
    },
    on(event: string, callback: (data: any) => void) {
      if (!events[event]) {
        events[event] = []
      }
      events[event].push(callback)
    },
    trigger
  }
}
