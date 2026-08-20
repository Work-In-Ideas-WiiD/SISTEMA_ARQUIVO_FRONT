import type { AxiosResponse, AxiosError } from 'axios'
import { api } from '../api'

// Cadastro público (SaaS): cria a conta + o usuário administrador da conta.
export interface IRegistroModel {
  nome: string
  email: string
  password: string
  password_confirmation: string
  nome_empresa: string
  cpf?: string
  cnpj?: string
}

export interface IRegistroRes {
  access_token: string
  token_type: string
  conta_id: string
}

// Contratação de um plano (cartão tokenizado). O valor é definido pelo servidor.
export interface IContratacaoRes {
  status: 'ativa' | 'pendente' | 'negado' | 'erro'
  message: string
  assinatura: {
    id: string
    conta_id: string
    plano_id: string
    status: string
  }
  pagamento: {
    id: string
    valor_centavos: number
    status: string
  }
}

export interface IChavePublicaRes {
  public_key: string
}

export async function postRegistro(
  data: IRegistroModel
): Promise<AxiosResponse<IRegistroRes, AxiosError>> {
  const res = await api.post('/registro', data)
  return res
}

// Chave pública do PagBank para o SDK criptografar o cartão no navegador.
export async function getChavePublica(): Promise<AxiosResponse<IChavePublicaRes, AxiosError>> {
  const res = await api.get('/pagseguro/chave-publica')
  return res
}

// Envia cartão já CRIPTOGRAFADO + CVV (security_code exigido pelo PagBank na subscription).
// telefone: DDD + número (opcional se o user já tem contato).
export async function postContratacao(
  plano_id: string,
  encrypted: string,
  security_code: string,
  telefone?: string
): Promise<AxiosResponse<IContratacaoRes, AxiosError>> {
  const res = await api.post('/contratacao', {
    plano_id,
    encrypted,
    security_code,
    ...(telefone ? { telefone } : {})
  })
  return res
}
