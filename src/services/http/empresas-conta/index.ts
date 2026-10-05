import type { AxiosResponse } from 'axios'
import { api } from '../api'

export interface IEmpresaConta {
  id: string
  codigo: string | null
  nome: string
  cnpj: string | null
  principal: boolean
  logo_versao: number | null
}

export interface IEmpresaContaPayload {
  nome: string
  cnpj?: string | null
}

export async function getEmpresasConta(like = ''): Promise<AxiosResponse<IEmpresaConta[]>> {
  return api.get('/empresas-conta', { params: like ? { like } : {} })
}

export async function postEmpresaConta(data: IEmpresaContaPayload): Promise<AxiosResponse<IEmpresaConta>> {
  return api.post('/empresas-conta', data)
}

export async function putEmpresaConta(id: string, data: IEmpresaContaPayload): Promise<AxiosResponse<IEmpresaConta>> {
  return api.put(`/empresas-conta/${id}`, data)
}

export async function deleteEmpresaConta(id: string) {
  return api.delete(`/empresas-conta/${id}`)
}
