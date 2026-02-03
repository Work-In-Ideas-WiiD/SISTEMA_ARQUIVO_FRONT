import type { AxiosResponse, AxiosError } from 'axios'
import { api } from '../api'
import type { ISetor } from '../setores'
import type { IFuncao } from '../funcoes'

export interface IFuncionario {
  id: string
  nome: string
  email: string
  cpf?: string
  contato?: string
  telefone?: string
  matricula?: string
  data_nascimento?: string
  empresa_id: string
  user_id?: string
  setores?: ISetor[]
  funcoes?: IFuncao[]
  created_at?: string
  updated_at?: string
}

export interface IGetFuncionariosRes {
  current_page: number
  data: IFuncionario[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface IPostFuncionarioModel {
  nome: string
  email: string
  cpf?: string
  contato?: string
  matricula?: string
  empresa_id?: string
  setores?: string[]
  funcoes?: string[]
}

export async function getFuncionarios(
  page: number = 1,
  like: string = '',
  empresa_id?: string,
  setor_id?: string,
  funcao_id?: string
): Promise<AxiosResponse<IGetFuncionariosRes, AxiosError>> {
  const res = await api.get('/funcionario', {
    params: {
      ...(like ? { like } : {}),
      page,
      ...(empresa_id ? { empresa_id } : {}),
      ...(setor_id ? { setor_id } : {}),
      ...(funcao_id ? { funcao_id } : {})
    }
  })
  return res
}

export async function getAllFuncionarios(
  empresa_id?: string
): Promise<AxiosResponse<IFuncionario[], AxiosError>> {
  const res = await api.get('/funcionarios/all', {
    params: empresa_id ? { empresa_id } : {}
  })
  return res
}

export async function getFuncionario(id: string): Promise<AxiosResponse<IFuncionario, AxiosError>> {
  const res = await api.get(`/funcionario/${id}`)
  return res
}

export async function postFuncionario(data: IPostFuncionarioModel): Promise<AxiosResponse<IFuncionario, AxiosError>> {
  const res = await api.post('/funcionario', data)
  return res
}

export async function patchFuncionario(data: Partial<IPostFuncionarioModel>, id: string): Promise<AxiosResponse<IFuncionario, AxiosError>> {
  const res = await api.patch(`/funcionario/${id}`, data)
  return res
}

export async function deleteFuncionario(id: string): Promise<AxiosResponse<any, AxiosError>> {
  const res = await api.delete(`/funcionario/${id}`)
  return res
}
