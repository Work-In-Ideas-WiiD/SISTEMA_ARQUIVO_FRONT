import type { AxiosResponse } from 'axios'
import { api } from '../api'

export interface IGestor {
  id: string
  nome: string
  email: string
  cpf: string | null
  contato: string | null
}

export interface IGestoresRes {
  data: IGestor[]
  pode_adicionar: boolean
  motivo: 'teste' | 'limite' | null
  limite: number | null
  usados: number
}

export interface IGestorPayload {
  nome: string
  email: string
  cpf: string
  contato: string
  password?: string
  password_confirmation?: string
}

export async function getGestores(): Promise<AxiosResponse<IGestoresRes>> {
  return api.get('/gestores')
}

export async function postGestor(data: IGestorPayload) {
  return api.post('/gestores', data)
}

export async function putGestor(id: string, data: IGestorPayload) {
  return api.put(`/gestores/${id}`, data)
}

export async function deleteGestor(id: string) {
  return api.delete(`/gestores/${id}`)
}
