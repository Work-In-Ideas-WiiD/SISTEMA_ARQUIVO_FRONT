<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import SearchBar from '@/components/inputs/SearchBar/SearchBar.vue'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import { getContratos, postSendToClicksign, type IGetContratosDataRes } from '@/services/http/contratos'
import { formatCnpjCpf } from '@/utils/formatCpfCnpj'
import { openFile } from '@/utils/openFile'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const fetching = ref(false)
const page = ref(1)
const pages = ref(0)
const contracts = ref<IGetContratosDataRes[]>([])
const noContent = ref(false)
const search = ref('')

onMounted(() => {
  getData(page.value, search.value)
})

async function getData(pageParam: number, likeParam: string = '') {
  try {
    fetching.value = true
    const { data } = await getContratos(pageParam, likeParam)
    pages.value = data.last_page
    contracts.value = data.data
    noContent.value = data.data.length === 0
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar contratos')
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
  router.push('/dashboard/contratos/novo')
}

function getStatus(item: IGetContratosDataRes): string {
  if (!item.empresa || item.assinantes.length <= 1) {
    return 'Pendente'
  }
  for (const assinante of item.assinantes) {
    if (!assinante.has_signed) {
      return 'Pendente'
    }
  }
  return 'Assinado'
}

function getBtnText(item: IGetContratosDataRes): string {
  if (authStore.userRole === 'administrador') {
    return 're-enviar para empresa'
  }
  if (item.assinantes.length > 1) {
    return 're-enviar para cliente'
  }
  return 'enviar para cliente'
}

async function handleAction(item: IGetContratosDataRes) {
  try {
    fetching.value = true
    await postSendToClicksign(item.id)
    toast.success('Enviado para assinatura')
    getData(page.value, search.value)
  } catch (error) {
    toast.error('Erro ao enviar para assinatura')
  } finally {
    fetching.value = false
  }
}
</script>

<template>
  <section class="table_section">
    <h2 class="title dashboard_title">CONTRATOS</h2>
    <form class="table_header" @submit.prevent="searchData">
      <SearchBar
        v-model="search"
        placeholder="Pesquisar por ID, nome, e-mail e número de documento…"
        :fetching="fetching"
        @search="searchData"
      />
      <CustomButton
        title="NOVO CADASTRO"
        icon="folder"
        @click="goToNovo"
      />
    </form>
    <div class="table_wrapper">
      <table class="table_style">
        <thead>
          <tr>
            <th>Contrato</th>
            <th>Empresa</th>
            <th>Status</th>
            <th>Ações</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in contracts" :key="item.id">
            <td>{{ item.descricao }}</td>
            <td>{{ item.empresa ? formatCnpjCpf(item.empresa.cnpj || '') : 'n/a' }}</td>
            <td>
              <span :class="['status_badge', getStatus(item).toLowerCase()]">
                {{ getStatus(item) }}
              </span>
            </td>
            <td>
              <button class="action_btn_orange" @click="handleAction(item)">
                {{ getBtnText(item) }}
              </button>
            </td>
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
</template>

<style lang="scss" scoped>
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

  .action_btn_orange {
    background-color: var(--color-orange-500);
    color: white;
    border: none;
    padding: 8px 16px;
    font-size: 0.75rem;
    cursor: pointer;
    text-transform: lowercase;

    &:hover {
      background-color: var(--color-orange-600);
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
