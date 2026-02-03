import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { useToast } from 'vue-toastification'
import { api, setAuthToken } from '@/services/http/api'
import type { IUserProps, TUserTypes } from '@/types/auth'
import type { IPostContratoRes } from '@/types/contratos'

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
      router.push('/dashboard/home')
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
      router.push('/dashboard/home')
    } catch (err) {
      console.error(err)
      handleFetching(false)
      toast.error('E-mail ou senha inválidos.')
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
    signOut,
    refreshUserData,
    checkAuth,
    setNewContract,
    getNewContract
  }
})
