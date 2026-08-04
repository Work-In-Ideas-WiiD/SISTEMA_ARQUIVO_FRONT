<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import SearchBar from '@/components/inputs/SearchBar/SearchBar.vue'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import { getPlanos, deletePlano, patchPlanoStatus, type IPlano } from '@/services/http/planos'
import { getApiErrorMessage } from '@/utils/apiError'

const router = useRouter()
const toast = useToast()

const fetching = ref(false)
const page = ref(1)
const pages = ref(0)
const planos = ref<IPlano[]>([])
const noContent = ref(false)
const search = ref('')

onMounted(() => getData(page.value, search.value))

async function getData(pageParam: number, likeParam: string = '') {
  try {
    fetching.value = true
    const { data } = await getPlanos(pageParam, likeParam)
    pages.value = data.last_page
    planos.value = data.data
    noContent.value = data.data.length === 0
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Erro ao carregar planos'))
  } finally {
    fetching.value = false
  }
}

function searchData() {
  getData(page.value, search.value)
}

function onPageChange(newPage: number) {
  page.value = newPage
  getData(newPage, search.value)
}

function goToNovo() {
  router.push('/dashboard/planos/novo')
}

function goToEditar(id: string) {
  router.push(`/dashboard/planos/editar/${id}`)
}

function goToVisualizar(id: string) {
  router.push(`/dashboard/planos/visualizar/${id}`)
}

function formatBRL(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatArmazenamento(bytes: number) {
  const gb = bytes / 1024 ** 3
  return `${gb.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} GB`
}

async function toggleStatus(item: IPlano) {
  try {
    await patchPlanoStatus(item.id, !item.ativo)
    toast.success(!item.ativo ? 'Plano ativado' : 'Plano desativado')
    getData(page.value, search.value)
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Erro ao alterar status do plano'))
  }
}

async function handleDelete(id: string) {
  if (!confirm('Tem certeza que deseja excluir este plano?')) return

  try {
    await deletePlano(id)
    toast.success('Plano excluído com sucesso')
    getData(page.value, search.value)
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Erro ao excluir plano'))
  }
}
</script>

<template>
  <section class="table_section">
    <h2 class="title dashboard_title">PLANOS</h2>
    <form class="table_header" @submit.prevent="searchData">
      <SearchBar
        v-model="search"
        placeholder="Pesquisar por nome..."
        :fetching="fetching"
        @search="searchData"
      />
      <CustomButton title="NOVO PLANO" @click="goToNovo" />
    </form>
    <div class="table_wrapper">
      <table class="table_style">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Valor mensal</th>
            <th>Máx. usuários</th>
            <th>Armazenamento</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in planos" :key="item.id">
            <td>{{ item.nome }}</td>
            <td>{{ formatBRL(item.valor_mensal_centavos) }}</td>
            <td>{{ item.max_usuarios }}</td>
            <td>{{ formatArmazenamento(item.armazenamento_bytes) }}</td>
            <td>
              <button
                type="button"
                class="status_badge"
                :class="item.ativo ? 'ativo' : 'inativo'"
                :title="item.ativo ? 'Clique para desativar' : 'Clique para ativar'"
                @click="toggleStatus(item)"
              >
                {{ item.ativo ? 'Ativo' : 'Inativo' }}
              </button>
            </td>
            <td>
              <div class="action_btn_container">
                <button type="button" class="action_button" title="Visualizar" @click="goToVisualizar(item.id)">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="#1e3f49">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"/>
                  </svg>
                </button>
                <button type="button" class="action_button" title="Editar" @click="goToEditar(item.id)">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="#C7633B">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
                <button type="button" class="action_button delete" title="Excluir" @click="handleDelete(item.id)">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="#dc3545">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
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
    padding: 38px 38px 42px 38px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    background-color: rgba(207, 198, 188, 0.1);
    margin-bottom: 1px;
    gap: 30px;
  }

  .table_wrapper {
    overflow-x: auto;
  }

  .status_badge {
    border: none;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;

    &.ativo {
      background-color: #d3ecd5;
      color: #2e7d32;
    }

    &.inativo {
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
