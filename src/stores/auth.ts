import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { useToast } from 'vue-toastification'
import { api, setAuthToken } from '@/services/http/api'
import type { IUserProps, TUserTypes } from '@/types/auth'
import type { IPostContratoRes } from '@/types/contratos'
import { postRegistro, type IRegistroModel } from '@/services/http/conta'
import { trackSignUp, trackLogin } from '@/utils/tracking'
import { dispositivoDesteNavegador } from '@/utils/acessoDireto'

const defaultUser: IUserProps = {
  id: '',
  nome: '',
  email: '',
  email_verified_at: '',
  type: '',
  cpf: '',
  contato: '',
  cnpj: '',
  nome_empresa: '',
  clicksign_key: '',
  endereco_id: '',
  deleted_at: '',
  created_at: '',
  updated_at: '',
  endereco: {
    bairro: '',
    cep: '',
    cidade: '',
    estado: '',
    numero: '',
    rua: '',
    complemento: ''
  }
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const toast = useToast()
  
  const me = ref<IUserProps>({ ...defaultUser })
  const userRole = ref<TUserTypes>('')
  const fetching = ref(false)
  const currentContract = ref<IPostContratoRes | undefined>(undefined)

  const isAuthenticated = computed(() => me.value.id !== '')

  function setUserData(data: IUserProps) {
    me.value = data
  }

  function handleFetching(option: boolean) {
    fetching.value = option
  }

  function setNewContract(contract: IPostContratoRes) {
    currentContract.value = contract
  }

  function getNewContract(): IPostContratoRes | undefined {
    const contract = currentContract.value
    currentContract.value = undefined
    return contract
  }

  async function refreshUserData() {
    try {
      const { data } = await api.post('/auth/me')
      setUserData(data)
    } catch (error) {
      console.error(error)
    }
  }

  function gravarSessao(token: string) {
    setAuthToken(token)
    Cookies.set('ana_lucia.token', token, {
      expires: 1 / 24,
      path: '/',
      sameSite: 'strict',
      secure: window.location.protocol === 'https:'
    })
  }

  function gravarAcesso(acesso: string) {
    Cookies.set('ana_lucia.acesso', acesso, {
      expires: 30,
      path: '/',
      sameSite: 'strict',
      secure: window.location.protocol === 'https:'
    })
  }

  function destinoDepoisDoLogin(loginData: { requires_payment?: boolean; assinatura_status?: string | null }) {
    if (loginData.requires_payment && loginData.assinatura_status !== 'teste_encerrado') {
      return '/contratar'
    }
    return '/dashboard/arquivos'
  }

  async function entrarPelaConfirmacao(loginData: {
    access_token: string
    acesso?: string
    requires_payment?: boolean
    assinatura_status?: string | null
  }) {
    gravarSessao(loginData.access_token)
    if (loginData.acesso) gravarAcesso(loginData.acesso)
    try {
      const { data: user } = await api.post('/auth/me')
      userRole.value = user.type
      setUserData(user)
    } catch (error) {
      console.error(error)
    }
    trackLogin('email')
    window.location.assign(destinoDepoisDoLogin(loginData))
  }

  let restaurando: Promise<string | null> | null = null

  async function restaurarAcesso() {
    if (restaurando) return restaurando
    restaurando = restaurarAcessoAgora().finally(() => {
      restaurando = null
    })
    return restaurando
  }

  async function restaurarAcessoAgora() {
    const acesso = Cookies.get('ana_lucia.acesso')
    const dispositivo = dispositivoDesteNavegador(false)
    if (!acesso || !dispositivo) return null
    try {
      const { data } = await api.post('/auth/acesso', { acesso, dispositivo })
      gravarSessao(data.access_token)
      if (data.acesso) gravarAcesso(data.acesso)
      try {
        const { data: user } = await api.post('/auth/me')
        userRole.value = user.type
        setUserData(user)
      } catch (error) {
        console.error(error)
      }
      return destinoDepoisDoLogin(data)
    } catch (error) {
      Cookies.remove('ana_lucia.acesso')
      return null
    }
  }

  async function signIn(email: string, password: string) {
    try {
      handleFetching(true)
      const { data: loginData } = await api.post('/auth/login', { email, password })
      setAuthToken(loginData.access_token)
      
      const { data: user } = await api.post('/auth/me')
      userRole.value = user.type
      setUserData(user)
      
      Cookies.set('ana_lucia.token', loginData.access_token, { 
        expires: 1/24, // 1 hora
        path: '/',
        sameSite: 'strict',
        secure: window.location.protocol === 'https:'
      })
      
      handleFetching(false)
      trackLogin('email')
      if (loginData.precisa_confirmar_email) {
        toast.info(loginData.message || 'Confirme seu e-mail antes de entrar.')
        return 'confirmar' as const
      }
      // Teste encerrado entra no sistema e o aviso trava o uso. Outros bloqueios vão para o pagamento.
      router.push(destinoDepoisDoLogin(loginData))
    } catch (err: any) {
      console.error(err)
      handleFetching(false)
      if (err?.response?.data?.precisa_confirmar_email) {
        toast.info(err.response.data.message || 'Confirme seu e-mail antes de entrar.')
        return 'confirmar' as const
      }
      toast.error('E-mail ou senha inválidos.')
      return 'erro' as const
    }
    return 'ok' as const
  }

  async function signInCustomer(email: string, password: string, companyId: string) {
    try {
      handleFetching(true)
      const { data: loginData } = await api.post('/auth/login', { 
        email, 
        password, 
        empresa_id: companyId 
      })
      setAuthToken(loginData.access_token)
      
      const { data: user } = await api.post('/auth/me')
      userRole.value = user.type
      setUserData(user)
      
      Cookies.set('ana_lucia.token', loginData.access_token, { 
        expires: 1/24, // 1 hora
        path: '/',
        sameSite: 'strict',
        secure: window.location.protocol === 'https:'
      })
      
      handleFetching(false)
      trackLogin('portal_cliente')
      router.push(destinoDepoisDoLogin(loginData))
    } catch (err) {
      console.error(err)
      handleFetching(false)
      toast.error('E-mail ou senha inválidos.')
    }
  }

  async function signUp(payload: IRegistroModel) {
    try {
      handleFetching(true)
      const { data } = await postRegistro(payload)
      if (data.precisa_confirmar_email || !data.access_token) {
        handleFetching(false)
        trackSignUp('email')
        return data
      }
      setAuthToken(data.access_token)
      Cookies.set('ana_lucia.token', data.access_token, {
        expires: 1 / 24,
        path: '/',
        sameSite: 'strict',
        secure: window.location.protocol === 'https:'
      })

      try {
        const { data: user } = await api.post('/auth/me')
        userRole.value = user.type
        setUserData(user)
      } catch (e) {
        console.error(e)
      }

      handleFetching(false)
      trackSignUp('email')
      // Com teste grátis entra direto; sem teste (documento já usado) vai para a contratação.
      router.push(data.teste_gratis ? '/dashboard/arquivos' : '/contratar')
    } catch (err: any) {
      handleFetching(false)
      const errors = err?.response?.data?.errors
      const firstMsg = errors ? (Object.values(errors)[0] as string[])?.[0] : undefined
      toast.error(firstMsg || err?.response?.data?.message || 'Erro ao cadastrar. Verifique os dados.')
      throw err
    }
  }

  function signOut() {
    const acesso = Cookies.get('ana_lucia.acesso')
    if (acesso) {
      api.post('/auth/acesso/encerrar', { acesso }).catch(() => undefined)
    }
    Cookies.remove('ana_lucia.token')
    Cookies.remove('ana_lucia.acesso')
    me.value = { ...defaultUser }
    userRole.value = ''
    setAuthToken('')
    router.push('/')
  }

  async function checkAuth() {
    const token = Cookies.get('ana_lucia.token')
    if (token) {
      setAuthToken(token)
      try {
        const { data: user } = await api.post('/auth/me')
        setUserData(user)
        userRole.value = user.type
        return true
      } catch (error) {
        Cookies.remove('ana_lucia.token')
        return false
      }
    }
    return false
  }

  return {
    me,
    userRole,
    fetching,
    isAuthenticated,
    setUserData,
    handleFetching,
    signIn,
    signInCustomer,
    signUp,
    signOut,
    entrarPelaConfirmacao,
    restaurarAcesso,
    refreshUserData,
    checkAuth,
    setNewContract,
    getNewContract
  }
})
