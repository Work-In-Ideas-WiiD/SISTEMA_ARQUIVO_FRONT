<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import SearchBar from '@/components/inputs/SearchBar/SearchBar.vue'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import { getAssinaturas, type IGetAssinaturasData } from '@/services/http/assinaturas'
import { openFile } from '@/utils/openFile'

const toast = useToast()

const fetching = ref(false)
const page = ref(1)
const pages = ref(0)
const assinaturas = ref<IGetAssinaturasData[]>([])
const noContent = ref(false)
const search = ref('')

onMounted(() => {
  getData(page.value, search.value)
})

async function getData(pageParam: number, likeParam: string = '') {
  try {
    fetching.value = true
    const { data } = await getAssinaturas(pageParam, likeParam)
    pages.value = data.last_page
    assinaturas.value = data.data
    noContent.value = data.data.length === 0
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar assinaturas')
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

function getStatusByType(item: IGetAssinaturasData, type: 'empresa' | 'cliente'): string {
  const assinante = item.assinantes.find(a => a.tipo === type)
  if (!assinante) return 'Pendente'
  return assinante.has_signed ? 'Assinado' : 'Pendente'
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}

function getEmpresaName(item: IGetAssinaturasData): string {
  const empresa = item.assinantes.find(a => a.tipo === 'empresa')
  return empresa?.dados.nome || 'n/a'
}

function getClienteName(item: IGetAssinaturasData): string {
  const cliente = item.assinantes.find(a => a.tipo === 'cliente')
  return cliente?.dados.nome || 'n/a'
}
</script>

<template>
  <main class="page dashboard_padding">
    <section class="table_section">
      <h2 class="title dashboard_title">ASSINATURAS</h2>
      <form class="table_header" @submit.prevent="searchData">
        <SearchBar
          v-model="search"
          placeholder="Pesquisar por ID, nome, e-mail e número de documento…"
          :fetching="fetching"
          @search="searchData"
        />
      </form>
      <div class="table_wrapper">
        <table class="table_style">
          <thead>
            <tr>
              <th>Nome do contrato</th>
              <th>Nome da empresa</th>
              <th>Nome do cliente final</th>
              <th>Status - Empresa</th>
              <th>Status - Cliente</th>
              <th>Data do envio</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in assinaturas" :key="item.id">
              <td>{{ item.descricao }}</td>
              <td>{{ getEmpresaName(item) }}</td>
              <td>{{ getClienteName(item) }}</td>
              <td>
                <span :class="['status_badge', getStatusByType(item, 'empresa').toLowerCase()]">
                  {{ getStatusByType(item, 'empresa') }}
                </span>
              </td>
              <td>
                <span :class="['status_badge', getStatusByType(item, 'cliente').toLowerCase()]">
                  {{ getStatusByType(item, 'cliente') }}
                </span>
              </td>
              <td>{{ formatDate(item.created_at) }}</td>
              <td>
                <button
                  type="button"
                  class="download_button"
                  @click="openFile(item.url)"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="#C7633B">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <TableEmptyMessage :show="noContent" />
      <TablePaginator
        :page-count="pages"
        :current-page="page"
        @page-change="onPageChange"
      />
    </section>
  </main>
</template>

<style lang="scss" scoped>
.page {
  width: 100%;
}

.table_section {
  width: 100%;
  overflow: auto;

  .title {
    margin-bottom: 42px;
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
    padding: 5px 15px;
    border-radius: 3px;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 600;

    &.pendente {
      background-color: var(--color-orange-500);
      color: white;
    }

    &.assinado {
      background-color: var(--color-green-400);
      color: white;
    }
  }

  .download_button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 50%;

    &:hover {
      background-color: var(--color-white-100);
    }
  }
}
</style>
