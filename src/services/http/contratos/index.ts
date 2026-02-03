import type { AxiosResponse, AxiosError } from 'axios'
import { api } from '../api'

export interface IGetContratosRes {
  current_page: number
  data: IGetContratosDataRes[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface IGetContratosDataRes {
  id: string
  descricao: string
  path: string
  status: string
  created_at: string
  updated_at: string
  url: string
  empresa: {
    id: string
    nome: string
    email: string
    cpf: null | string
    contato: null | string
    cnpj: null | string
    nome_empresa: null | string
    created_at: string
    updated_at: string
  } | null
  assinantes: {
    tipo: 'empresa' | 'cliente'
    has_signed: boolean
    dados: {
      nome: string
      email: string
      documento: string
      contato: string
    }
  }[]
}

export async function getContratos(
  page: number = 1,
  like: string = ''
): Promise<AxiosResponse<IGetContratosRes, AxiosError>> {
  const res = await api.get('/contrato', {
    params: {
      like: like,
      page: page
    }
  })
  return res
}

export async function postContrato(formData: FormData): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.post('/contrato', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return res
}

export async function postSendToClicksign(contractId: string): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.post(`/contrato/${contractId}/send`)
  return res
}
