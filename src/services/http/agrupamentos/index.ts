import type { AxiosResponse, AxiosError } from 'axios'
import { api } from '../api'
import type { ISetor } from '../setores'
import type { IFuncionario } from '../funcionarios'

export interface IAgrupamento {
  id: string
  nome: string
  descricao?: string
  tipo: 'individual' | 'setor'
  empresa_id: string
  funcionarios?: IFuncionario[]
  setores?: ISetor[]
  funcionarios_count?: number
  setores_count?: number
  todos_funcionarios?: IFuncionario[]
  created_at?: string
  updated_at?: string
}

export interface IGetAgrupamentosRes {
  current_page: number
  data: IAgrupamento[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface IPostAgrupamentoModel {
  nome: string
  descricao?: string
  tipo: 'individual' | 'setor'
  empresa_id?: string
  funcionarios?: string[]
  setores?: string[]
}

export async function getAgrupamentos(
  page: number = 1,
  like: string = '',
  empresa_id?: string,
  tipo?: string
): Promise<AxiosResponse<IGetAgrupamentosRes, AxiosError>> {
  const res = await api.get('/agrupamento', {
    params: {
      ...(like ? { like } : {}),
      page,
      ...(empresa_id ? { empresa_id } : {}),
      ...(tipo ? { tipo } : {})
    }
  })
  return res
}

export async function getAllAgrupamentos(
  empresa_id?: string
): Promise<AxiosResponse<IAgrupamento[], AxiosError>> {
  const res = await api.get('/agrupamentos/all', {
    params: empresa_id ? { empresa_id } : {}
  })
  return res
}

export async function getAgrupamento(id: string): Promise<AxiosResponse<IAgrupamento, AxiosError>> {
  const res = await api.get(`/agrupamento/${id}`)
  return res
}

export async function getAgrupamentoFuncionarios(id: string): Promise<AxiosResponse<IFuncionario[], AxiosError>> {
  const res = await api.get(`/agrupamento/${id}/funcionarios`)
  return res
}

export async function postAgrupamento(data: IPostAgrupamentoModel): Promise<AxiosResponse<IAgrupamento, AxiosError>> {
  const res = await api.post('/agrupamento', data)
  return res
}

export async function patchAgrupamento(data: Partial<IPostAgrupamentoModel>, id: string): Promise<AxiosResponse<IAgrupamento, AxiosError>> {
  const res = await api.patch(`/agrupamento/${id}`, data)
  return res
}

export async function deleteAgrupamento(id: string): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.delete(`/agrupamento/${id}`)
  return res
}
