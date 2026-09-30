import type { AxiosResponse } from 'axios'
import { api } from '../api'

export interface ILogArquivo {
  id: string
  data: string
  acao: string
  alvo: 'arquivo' | 'pasta' | 'lixeira'
  alvo_nome: string | null
  empresa_nome: string | null
  nome: string | null
  email: string | null
  detalhe: string | null
  ip: string | null
}

export interface ILogsArquivoRes {
  current_page: number
  last_page: number
  total: number
  data: ILogArquivo[]
}

export interface IFiltroLogsArquivo {
  like?: string
  acao?: string
  de?: string
  ate?: string
}

export const ACOES_LOG_ARQUIVO: { value: string; label: string }[] = [
  { value: 'visualizou', label: 'Abriu' },
  { value: 'link_externo', label: 'Abriu por link' },
  { value: 'enviou', label: 'Enviou' },
  { value: 'editou', label: 'Editou' },
  { value: 'substituiu', label: 'Substituiu' },
  { value: 'moveu', label: 'Moveu' },
  { value: 'permissoes', label: 'Alterou permissões' },
  { value: 'excluiu', label: 'Enviou para a lixeira' },
  { value: 'restaurou', label: 'Restaurou' },
  { value: 'excluiu_definitivo', label: 'Excluiu definitivamente' },
  { value: 'esvaziou_lixeira', label: 'Esvaziou a lixeira' }
]

export async function getLogsArquivo(
  page: number,
  filtro: IFiltroLogsArquivo
): Promise<AxiosResponse<ILogsArquivoRes>> {
  const params: Record<string, string | number> = { page, limit: 30 }
  for (const [k, v] of Object.entries(filtro)) if (v) params[k] = v
  return api.get('/relatorios/logs-arquivo', { params })
}
