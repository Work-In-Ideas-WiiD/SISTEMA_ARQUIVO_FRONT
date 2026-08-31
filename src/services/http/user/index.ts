import type { AxiosResponse, AxiosError } from 'axios'
import { api } from '../api'

export interface IPatchUserModel {
  nome?: string
  cpf?: string
  cnpj?: string
  contato?: string
  nome_empresa?: string
}

export async function patchUser(
  model: IPatchUserModel,
  id: string
): Promise<AxiosResponse<unknown, AxiosError>> {
  const res = await api.patch(`/user/${id}`, model)
  return res
}
