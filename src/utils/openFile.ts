import { abrirArquivo } from '@/services/http/arquivos'

export function openFile(url: string): void {
  window.open(url)
}

/**
 * Abre um arquivo do sistema pela API (que registra a visualização no log de acessos).
 * A aba é aberta antes da requisição para o navegador não bloquear como pop-up.
 */
export async function openArquivoRegistrado(arquivo: { id: string; url?: string | null }): Promise<void> {
  const aba = window.open('', '_blank')
  try {
    const { data } = await abrirArquivo(arquivo.id)
    if (aba) aba.location.href = data.url
    else window.open(data.url)
  } catch {
    if (arquivo.url && aba) aba.location.href = arquivo.url
    else aba?.close()
  }
}
