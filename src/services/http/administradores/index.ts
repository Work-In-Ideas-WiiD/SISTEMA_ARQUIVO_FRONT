import type { AxiosResponse, AxiosError } from 'axios'
import { api } from '../api'

export interface IGetAdministradoresRes {
  current_page: number
  data: IGetAdministradoresDataRes[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface IGetAdministradoresDataRes {
  id: string
  cnpj: null | string
  contato: null | string
  cpf: null | string
  email: string
  nome: string
  nome_empresa: string | null
}

export interface IPostAdministradorModel {
  type?: 'administrador'
  email?: string
  cpf: string
  nome: string
  contato: string
}

export interface IPostAdministradorRes {
  id: string
  nome: string
  email: string
  cpf: string
  contato: null | string
  cnpj: null | string
  nome_empresa: null | string
}

export async function getAdministradores(
  page: number = 1,
  like: string = ''
): Promise<AxiosResponse<IGetAdministradoresRes, AxiosError>> {
  const res = await api.get('/user', {
    params: {
      type: 'administrador',
      like: like,
      page: page
    }
  })
  return res
}

export async function getAdministrador(
  id: string
): Promise<AxiosResponse<IGetAdministradoresDataRes, AxiosError>> {
  const res = await api.get(`/user/${id}`)
  return res
}

export async function postAdministrador(
  model: IPostAdministradorModel
): Promise<AxiosResponse<IPostAdministradorRes, AxiosError>> {
  const res = await api.post('/user', { ...model, type: 'administrador' })
  return res
}

export async function patchAdministrador(
  model: IPostAdministradorModel,
  id: string
): Promise<AxiosResponse<IPostAdministradorRes, AxiosError>> {
  const res = await api.patch(`/user/${id}`, model)
  return res
}

export async function postAddEmpresaToArquivo(
  empresaIds: string[],
  arquivoId: string
): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.post('/add/empresa/arquivo', {
    empresas: empresaIds,
    arquivo_id: arquivoId
  })
  return res
}

export async function postAddEmpresaToContrato(
  empresaId: string,
  contratoId: string
): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.post('/add/empresa/contrato', {
    empresa_id: empresaId,
    contrato_id: contratoId
  })
  return res
}
