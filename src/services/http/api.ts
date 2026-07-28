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
    if (error.response?.status === 401) {
      Cookies.remove('ana_lucia.token')
    }

    // Assinatura inativa/pendente (gate do backend) -> leva ao modo de pagamento.
    if (
      error.response?.status === 402 &&
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith('/contratar')
    ) {
      window.location.assign('/contratar')
    }

    return Promise.reject(error)
  }
)

export { api, setAuthToken }
