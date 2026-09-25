<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { getEmpresas, type IGetEmpresasDataRes } from '@/services/http/empresas'
import { getApiErrorMessage } from '@/utils/apiError'
import iconBuilding from '@/assets/imgs/arquivos/icon-empresa-building.svg'

interface EmpresaTile {
  id: string
  label: string
}

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(true)
const empresas = ref<EmpresaTile[]>([])

function labelEmpresa(item: IGetEmpresasDataRes): string {
  return (item.nome_empresa || item.nome || 'Empresa').trim()
}

async function collectPages<T>(
  fetchPage: (page: number) => Promise<{ data: T[]; last_page: number }>
): Promise<T[]> {
  const collected: T[] = []
  let page = 1
  let lastPage = 1
  do {
    const data = await fetchPage(page)
    collected.push(...data.data)
    lastPage = data.last_page || 1
    page += 1
  } while (page <= lastPage)
  return collected
}

async function loadEmpresas() {
  loading.value = true
  try {
    const role = authStore.userRole

    if (role === 'administrador') {
      const rows = await collectPages(async (page) => {
        const { data } = await getEmpresas(page, '')
        return { data: data.data, last_page: data.last_page }
      })
      empresas.value = rows.map((item) => ({ id: item.id, label: labelEmpresa(item) }))
      return
    }

    // CLIENTE-ADMIN: a "empresa" da conta é a própria (entrada do explorer).
    if (role === 'empresa') {
      const me = authStore.me
      if (me?.id) {
        empresas.value = [
          {
            id: me.id,
            label: (me.nome_empresa || me.nome || 'Minha empresa').trim()
          }
        ]
      } else {
        empresas.value = []
      }
      return
    }

    empresas.value = []
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Não foi possível carregar as empresas.'))
    empresas.value = []
  } finally {
    loading.value = false
  }
}

function openEmpresa(empresa: EmpresaTile) {
  router.push({ name: 'arquivos-empresa', params: { empresaId: empresa.id } })
}

onMounted(loadEmpresas)
</script>

<template>
  <section class="empresas-explorer">
    <div class="empresas-explorer__heading">
      <h2 class="empresas-explorer__title dashboard_title">EMPRESAS</h2>
    </div>

    <div class="empresas-explorer__panel">
      <p v-if="loading" class="empresas-explorer__status">Carregando…</p>
      <p v-else-if="!empresas.length" class="empresas-explorer__status">
        Nenhuma empresa cadastrada.
      </p>
      <ul v-else class="empresas-explorer__grid" role="list">
        <li v-for="empresa in empresas" :key="empresa.id">
          <button
            type="button"
            class="empresas-explorer__tile"
            :title="empresa.label"
            @click="openEmpresa(empresa)"
          >
            <span class="empresas-explorer__box">
              <img
                class="empresas-explorer__icon"
                :src="iconBuilding"
                width="40"
                height="46"
                alt=""
              />
            </span>
            <span class="empresas-explorer__name">{{ empresa.label }}</span>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.empresas-explorer {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.empresas-explorer__heading {
  margin-bottom: 18px;
}

.empresas-explorer__title {
  margin: 0;
}

.empresas-explorer__panel {
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.18));
  border-radius: var(--night-radius, 20px);
  min-height: min(62vh, 520px);
  padding: 30px 38px 36px;
  box-sizing: border-box;
}

.empresas-explorer__status {
  margin: 0;
  color: #f7f7f7;
  opacity: 0.7;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 0.95rem;
}

.empresas-explorer__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, 110px);
  gap: 16px;
  align-content: start;
}

.empresas-explorer__tile {
  width: 110px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: inherit;
  font: inherit;
  text-align: left;

  &:hover .empresas-explorer__box,
  &:focus-visible .empresas-explorer__box {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(176, 141, 87, 0.3);
  }

  &:focus-visible {
    outline: none;
  }
}

.empresas-explorer__box {
  width: 110px;
  height: 94px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.empresas-explorer__icon {
  display: block;
  flex-shrink: 0;
}

.empresas-explorer__name {
  width: 100%;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.3;
  color: #ffffff;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .empresas-explorer__panel {
    padding: 20px 16px 28px;
    min-height: 40vh;
  }

  .empresas-explorer__grid {
    gap: 14px;
  }
}
</style>
