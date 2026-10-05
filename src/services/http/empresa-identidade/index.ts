import type { AxiosResponse } from 'axios'
import { api } from '../api'

export interface IEmpresaIdentidade {
  id: string
  codigo: string | null
  nome: string
  logo_versao: string | null
  pode_editar: boolean
  /** Espaço ocupado no plano (só para os gestores da conta). */
  armazenamento?: { usado_bytes: number; limite_bytes: number | null } | null
  /** Teste grátis em andamento (só para os gestores da conta). */
  teste_gratis?: { ate: string; dias_restantes: number } | null
}

export const NOME_EMPRESA_MAX = 40

export async function getEmpresaIdentidade(): Promise<AxiosResponse<IEmpresaIdentidade | null>> {
  return api.get('/empresa-identidade')
}

export async function postEmpresaIdentidade(data: {
  nome?: string
  logo?: File | null
  remover_logo?: boolean
}): Promise<AxiosResponse<IEmpresaIdentidade>> {
  const form = new FormData()
  if (data.nome !== undefined) form.append('nome', data.nome)
  if (data.logo) form.append('logo', data.logo)
  if (data.remover_logo) form.append('remover_logo', '1')
  return api.post('/empresa-identidade', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function urlLogoEmpresa(identidade: Pick<IEmpresaIdentidade, 'id' | 'logo_versao'>): string | null {
  if (!identidade.logo_versao) return null
  const base = String(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
  return `${base}/empresa/${identidade.id}/logo?v=${identidade.logo_versao}`
}
