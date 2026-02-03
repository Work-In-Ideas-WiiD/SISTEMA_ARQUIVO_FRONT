import type { AxiosResponse, AxiosError } from 'axios'
import { api } from '../api'

export interface IFuncao {
  id: string
  nome: string
  descricao?: string
  empresa_id: string
  created_at?: string
  updated_at?: string
}

export interface IGetFuncoesRes {
  current_page: number
  data: IFuncao[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface IPostFuncaoModel {
  nome: string
  descricao?: string
  empresa_id?: string
}

export async function getFuncoes(
  page: number = 1,
  like: string = '',
  empresa_id?: string
): Promise<AxiosResponse<IGetFuncoesRes, AxiosError>> {
  const res = await api.get('/funcao', {
    params: {
      ...(like ? { like } : {}),
      page,
      ...(empresa_id ? { empresa_id } : {})
    }
  })
  return res
}

export async function getAllFuncoes(
  empresa_id?: string
): Promise<AxiosResponse<IFuncao[], AxiosError>> {
  const res = await api.get('/funcoes/all', {
    params: empresa_id ? { empresa_id } : {}
  })
  return res
}

export async function getFuncao(id: string): Promise<AxiosResponse<IFuncao, AxiosError>> {
  const res = await api.get(`/funcao/${id}`)
  return res
}

export async function postFuncao(data: IPostFuncaoModel): Promise<AxiosResponse<IFuncao, AxiosError>> {
  const res = await api.post('/funcao', data)
  return res
}

export async function patchFuncao(data: Partial<IPostFuncaoModel>, id: string): Promise<AxiosResponse<IFuncao, AxiosError>> {
  const res = await api.patch(`/funcao/${id}`, data)
  return res
}

export async function deleteFuncao(id: string): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.delete(`/funcao/${id}`)
  return res
}
