import type { AxiosResponse, AxiosError } from 'axios'
import { api } from '../api'

export interface IGetClientesRes {
  current_page: number
  data: IGetClientesDataRes[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface IGetClientesDataRes {
  id: string
  nome: string
  email: string
  email_verified_at: null | string
  type: string
  cpf: null | string
  contato: null | string
  cnpj: null | string
  nome_empresa: null | string
  clicksign_key: null | string
  endereco_id: null | string
  endereco: null | string
}

export interface IPostClienteModel {
  type?: 'cliente'
  email?: string
  cpf?: string | null
  nome: string
  contato: string
  cnpj?: null | string
  nome_empresa?: null | string
  endereco?: {
    cep: string
    rua: string
    numero?: string
    bairro: string
    cidade: string
    estado: string
    complemento?: string
  }
}

export async function getClientes(
  page: number = 1,
  like: string = ''
): Promise<AxiosResponse<IGetClientesRes, AxiosError>> {
  const res = await api.get('/cliente', {
    params: {
      like: like,
      page: page
    }
  })
  return res
}

export async function getCliente(id: string): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.get(`/cliente/${id}`)
  return res
}

export async function postCliente(data: IPostClienteModel): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.post('/cliente', { ...data, type: 'cliente' })
  return res
}

export async function patchCliente(data: IPostClienteModel, id: string): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.patch(`/cliente/${id}`, data)
  return res
}

export async function deleteCliente(id: string): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.delete(`/cliente/${id}`)
  return res
}
