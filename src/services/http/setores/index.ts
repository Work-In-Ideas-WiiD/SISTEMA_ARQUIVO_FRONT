import type { AxiosResponse, AxiosError } from 'axios'
import { api } from '../api'

export interface ISetor {
  id: string
  nome: string
  descricao?: string
  empresa_id: string
  created_at?: string
  updated_at?: string
}

export interface IGetSetoresRes {
  current_page: number
  data: ISetor[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface IPostSetorModel {
  nome: string
  descricao?: string
  empresa_id?: string
}

export async function getSetores(
  page: number = 1,
  like: string = '',
  empresa_id?: string
): Promise<AxiosResponse<IGetSetoresRes, AxiosError>> {
  const res = await api.get('/setor', {
    params: {
      ...(like ? { like } : {}),
      page,
      ...(empresa_id ? { empresa_id } : {})
    }
  })
  return res
}

export async function getAllSetores(
  empresa_id?: string
): Promise<AxiosResponse<ISetor[], AxiosError>> {
  const res = await api.get('/setores/all', {
    params: empresa_id ? { empresa_id } : {}
  })
  return res
}

export async function getSetor(id: string): Promise<AxiosResponse<ISetor, AxiosError>> {
  const res = await api.get(`/setor/${id}`)
  return res
}

export async function postSetor(data: IPostSetorModel): Promise<AxiosResponse<ISetor, AxiosError>> {
  const res = await api.post('/setor', data)
  return res
}

export async function patchSetor(data: Partial<IPostSetorModel>, id: string): Promise<AxiosResponse<ISetor, AxiosError>> {
  const res = await api.patch(`/setor/${id}`, data)
  return res
}

export async function deleteSetor(id: string): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.delete(`/setor/${id}`)
  return res
}
