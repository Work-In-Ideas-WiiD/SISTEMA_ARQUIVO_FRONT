import type { AxiosResponse } from 'axios'
import { api } from '../api'

export interface IPasta {
  id: string
  nome: string
  descricao?: string | null
  empresa_id: string
  parent_id?: string | null
  agrupamento_id?: string | null
  setor_id?: string | null
  funcao_id?: string | null
  created_at?: string
  updated_at?: string
}

export interface IGetPastasRes {
  current_page: number
  data: IPasta[]
  last_page: number
  total: number
}

export interface INivelPasta {
  setor_id?: string | null
  funcao_id?: string | null
}

/** Pastas de um nível (raiz da empresa, setor, função ou agrupamento) ou subpastas de uma pasta. */
export async function getPastas(
  empresaId: string,
  parentId?: string | null,
  page: number = 1,
  agrupamentoId?: string | null,
  nivel: INivelPasta = {}
): Promise<AxiosResponse<IGetPastasRes>> {
  const res = await api.get('/pasta', {
    params: {
      empresa_id: empresaId,
      page,
      limit: 100,
      ...(parentId ? { parent_id: parentId } : {}),
      ...(agrupamentoId ? { agrupamento_id: agrupamentoId } : {}),
      ...(nivel.setor_id ? { setor_id: nivel.setor_id } : {}),
      ...(nivel.funcao_id ? { funcao_id: nivel.funcao_id } : {})
    }
  })
  return res
}

export async function getPasta(id: string): Promise<AxiosResponse<IPasta>> {
  const res = await api.get(`/pasta/${id}`)
  return res
}

export async function postPasta(data: {
  nome: string
  descricao?: string
  empresa_id: string
  parent_id?: string | null
  agrupamento_id?: string | null
  setor_id?: string | null
  funcao_id?: string | null
}): Promise<AxiosResponse<IPasta>> {
  const res = await api.post('/pasta', data)
  return res
}

export async function deletePasta(id: string): Promise<AxiosResponse<{ success: boolean }>> {
  const res = await api.delete(`/pasta/${id}`)
  return res
}

export async function moverPasta(
  id: string,
  destino: { setor_id?: string | null; funcao_id?: string | null; agrupamento_id?: string | null; pasta_id?: string | null }
): Promise<AxiosResponse<IPasta>> {
  const res = await api.post(`/pasta/${id}/mover`, {
    ...(destino.setor_id ? { setor_id: destino.setor_id } : {}),
    ...(destino.funcao_id ? { funcao_id: destino.funcao_id } : {}),
    ...(destino.agrupamento_id ? { agrupamento_id: destino.agrupamento_id } : {}),
    ...(destino.pasta_id ? { pasta_id: destino.pasta_id } : {})
  })
  return res
}

export interface IPessoaPasta {
  id: string
  nome: string
  email: string | null
  acesso: boolean
  /** Nome da pasta acima onde a pessoa foi tirada (não dá para mudar aqui). */
  bloqueado_em: string | null
}

export interface IPermissoesPasta {
  pasta: { id: string; nome: string }
  nivel: string
  nivel_tipo: 'empresa' | 'setor' | 'funcao' | 'agrupamento'
  pessoas: IPessoaPasta[]
  sempre?: { id: string; nome: string; email?: string | null; papel: string }[]
}

export async function getPermissoesPasta(id: string): Promise<AxiosResponse<IPermissoesPasta>> {
  return api.get(`/pasta/${id}/permissoes`)
}

export async function putPermissoesPasta(
  id: string,
  bloqueados: string[]
): Promise<AxiosResponse<IPermissoesPasta>> {
  return api.put(`/pasta/${id}/permissoes`, { bloqueados })
}
