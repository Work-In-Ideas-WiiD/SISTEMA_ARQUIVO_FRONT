<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import SearchBar from '@/components/inputs/SearchBar/SearchBar.vue'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import { getEmpresas, deleteEmpresa, type IGetEmpresasDataRes } from '@/services/http/empresas'
import { formatCnpjCpf } from '@/utils/formatCpfCnpj'

const router = useRouter()
const toast = useToast()

const fetching = ref(false)
const page = ref(1)
const pages = ref(0)
const companies = ref<IGetEmpresasDataRes[]>([])
const noContent = ref(false)
const search = ref('')

onMounted(() => {
  getData(page.value, search.value)
})

async function getData(pageParam: number, likeParam: string = '') {
  try {
    fetching.value = true
    const { data } = await getEmpresas(pageParam, likeParam)
    pages.value = data.last_page
    companies.value = data.data
    noContent.value = data.data.length === 0
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar empresas')
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
  router.push('/dashboard/empresas/novo')
}

function goToEditar(id: string) {
  router.push(`/dashboard/empresas/editar/${id}`)
}

async function removeEmpresa(id: string) {
  try {
    await deleteEmpresa(id)
    toast.success('Empresa excluída.')
    getData(page.value, search.value)
  } catch (error) {
    toast.error('Erro ao deletar empresa.')
  }
}

function getDocumentId(item: IGetEmpresasDataRes): string {
  if (item.cnpj && item.cnpj.trim() !== '') return formatCnpjCpf(item.cnpj)
  if (item.cpf && item.cpf.trim() !== '') return formatCnpjCpf(item.cpf)
  return 'n/a'
}
</script>

<template>
  <section class="table_section">
    <h2 class="title dashboard_title">EMPRESAS</h2>
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
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in companies" :key="item.id">
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
                  @click="goToEditar(item.id)"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="#C7633B">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  class="action_button"
                  @click="removeEmpresa(item.id)"
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
