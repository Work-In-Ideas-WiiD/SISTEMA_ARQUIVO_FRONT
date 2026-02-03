<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import SearchBar from '@/components/inputs/SearchBar/SearchBar.vue'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import { getClientes, type IGetClientesDataRes } from '@/services/http/clientes'
import { formatCnpjCpf } from '@/utils/formatCpfCnpj'

const router = useRouter()
const toast = useToast()

const fetching = ref(false)
const page = ref(1)
const pages = ref(0)
const clients = ref<IGetClientesDataRes[]>([])
const noContent = ref(false)
const search = ref('')

onMounted(() => {
  getData(page.value, search.value)
})

async function getData(pageParam: number, likeParam: string = '') {
  try {
    fetching.value = true
    const { data } = await getClientes(pageParam, likeParam)
    pages.value = data.last_page
    clients.value = data.data
    noContent.value = data.data.length === 0
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar clientes')
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
  router.push('/dashboard/clientes/novo')
}

function goToVisualizar(id: string) {
  router.push(`/dashboard/clientes/visualizar/${id}`)
}

function getDocumentId(item: IGetClientesDataRes): string {
  if (item.cnpj) return formatCnpjCpf(item.cnpj)
  if (item.cpf) return formatCnpjCpf(item.cpf)
  return 'n/a'
}
</script>

<template>
  <section class="table_section">
    <h2 class="title dashboard_title">CLIENTES</h2>
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
            <th>Nome</th>
            <th>Nome da empresa</th>
            <th>CPF/CNPJ</th>
            <th>E-mail</th>
            <th>Celular</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in clients" :key="item.id">
            <td>{{ item.nome }}</td>
            <td>{{ item.nome_empresa || 'n/a' }}</td>
            <td>{{ getDocumentId(item) }}</td>
            <td>{{ item.email || 'n/a' }}</td>
            <td>{{ item.contato || 'n/a' }}</td>
            <td>
              <div class="action_btn_container">
                <button
                  type="button"
                  class="action_button"
                  @click="goToVisualizar(item.id)"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="#C7633B">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </button>
              </div>
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
