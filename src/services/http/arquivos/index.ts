import type { AxiosResponse, AxiosError } from 'axios'
import { api } from '../api'

export interface IGetArquivosRes {
  current_page: number
  data: IGetArquivosDataRes[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface IGetArquivosDataRes {
  id: string
  descricao: string
  empresas?: {
    empresa: {
      id: string
      nome: string
      email: string
      contato: string
      cnpj: string
      nome_empresa: string
      created_at: string
      updated_at: string
    }
  }[]
  path: string
  status: 'pendente' | 'assinado'
  created_at: string
  updated_at: string
  url: string
}

export async function getArquivos(
  page: number = 1,
  like: string = ''
): Promise<AxiosResponse<IGetArquivosRes, AxiosError>> {
  const res = await api.get('/arquivo', {
    params: {
      like: like,
      page: page
    }
  })
  return res
}

export async function postArquivo(formData: FormData): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.post('/arquivo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return res
}

export async function deleteArquivo(id: string): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.delete(`/arquivo/${id}`)
  return res
}
