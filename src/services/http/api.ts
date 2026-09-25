import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

function setAuthToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

api.interceptors.response.use(
  response => response,
  error => {
    // Só limpa sessão em 401 de autenticação real (evita derrubar token
    // por corrida de request sem header / tela ainda carregando o perfil).
    const status = error.response?.status
    const url = String(error.config?.url || '')
    const hadAuthHeader = Boolean(error.config?.headers?.Authorization)
    if (status === 401 && hadAuthHeader && !url.includes('/auth/login')) {
      Cookies.remove('ana_lucia.token')
    }

    // Assinatura inativa/pendente (gate do backend) -> leva ao modo de pagamento.
    if (
      status === 402 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith('/contratar')
    ) {
      window.location.assign('/contratar')
    }

    return Promise.reject(error)
  }
)

export { api, setAuthToken }
