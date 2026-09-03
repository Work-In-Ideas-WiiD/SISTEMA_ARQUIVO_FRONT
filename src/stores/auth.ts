import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { useToast } from 'vue-toastification'
import { api, setAuthToken } from '@/services/http/api'
import type { IUserProps, TUserTypes } from '@/types/auth'
import type { IPostContratoRes } from '@/types/contratos'
import { postRegistro, type IRegistroModel } from '@/services/http/conta'

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
        path: '/' 
      })
      
      handleFetching(false)
      // Assinatura pendente/vencida -> modo pagamento (não entra no sistema).
      if (loginData.requires_payment) {
        router.push('/contratar')
      } else {
        router.push('/dashboard/home')
      }
    } catch (err) {
      console.error(err)
      handleFetching(false)
      toast.error('E-mail ou senha inválidos.')
    }
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
        path: '/' 
      })
      
      handleFetching(false)
      if (loginData.requires_payment) {
        router.push('/contratar')
      } else {
        // Cliente: pastas ficam em Arquivos (visual do Figma)
        router.push('/dashboard/arquivos')
      }
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
      setAuthToken(data.access_token)
      Cookies.set('ana_lucia.token', data.access_token, {
        expires: 1 / 24,
        path: '/'
      })

      try {
        const { data: user } = await api.post('/auth/me')
        userRole.value = user.type
        setUserData(user)
      } catch (e) {
        console.error(e)
      }

      handleFetching(false)
      // Conta recém-criada não tem assinatura ativa -> vai para a contratação.
      router.push('/contratar')
    } catch (err: any) {
      handleFetching(false)
      const errors = err?.response?.data?.errors
      const firstMsg = errors ? (Object.values(errors)[0] as string[])?.[0] : undefined
      toast.error(firstMsg || err?.response?.data?.message || 'Erro ao cadastrar. Verifique os dados.')
      throw err
    }
  }

  function signOut() {
    Cookies.remove('ana_lucia.token')
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
    refreshUserData,
    checkAuth,
    setNewContract,
    getNewContract
  }
})
