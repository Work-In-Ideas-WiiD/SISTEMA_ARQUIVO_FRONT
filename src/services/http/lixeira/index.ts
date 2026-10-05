import type { AxiosResponse } from 'axios'
import { api } from '../api'

export type TipoItemLixeira = 'arquivo' | 'pasta'

export interface IItemLixeira {
  tipo: TipoItemLixeira
  id: string
  nome: string
  extensao: string | null
  tamanho_bytes: number
  /** Quantidade de arquivos dentro da pasta. */
  itens: number | null
  local: string
  empresa_id: string | null
  empresa_nome: string | null
  excluido_nome: string | null
  excluido_em: string | null
}

export interface IConteudoPastaLixeira {
  pasta: { id: string; nome: string }
  caminho: { id: string; nome: string }[]
  itens: IItemLixeira[]
}

export async function getLixeira(empresaId?: string | null): Promise<AxiosResponse<IItemLixeira[]>> {
  return api.get('/lixeira', { params: empresaId ? { empresa_id: empresaId } : {} })
}

export async function getPastaLixeira(id: string): Promise<AxiosResponse<IConteudoPastaLixeira>> {
  return api.get(`/lixeira/pasta/${id}`)
}

export async function abrirArquivoLixeira(id: string): Promise<AxiosResponse<{ url: string }>> {
  return api.get(`/lixeira/arquivo/${id}/abrir`)
}

export async function restaurarItemLixeira(tipo: TipoItemLixeira, id: string): Promise<AxiosResponse<{ restaurado: boolean }>> {
  return api.post('/lixeira/restaurar', { tipo, id })
}

export async function excluirItemLixeira(tipo: TipoItemLixeira, id: string): Promise<AxiosResponse<{ excluido: boolean }>> {
  return api.post('/lixeira/excluir', { tipo, id })
}

export async function esvaziarLixeira(empresaId?: string | null): Promise<AxiosResponse<{ itens: number; bytes: number }>> {
  return api.post('/lixeira/esvaziar', empresaId ? { empresa_id: empresaId } : {})
}
