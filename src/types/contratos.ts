export interface IContrato {
  id: string
  nome: string
  descricao: string
  status: string
  created_at: string
  updated_at: string
}

export interface IPostContratoRes {
  id: string
  nome: string
  descricao: string
  status: string
  created_at: string
  updated_at: string
}

export interface IGetContratosDataRes {
  data: IContrato[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
