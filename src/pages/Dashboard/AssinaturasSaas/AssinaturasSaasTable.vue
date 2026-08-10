<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import SearchBar from '@/components/inputs/SearchBar/SearchBar.vue'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import {
  getAssinaturasSaas,
  labelStatusAssinatura,
  type IAssinaturaSaas
} from '@/services/http/assinaturasSaas'
import { getPlanos, type IPlano } from '@/services/http/planos'
import { getApiErrorMessage } from '@/utils/apiError'

const router = useRouter()
const toast = useToast()

const fetching = ref(false)
const page = ref(1)
const pages = ref(0)
const itens = ref<IAssinaturaSaas[]>([])
const noContent = ref(false)
const search = ref('')
const status = ref('')
const planoId = ref('')
const criadoDe = ref('')
const criadoAte = ref('')
const proximaDe = ref('')
const proximaAte = ref('')
const planos = ref<IPlano[]>([])

const statusOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'ativa', label: 'Ativa' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'inadimplente', label: 'Inadimplente' },
  { value: 'suspensa', label: 'Suspensa' },
  { value: 'cancelada', label: 'Cancelada' },
  { value: 'expirada', label: 'Expirada' },
  { value: 'pendente_acao', label: 'Pendente ação' }
]

onMounted(async () => {
  await loadPlanos()
  getData(page.value)
})

async function loadPlanos() {
  try {
    const { data } = await getPlanos(1, '')
    planos.value = data.data || []
  } catch (error) {
    console.error(error)
  }
}

function filters() {
  return {
    like: search.value,
    status: status.value,
    plano_id: planoId.value,
    criado_de: criadoDe.value,
    criado_ate: criadoAte.value,
    proxima_cobranca_de: proximaDe.value,
    proxima_cobranca_ate: proximaAte.value
  }
}

async function getData(pageParam: number) {
  try {
    fetching.value = true
    const { data } = await getAssinaturasSaas(pageParam, filters())
    pages.value = data.last_page
    itens.value = data.data
    noContent.value = data.data.length === 0
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Erro ao carregar assinaturas'))
  } finally {
    fetching.value = false
  }
}

function searchData() {
  page.value = 1
  getData(1)
}

function limparFiltros() {
  search.value = ''
  status.value = ''
  planoId.value = ''
  criadoDe.value = ''
  criadoAte.value = ''
  proximaDe.value = ''
  proximaAte.value = ''
  searchData()
}

function onPageChange(newPage: number) {
  page.value = newPage
  getData(newPage)
}

function goToVisualizar(id: string) {
  router.push(`/dashboard/assinaturas-saas/${id}`)
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('pt-BR')
}

function formatBRL(centavos?: number) {
  if (centavos === undefined || centavos === null) return '—'
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function statusClass(s?: string) {
  return s || 'desconhecido'
}
</script>

<template>
  <section class="table_section">
    <h2 class="title dashboard_title">ASSINATURAS SaaS</h2>

    <form class="table_header filters" @submit.prevent="searchData">
      <SearchBar
        v-model="search"
        placeholder="Buscar cliente, e-mail, CPF/CNPJ..."
        :fetching="fetching"
        @search="searchData"
      />

      <div class="filters_row">
        <select v-model="status" class="filter_input">
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <select v-model="planoId" class="filter_input">
          <option value="">Todos os planos</option>
          <option v-for="p in planos" :key="p.id" :value="p.id">{{ p.nome }}</option>
        </select>

        <label class="filter_date">
          <span>Criado de</span>
          <input v-model="criadoDe" type="date" class="filter_input" />
        </label>
        <label class="filter_date">
          <span>Criado até</span>
          <input v-model="criadoAte" type="date" class="filter_input" />
        </label>
        <label class="filter_date">
          <span>Próx. cob. de</span>
          <input v-model="proximaDe" type="date" class="filter_input" />
        </label>
        <label class="filter_date">
          <span>Próx. cob. até</span>
          <input v-model="proximaAte" type="date" class="filter_input" />
        </label>

        <button type="submit" class="filter_btn">Filtrar</button>
        <button type="button" class="filter_btn secondary" @click="limparFiltros">Limpar</button>
      </div>
    </form>

    <div class="table_wrapper">
      <table class="table_style">
        <thead>
          <tr>
            <th>Cliente / Conta</th>
            <th>Plano</th>
            <th>Status</th>
            <th>Criação</th>
            <th>Próxima cobrança</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in itens" :key="item.id">
            <td>{{ item.conta?.nome || '—' }}</td>
            <td>
              <div>{{ item.plano?.nome || '—' }}</div>
              <small class="muted">{{ formatBRL(item.plano?.valor_mensal_centavos) }}</small>
            </td>
            <td>
              <span class="status_badge" :class="statusClass(item.status)">
                {{ labelStatusAssinatura(item.status) }}
              </span>
            </td>
            <td>{{ formatDate(item.created_at) }}</td>
            <td>{{ formatDate(item.proxima_cobranca_em) }}</td>
            <td>
              <div class="action_btn_container">
                <button
                  type="button"
                  class="action_button"
                  title="Visualizar"
                  @click="goToVisualizar(item.id)"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="#1e3f49">
                    <path
                      d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <TableEmptyMessage :show="noContent" />
    <TablePaginator :page-count="pages" :current-page="page" @page-change="onPageChange" />
  </section>
</template>

<style lang="scss" scoped>
.table_section {
  width: 100%;
  overflow: auto;

  .title {
    margin-bottom: 20px;
  }

  .table_header {
    min-width: 600px;
    padding: 24px 38px 28px 38px;
    width: 100%;
    background-color: rgba(207, 198, 188, 0.1);
    margin-bottom: 1px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .filters_row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: flex-end;
  }

  .filter_date {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.75rem;
    color: var(--color-blue-700);
  }

  .filter_input {
    height: 40px;
    border: 1px solid var(--color-gray-500);
    padding: 0 10px;
    background: #fff;
    color: var(--color-blue-700);
    min-width: 150px;
  }

  .filter_btn {
    height: 40px;
    border: none;
    padding: 0 16px;
    background: var(--color-blue-700);
    color: #fff;
    cursor: pointer;
    font-weight: 600;

    &.secondary {
      background: #fff;
      color: var(--color-blue-700);
      border: 1px solid var(--color-gray-500);
    }
  }

  .table_wrapper {
    overflow-x: auto;
  }

  .muted {
    color: #777;
  }

  .status_badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;

    &.ativa {
      background-color: #d3ecd5;
      color: #2e7d32;
    }
    &.pendente,
    &.pendente_acao {
      background-color: #fff3cd;
      color: #856404;
    }
    &.inadimplente {
      background-color: #f8d7da;
      color: #842029;
    }
    &.suspensa {
      background-color: #e2e3e5;
      color: #41464b;
    }
    &.cancelada,
    &.expirada {
      background-color: #eee;
      color: #777;
    }
  }

  .action_btn_container {
    display: flex;
    flex-direction: row;
    align-items: center;

    .action_button {
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border: none;
      outline: none;
      background-color: transparent;
      cursor: pointer;

      &:hover {
        transition: 0.1s;
        background-color: var(--color-white-100);
        filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.065));
      }
    }
  }
}
</style>
