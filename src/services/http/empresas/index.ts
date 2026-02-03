import type { AxiosResponse, AxiosError } from 'axios'
import { api } from '../api'

export interface IGetEmpresasRes {
  current_page: number
  data: IGetEmpresasDataRes[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface IGetEmpresasDataRes {
  id: string
  nome: string
  email: string
  cpf: string | null
  contato: string | null
  cnpj: string | null
  nome_empresa: string | null
  endereco?: {
    rua: string
    numero: string | null
    bairro: string
    cidade: string
    estado: string
    cep: string
    complemento: string | null
  } | null
}

export interface IPostEmpresaModel {
  type: 'cliente' | 'empresa' | 'administrador'
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

export async function getEmpresas(
  page: number = 1,
  like: string = ''
): Promise<AxiosResponse<IGetEmpresasRes, AxiosError>> {
  const res = await api.get('/user', {
    params: {
      type: 'empresa',
      like: like,
      page: page
    }
  })
  return res
}

export async function getEmpresa(id: string): Promise<AxiosResponse<IGetEmpresasDataRes, AxiosError>> {
  const res = await api.get(`/user/${id}`)
  return res
}

export async function postEmpresa(data: IPostEmpresaModel): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.post('/user', { ...data, type: 'empresa' })
  return res
}

export async function patchEmpresa(data: IPostEmpresaModel, id: string): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.patch(`/user/${id}`, data)
  return res
}

export async function deleteEmpresa(id: string): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.delete(`/user/${id}`)
  return res
}
