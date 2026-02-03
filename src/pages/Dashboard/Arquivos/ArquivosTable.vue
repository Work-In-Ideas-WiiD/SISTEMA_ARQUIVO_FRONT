<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import SearchBar from '@/components/inputs/SearchBar/SearchBar.vue'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import { getArquivos, deleteArquivo, type IGetArquivosDataRes } from '@/services/http/arquivos'
import { formatCnpjCpf } from '@/utils/formatCpfCnpj'
import { openFile } from '@/utils/openFile'

const router = useRouter()
const toast = useToast()

const fetching = ref(false)
const page = ref(1)
const pages = ref(0)
const arquivos = ref<IGetArquivosDataRes[]>([])
const noContent = ref(false)
const search = ref('')

onMounted(() => {
  getData(page.value, search.value)
})

async function getData(pageParam: number, likeParam: string = '') {
  try {
    fetching.value = true
    const { data } = await getArquivos(pageParam, likeParam)
    pages.value = data.last_page
    arquivos.value = data.data
    noContent.value = data.data.length === 0
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar arquivos')
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
  router.push('/dashboard/arquivos/novo')
}

async function removeArquivo(id: string) {
  try {
    await deleteArquivo(id)
    toast.success('Arquivo excluído.')
    getData(page.value, search.value)
  } catch (error) {
    toast.error('Erro ao deletar arquivo.')
  }
}

function getEmpresaName(item: IGetArquivosDataRes): string {
  if (item.empresas && item.empresas.length > 0) {
    return item.empresas[0].empresa.nome_empresa || item.empresas[0].empresa.nome
  }
  return 'n/a'
}

function getEmpresaCnpj(item: IGetArquivosDataRes): string {
  if (item.empresas && item.empresas.length > 0 && item.empresas[0].empresa.cnpj) {
    return formatCnpjCpf(item.empresas[0].empresa.cnpj)
  }
  return 'n/a'
}
</script>

<template>
  <section class="table_section">
    <h2 class="title dashboard_title">ARQUIVOS</h2>
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
            <th>Arquivo</th>
            <th>Empresa</th>
            <th>CNPJ</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in arquivos" :key="item.id">
            <td>{{ item.descricao }}</td>
            <td>{{ getEmpresaName(item) }}</td>
            <td>{{ getEmpresaCnpj(item) }}</td>
            <td>
              <div class="action_btn_container">
                <button
                  type="button"
                  class="action_button"
                  @click="openFile(item.url)"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="#C7633B">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  class="action_button"
                  @click="removeArquivo(item.id)"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="#D64646">
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
