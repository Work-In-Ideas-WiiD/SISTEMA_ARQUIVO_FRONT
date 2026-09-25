import type { AxiosResponse } from 'axios'
import { api } from '../api'

export interface ICategoriaArquivo {
  id: string
  nome: string
  conta_id?: string | null
  created_at?: string
  updated_at?: string
}

export interface IGetCategoriasArquivoRes {
  current_page: number
  data: ICategoriaArquivo[]
  last_page: number
  total: number
}

export async function getCategoriasArquivo(
  page: number = 1,
  like: string = '',
  empresaId?: string
): Promise<AxiosResponse<IGetCategoriasArquivoRes>> {
  const res = await api.get('/categoria-arquivo', {
    params: {
      page,
      ...(like ? { like } : {}),
      ...(empresaId ? { empresa_id: empresaId } : {})
    }
  })
  return res
}

export async function getAllCategoriasArquivo(
  empresaId?: string
): Promise<AxiosResponse<ICategoriaArquivo[]>> {
  const res = await api.get('/categorias-arquivo/all', {
    params: {
      ...(empresaId ? { empresa_id: empresaId } : {})
    }
  })
  return res
}

export async function postCategoriaArquivo(data: {
  nome: string
  empresa_id?: string
}): Promise<AxiosResponse<ICategoriaArquivo>> {
  const res = await api.post('/categoria-arquivo', data)
  return res
}

export async function putCategoriaArquivo(
  id: string,
  data: { nome: string }
): Promise<AxiosResponse<ICategoriaArquivo>> {
  const res = await api.put(`/categoria-arquivo/${id}`, data)
  return res
}

export async function deleteCategoriaArquivo(
  id: string
): Promise<AxiosResponse<{ success: boolean }>> {
  const res = await api.delete(`/categoria-arquivo/${id}`)
  return res
}
