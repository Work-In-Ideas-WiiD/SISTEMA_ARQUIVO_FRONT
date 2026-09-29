import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  getEmpresaIdentidade,
  urlLogoEmpresa,
  type IEmpresaIdentidade
} from '@/services/http/empresa-identidade'

const identidade = ref<IEmpresaIdentidade | null>(null)
let carregadoPara = ''

/** Estado compartilhado entre o menu lateral e o menu mobile. */
export function useEmpresaIdentidade() {
  const authStore = useAuthStore()

  async function carregar(forcar = false) {
    const userId = authStore.me?.id || ''
    if (!userId) {
      identidade.value = null
      carregadoPara = ''
      return
    }
    if (!forcar && carregadoPara === userId) return
    carregadoPara = userId
    try {
      const { data } = await getEmpresaIdentidade()
      identidade.value = data?.id ? data : null
    } catch {
      identidade.value = null
      carregadoPara = ''
    }
  }

  watch(() => authStore.me?.id, () => void carregar(), { immediate: true })

  const logoUrl = computed(() => (identidade.value ? urlLogoEmpresa(identidade.value) : null))

  function atualizar(nova: IEmpresaIdentidade) {
    identidade.value = nova
  }

  return { identidade, logoUrl, carregar, atualizar }
}
