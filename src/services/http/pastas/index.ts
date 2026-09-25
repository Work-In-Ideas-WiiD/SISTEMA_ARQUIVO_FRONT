import type { AxiosResponse } from 'axios'
import { api } from '../api'

export interface IPasta {
  id: string
  nome: string
  descricao?: string | null
  empresa_id: string
  parent_id?: string | null
  created_at?: string
  updated_at?: string
}

export interface IGetPastasRes {
  current_page: number
  data: IPasta[]
  last_page: number
  total: number
}

export async function getPastas(
  empresaId: string,
  parentId?: string | null,
  page: number = 1
): Promise<AxiosResponse<IGetPastasRes>> {
  const res = await api.get('/pasta', {
    params: {
      empresa_id: empresaId,
      page,
      limit: 100,
      ...(parentId ? { parent_id: parentId } : {})
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
}): Promise<AxiosResponse<IPasta>> {
  const res = await api.post('/pasta', data)
  return res
}

export async function deletePasta(id: string): Promise<AxiosResponse<{ success: boolean }>> {
  const res = await api.delete(`/pasta/${id}`)
  return res
}
