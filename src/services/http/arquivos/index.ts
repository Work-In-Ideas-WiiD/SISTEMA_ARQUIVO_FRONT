import type { AxiosResponse } from 'axios'
import { api } from '../api'

export interface IArquivoVinculo {
  id: string
  nome: string
}

export interface IGetArquivosRes {
  current_page: number
  data: IGetArquivosDataRes[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface IGetArquivosDataRes {
  id: string
  descricao: string
  empresas?: {
    empresa: {
      id: string
      nome: string
      email: string
      contato: string
      cnpj: string
      nome_empresa: string
      created_at: string
      updated_at: string
    }
  }[]
  setores?: IArquivoVinculo[]
  funcoes?: IArquivoVinculo[]
  path: string
  tamanho_bytes?: number
  status: 'pendente' | 'assinado'
  created_at: string
  updated_at: string
  url: string
}

export async function getArquivos(
  page: number = 1,
  like: string = ''
): Promise<AxiosResponse<IGetArquivosRes>> {
  const res = await api.get('/arquivo', {
    params: {
      like: like,
      page: page
    }
  })
  return res
}

export async function postArquivo(
  formData: FormData,
  onUploadProgress?: (percent: number) => void
): Promise<AxiosResponse<IGetArquivosDataRes>> {
  const res = await api.post('/arquivo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (event) => {
      if (!onUploadProgress || !event.total) return
      onUploadProgress(Math.round((event.loaded * 100) / event.total))
    }
  })
  return res
}

export async function deleteArquivo(id: string): Promise<AxiosResponse<any>> {
  const res = await api.delete(`/arquivo/${id}`)
  return res
}

export interface ICompartilhamentoRes {
  id: string
  email: string
  status: string
  link: string
  created_at?: string
  expires_at?: string | null
  arquivo?: { id: string; nome?: string | null }
}

export async function postCompartilharArquivo(
  arquivoId: string,
  email: string,
  expiresAt?: string
): Promise<AxiosResponse<ICompartilhamentoRes>> {
  const res = await api.post(`/arquivo/${arquivoId}/compartilhar`, {
    email,
    ...(expiresAt ? { expires_at: expiresAt } : {})
  })
  return res
}

export async function getCompartilhamentosArquivo(
  arquivoId: string
): Promise<AxiosResponse<ICompartilhamentoRes[]>> {
  const res = await api.get(`/arquivo/${arquivoId}/compartilhamentos`)
  return res
}

export async function revogarCompartilhamento(id: string): Promise<AxiosResponse<any>> {
  const res = await api.post(`/compartilhamentos/${id}/revogar`)
  return res
}

export interface ICompartilhamentoAcessoRes {
  id: string
  email: string
  status: string
  motivo_falha?: string | null
  ip?: string | null
  user_agent?: string | null
  tentado_em: string
  autorizado_em?: string | null
  created_at?: string
}

export async function getCompartilhamentoAcessos(
  id: string
): Promise<AxiosResponse<ICompartilhamentoAcessoRes[]>> {
  const res = await api.get(`/compartilhamentos/${id}/acessos`)
  return res
}

export async function getCompartilhamentoPublico(publicToken: string): Promise<AxiosResponse<{
  status: string
  arquivo_nome: string
  email_hint: string
  requires_token: boolean
}>> {
  const res = await api.get(`/compartilhar/${publicToken}`)
  return res
}

export async function solicitarTokenCompartilhamento(publicToken: string): Promise<AxiosResponse<{
  message: string
  email_hint: string
  expires_in_minutes: number
}>> {
  const res = await api.post(`/compartilhar/${publicToken}/solicitar-token`)
  return res
}

export async function validarTokenCompartilhamento(
  publicToken: string,
  token: string
): Promise<AxiosResponse<{
  message: string
  arquivo: { id: string; nome: string; url: string; expires_in_minutes: number }
}>> {
  const res = await api.post(`/compartilhar/${publicToken}/validar-token`, { token })
  return res
}
