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

export interface IEmpresaContaDetalhe extends IEmpresaConta {
  nome_pessoa: string
  nome_empresa: string
  cpf: string | null
  email: string
  contato: string | null
  endereco: {
    cep?: string | null
    rua?: string | null
    numero?: string | number | null
    bairro?: string | null
    complemento?: string | null
    cidade?: string | null
    estado?: string | null
  } | null
}

export interface IEmpresaContaDetalhePayload {
  nome?: string
  nome_empresa: string
  cpf?: string | null
  cnpj?: string | null
  email?: string
  contato?: string | null
  endereco?: IEmpresaContaDetalhe['endereco']
}

export async function getEmpresaConta(id: string): Promise<AxiosResponse<IEmpresaContaDetalhe>> {
  return api.get(`/empresas-conta/${id}`)
}

export async function putEmpresaContaDetalhe(
  id: string,
  data: IEmpresaContaDetalhePayload
): Promise<AxiosResponse<IEmpresaContaDetalhe>> {
  return api.put(`/empresas-conta/${id}`, data)
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
