import type { AxiosResponse, AxiosError } from 'axios'
import { api } from '../api'

export interface IGetAssinaturasRes {
  current_page: number
  data: IGetAssinaturasData[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface IGetAssinaturasData {
  id: string
  descricao: string
  path: string
  status: string
  created_at: string
  updated_at: string
  url: string
  assinantes: {
    has_signed: boolean
    tipo: 'empresa' | 'cliente'
    dados: {
      nome: string
      email: string
      documento: string
      contato: string
    }
  }[]
}

export async function getAssinaturas(
  page: number = 1,
  like: string = ''
): Promise<AxiosResponse<IGetAssinaturasRes, AxiosError>> {
  const res = await api.get('/assinatura', {
    params: {
      like: like,
      page: page
    }
  })
  return res
}

export async function getAssinatura(id: string): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.get(`/assinatura/${id}`)
  return res
}
