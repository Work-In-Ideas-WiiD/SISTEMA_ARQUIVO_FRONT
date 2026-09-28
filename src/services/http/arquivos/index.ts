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
  funcionarios?: IArquivoVinculo[]
  agrupamentos_acesso?: IArquivoVinculo[]
  categoria?: IArquivoVinculo | null
  categoria_id?: string | null
  mes?: number | null
  ano?: number | null
  pasta_id?: string | null
  agrupamento_id?: string | null
  path: string
  tamanho_bytes?: number
  status: 'pendente' | 'assinado'
  created_at: string
  updated_at: string
  url: string
}

export async function getArquivos(
  page: number = 1,
  like: string = '',
  filters: {
    empresa_id?: string
    pasta_id?: string | null
    agrupamento_id?: string | null
    setor_id?: string | null
    funcao_id?: string | null
    todas_pastas?: boolean
    somente_livres?: boolean
    categoria_id?: string | null
    mes?: number | null
    ano?: number | null
  } = {}
): Promise<AxiosResponse<IGetArquivosRes>> {
  const res = await api.get('/arquivo', {
    params: {
      page: page,
      ...(like ? { like } : {}),
      ...(filters.empresa_id ? { empresa_id: filters.empresa_id } : {}),
      ...(filters.pasta_id ? { pasta_id: filters.pasta_id } : {}),
      ...(filters.agrupamento_id ? { agrupamento_id: filters.agrupamento_id } : {}),
      ...(filters.setor_id ? { setor_id: filters.setor_id } : {}),
      ...(filters.funcao_id ? { funcao_id: filters.funcao_id } : {}),
      ...(filters.todas_pastas ? { todas_pastas: 1 } : {}),
      ...(filters.somente_livres ? { somente_livres: 1 } : {}),
      ...(filters.categoria_id ? { categoria_id: filters.categoria_id } : {}),
      ...(filters.mes ? { mes: filters.mes } : {}),
      ...(filters.ano ? { ano: filters.ano } : {})
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

/**
 * Envia o arquivo; se já existir um com o mesmo nome no local (409), pergunta e reenvia substituindo.
 * Retorna null quando o usuário desiste da substituição.
 */
export async function postArquivoOuSubstituir(
  formData: FormData,
  confirmarSubstituicao: (nome: string) => Promise<boolean>,
  onUploadProgress?: (percent: number) => void
): Promise<{ data: IGetArquivosDataRes; substituido: boolean } | null> {
  try {
    const { data } = await postArquivo(formData, onUploadProgress)
    return { data, substituido: false }
  } catch (error: any) {
    const res = error?.response
    if (res?.status !== 409 || !res.data?.conflito) throw error
    const ok = await confirmarSubstituicao(res.data.arquivo?.descricao || String(formData.get('descricao') || ''))
    if (!ok) return null
    formData.set('substituir', '1')
    const { data } = await postArquivo(formData, onUploadProgress)
    return { data, substituido: true }
  }
}

export interface IDestinoArquivo {
  setor_id?: string | null
  funcao_id?: string | null
  agrupamento_id?: string | null
  pasta_id?: string | null
}

export async function moverArquivos(
  arquivos: string[],
  empresaId: string,
  destino: IDestinoArquivo
): Promise<AxiosResponse<{ movidos: number }>> {
  const res = await api.post('/arquivos/mover', {
    arquivos,
    empresa_id: empresaId,
    ...(destino.setor_id ? { setor_id: destino.setor_id } : {}),
    ...(destino.funcao_id ? { funcao_id: destino.funcao_id } : {}),
    ...(destino.agrupamento_id ? { agrupamento_id: destino.agrupamento_id } : {}),
    ...(destino.pasta_id ? { pasta_id: destino.pasta_id } : {})
  })
  return res
}

export type TipoPermissao = 'setores' | 'funcoes' | 'agrupamentos' | 'funcionarios'

export type IAlteracoesPermissao = Partial<
  Record<`${TipoPermissao}_adicionar` | `${TipoPermissao}_remover`, string[]>
>

export async function editarPermissoesArquivos(
  arquivos: string[],
  empresaId: string,
  alteracoes: IAlteracoesPermissao
): Promise<AxiosResponse<IGetArquivosDataRes[]>> {
  const res = await api.post('/arquivos/permissoes', {
    arquivos,
    empresa_id: empresaId,
    ...alteracoes
  })
  return res
}

export async function patchArquivoCategoriaData(
  id: string,
  data: { categoria_id: string; mes: number | null; ano: number | null }
): Promise<AxiosResponse<IGetArquivosDataRes>> {
  const res = await api.patch(`/arquivo/${id}`, data)
  return res
}

/** Link temporário do arquivo; a API registra a visualização no log de acessos. */
export async function abrirArquivo(id: string): Promise<AxiosResponse<{ url: string }>> {
  const res = await api.get(`/arquivo/${id}/abrir`)
  return res
}

export interface IArquivoLogEvento {
  id: string
  tipo: 'acesso' | 'alteracao' | 'envio'
  acao: string
  nome: string | null
  email: string | null
  detalhe: string | null
  ip: string | null
  data: string
}

export async function getArquivoLog(id: string): Promise<AxiosResponse<IArquivoLogEvento[]>> {
  const res = await api.get(`/arquivo/${id}/log`)
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
