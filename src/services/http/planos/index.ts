import type { AxiosResponse, AxiosError } from 'axios'
import { api } from '../api'

export interface IPlano {
  id: string
  nome: string
  descricao?: string | null
  valor_mensal_centavos: number
  max_usuarios: number
  armazenamento_bytes: number
  ativo: boolean
  created_at?: string
  updated_at?: string
}

// Versão pública (apenas planos ativos; sem campos internos como pagseguro_plan_id)
export interface IPlanoPublico {
  id: string
  nome: string
  descricao?: string | null
  valor_mensal_centavos: number
  max_usuarios: number
  armazenamento_bytes: number
}

export interface IGetPlanosRes {
  current_page: number
  data: IPlano[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface IPostPlanoModel {
  nome: string
  descricao?: string | null
  valor_mensal_centavos: number
  max_usuarios: number
  armazenamento_bytes: number
  ativo?: boolean
}

// Admin: lista paginada (busca por nome + filtro por status)
export async function getPlanos(
  page: number = 1,
  like: string = '',
  ativo?: boolean
): Promise<AxiosResponse<IGetPlanosRes, AxiosError>> {
  const res = await api.get('/plano', {
    params: {
      ...(like ? { like } : {}),
      page,
      ...(ativo !== undefined ? { ativo } : {})
    }
  })
  return res
}

// Público: planos ativos para contratação
export async function getPlanosPublicos(): Promise<AxiosResponse<IPlanoPublico[], AxiosError>> {
  const res = await api.get('/planos/publicos')
  return res
}

export async function getPlano(id: string): Promise<AxiosResponse<IPlano, AxiosError>> {
  const res = await api.get(`/plano/${id}`)
  return res
}

export async function postPlano(data: IPostPlanoModel): Promise<AxiosResponse<IPlano, AxiosError>> {
  const res = await api.post('/plano', data)
  return res
}

export async function patchPlano(
  data: Partial<IPostPlanoModel>,
  id: string
): Promise<AxiosResponse<IPlano, AxiosError>> {
  const res = await api.patch(`/plano/${id}`, data)
  return res
}

export async function patchPlanoStatus(
  id: string,
  ativo: boolean
): Promise<AxiosResponse<IPlano, AxiosError>> {
  const res = await api.patch(`/plano/${id}/status`, { ativo })
  return res
}

export async function deletePlano(id: string): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.delete(`/plano/${id}`)
  return res
}
