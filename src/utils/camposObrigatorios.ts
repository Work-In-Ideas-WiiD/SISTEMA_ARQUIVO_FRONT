/**
 * Mensagem com os campos obrigatórios que faltam, ex.: "Preencha: Nome, E-mail e Contato."
 * Recebe { 'Nome': valor, ... } e devolve null quando está tudo preenchido.
 */
export function camposFaltando(campos: Record<string, unknown>): string | null {
  const faltando = Object.entries(campos)
    .filter(([, valor]) => !String(valor ?? '').trim())
    .map(([rotulo]) => rotulo)

  if (!faltando.length) return null
  if (faltando.length === 1) return `Preencha o campo ${faltando[0]}.`

  const ultimo = faltando.pop()
  return `Preencha os campos: ${faltando.join(', ')} e ${ultimo}.`
}
