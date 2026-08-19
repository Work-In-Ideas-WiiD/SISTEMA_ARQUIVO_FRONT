import type { AxiosResponse, AxiosError } from 'axios'
import { api } from '../api'

export type TAssinaturaSaasStatus =
  | 'ativa'
  | 'pendente'
  | 'suspensa'
  | 'cancelada'
  | 'inadimplente'
  | 'expirada'
  | 'pendente_acao'

export interface IAssinaturaSaasPlano {
  id: string
  nome: string
  valor_mensal_centavos?: number
  ativo?: boolean
  descricao?: string | null
  max_usuarios?: number
  armazenamento_bytes?: number
  pagseguro_plan_id?: string | null
}

export interface IAssinaturaSaasConta {
  id: string
  nome: string
  status: string
  usuarios?: Array<{
    id: string
    nome: string
    email: string
    cpf?: string | null
    cnpj?: string | null
    type?: string | number
  }>
}

export interface IAssinaturaSaasPagamento {
  id: string
  gateway_charge_id?: string | null
  gateway_invoice_id?: string | null
  valor_centavos: number
  status: string
  pago_em?: string | null
  created_at?: string
}

export interface IAssinaturaSaasHistorico {
  id: string
  status_de?: string | null
  status_para: string
  origem: string
  meta?: Record<string, unknown> | null
  created_at?: string
}

export interface IAssinaturaSaas {
  id: string
  conta_id: string
  plano_id: string
  status: TAssinaturaSaasStatus | string
  gateway_subscription_id?: string | null
  gateway_customer_id?: string | null
  gateway_card_id?: string | null
  inicio_em?: string | null
  proxima_cobranca_em?: string | null
  created_at?: string
  updated_at?: string
  plano?: IAssinaturaSaasPlano | null
  conta?: IAssinaturaSaasConta | null
  pagamentos?: IAssinaturaSaasPagamento[]
  historico_status?: IAssinaturaSaasHistorico[]
}

export interface IGetAssinaturasSaasRes {
  current_page: number
  data: IAssinaturaSaas[]
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface IAssinaturasSaasFilters {
  like?: string
  status?: string
  plano_id?: string
  conta_id?: string
  criado_de?: string
  criado_ate?: string
  proxima_cobranca_de?: string
  proxima_cobranca_ate?: string
}

export async function getAssinaturasSaas(
  page: number = 1,
  filters: IAssinaturasSaasFilters = {}
): Promise<AxiosResponse<IGetAssinaturasSaasRes, AxiosError>> {
  const params: Record<string, string | number> = { page }

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      params[key] = value
    }
  })

  return api.get('/saas/assinaturas', { params })
}

export async function getAssinaturaSaas(
  id: string
): Promise<AxiosResponse<IAssinaturaSaas, AxiosError>> {
  return api.get(`/saas/assinaturas/${id}`)
}

export async function cancelarAssinaturaSaas(
  id: string
): Promise<AxiosResponse<IAssinaturaSaas, AxiosError>> {
  return api.post(`/saas/assinaturas/${id}/cancelar`)
}

export async function suspenderAssinaturaSaas(
  id: string
): Promise<AxiosResponse<IAssinaturaSaas, AxiosError>> {
  return api.post(`/saas/assinaturas/${id}/suspender`)
}

export async function reativarAssinaturaSaas(
  id: string
): Promise<AxiosResponse<IAssinaturaSaas, AxiosError>> {
  return api.post(`/saas/assinaturas/${id}/reativar`)
}

export function labelStatusAssinatura(status?: string | null): string {
  const map: Record<string, string> = {
    ativa: 'Ativa',
    pendente: 'Pendente',
    suspensa: 'Suspensa',
    cancelada: 'Cancelada',
    inadimplente: 'Inadimplente',
    expirada: 'Expirada',
    pendente_acao: 'Pendente ação'
  }
  return status ? map[status] || status : '—'
}
