// Tipos de usuário
export type TUserTypes = 'administrador' | 'cliente' | 'empresa' | ''

export interface IEndereco {
  bairro: string
  cep: string
  cidade: string
  estado: string
  numero: string
  rua: string
  complemento: string
}

export interface IUserProps {
  id: string
  nome: string
  email: string
  email_verified_at: string
  type: string
  cpf: string
  contato: string
  cnpj: string
  nome_empresa: string
  clicksign_key: string
  endereco_id: string
  deleted_at: string
  created_at: string
  updated_at: string
  endereco: IEndereco
}

export interface ILoginResponse {
  access_token: string
  token_type: string
  expires_in: number
}
