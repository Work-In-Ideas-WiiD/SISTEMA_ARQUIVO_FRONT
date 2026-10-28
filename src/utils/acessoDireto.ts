const CHAVE = 'ana_lucia.dispositivo'

/** Identificador deste navegador. Fica fora do cookie de 30 dias. */
export function dispositivoDesteNavegador(criar = true): string {
  let id = ''
  try {
    id = localStorage.getItem(CHAVE) || ''
  } catch {
    id = ''
  }
  if (id.length >= 20) return id
  if (!criar) return ''

  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  id = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  try {
    localStorage.setItem(CHAVE, id)
  } catch {
    return ''
  }
  return id
}
