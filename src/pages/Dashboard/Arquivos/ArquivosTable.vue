<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import { getArquivos, deleteArquivo, type IGetArquivosDataRes } from '@/services/http/arquivos'
import { formatCnpjCpf } from '@/utils/formatCpfCnpj'
import { openFile } from '@/utils/openFile'
import { useDebouncedSearch } from '@/composables/useDebouncedSearch'
import iconSearch from '@/assets/imgs/administradores/icon-search.svg'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconNewFolder from '@/assets/imgs/administradores/icon-new-folder.svg'
import iconDownload from '@/assets/imgs/arquivos/download.svg'
import iconDelete from '@/assets/imgs/agrupamentos/delete.svg'

const router = useRouter()
const toast = useToast()

const page = ref(1)
const pages = ref(0)
const arquivos = ref<IGetArquivosDataRes[]>([])
const noContent = ref(false)
const search = ref('')
const searchPlaceholder = ref('Pesquisar por ID, nome, e-mail e número de documento…')

let searchPlaceholderMql: MediaQueryList | null = null

function updateSearchPlaceholder() {
  searchPlaceholder.value = window.matchMedia('(max-width: 1200px)').matches
    ? 'Pesquisar…'
    : 'Pesquisar por ID, nome, e-mail e número de documento…'
}

onMounted(() => {
  searchPlaceholderMql = window.matchMedia('(max-width: 1200px)')
  updateSearchPlaceholder()
  searchPlaceholderMql.addEventListener('change', updateSearchPlaceholder)
  getData(page.value, search.value)
})

onUnmounted(() => {
  searchPlaceholderMql?.removeEventListener('change', updateSearchPlaceholder)
})

async function getData(pageParam: number, likeParam: string = '') {
  try {
    const { data } = await getArquivos(pageParam, likeParam)
    pages.value = data.last_page
    arquivos.value = data.data
    noContent.value = data.data.length === 0
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar arquivos')
  }
}

function searchData() {
  debouncedSearch.flush()
}

function onSearchInput() {
  debouncedSearch.schedule()
}

const debouncedSearch = useDebouncedSearch(() => {
  page.value = 1
  getData(page.value, search.value)
})

function onPageChange(newPage: number) {
  page.value = newPage
  getData(newPage, search.value)
}

function goToNovo() {
  router.push('/dashboard/arquivos/novo')
}

async function removeArquivo(id: string) {
  if (!confirm('Tem certeza que deseja excluir este arquivo?')) return

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

function getSetores(item: IGetArquivosDataRes): string {
  if (!item.setores || item.setores.length === 0) return '—'
  return item.setores.map((s) => s.nome).join(', ')
}

function getFuncoes(item: IGetArquivosDataRes): string {
  if (!item.funcoes || item.funcoes.length === 0) return '—'
  return item.funcoes.map((f) => f.nome).join(', ')
}
</script>

<template>
  <section class="arquivos-page">
    <div class="arquivos-page__heading">
      <button
        type="button"
        class="arquivos-page__back"
        aria-label="Voltar para Home"
        @click="router.push('/dashboard/home')"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="arquivos-page__title dashboard_title">ARQUIVOS</h2>
    </div>

    <div class="arquivos-panel">
      <form class="arquivos-toolbar" @submit.prevent="searchData">
        <label class="arquivos-search">
          <button type="submit" class="arquivos-search__btn" aria-label="Pesquisar">
            <img :src="iconSearch" width="18" height="18" alt="" />
          </button>
          <input
            v-model="search"
            type="text"
            :placeholder="searchPlaceholder"
            @input="onSearchInput"
          />
        </label>

        <button type="button" class="arquivos-cta" @click="goToNovo">
          <img :src="iconNewFolder" width="20" height="16" alt="" />
          <span>NOVO CADASTRO</span>
        </button>
      </form>

      <div class="arquivos-scroll">
        <table class="arquivos-grid">
          <thead>
            <tr>
              <th>Arquivo</th>
              <th>Empresa</th>
              <th>CNPJ</th>
              <th>Setor</th>
              <th>Função</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in arquivos" :key="item.id">
              <td :title="item.descricao">{{ item.descricao }}</td>
              <td :title="getEmpresaName(item)">{{ getEmpresaName(item) }}</td>
              <td :title="getEmpresaCnpj(item)">{{ getEmpresaCnpj(item) }}</td>
              <td :title="getSetores(item)">{{ getSetores(item) }}</td>
              <td :title="getFuncoes(item)">{{ getFuncoes(item) }}</td>
              <td>
                <div class="arquivos-actions">
                  <button
                    type="button"
                    class="arquivos-action"
                    aria-label="Baixar arquivo"
                    @click="openFile(item.url)"
                  >
                    <img :src="iconDownload" width="24" height="24" alt="" />
                  </button>
                  <button
                    type="button"
                    class="arquivos-action"
                    aria-label="Excluir arquivo"
                    @click="removeArquivo(item.id)"
                  >
                    <img :src="iconDelete" width="24" height="24" alt="" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <TableEmptyMessage :show="noContent" theme="night" class="arquivos-empty" />
      <TablePaginator
        class="arquivos-paginator"
        theme="night"
        :page-count="pages"
        :current-page="page"
        @page-change="onPageChange"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.arquivos-page {
  width: 100%;
  max-width: 100%;
  min-width: 0;

  &__heading {
    display: flex;
    align-items: center;
    gap: 1px;
    margin-bottom: 42px;
  }

  &__back {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }

  &__title {
    margin: 0;
  }
}

.arquivos-panel {
  background: var(--night-surface, rgba(121, 121, 121, 0.25));
  border-radius: var(--night-radius, 30px);
  overflow: hidden;
}

.arquivos-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding: 30px 38px 32px;
  flex-wrap: nowrap;
}

.arquivos-search {
  flex: 0 0 518px;
  width: 518px;
  max-width: 518px;
  height: 49px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 20px;
  background: rgba(121, 121, 121, 0.3);
  border-radius: 30px;
  cursor: text;

  &__btn {
    flex-shrink: 0;
    border: none;
    background: transparent;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
    color: #ffffff;

    &::placeholder {
      color: #ffffff;
      opacity: 1;
    }
  }
}

.arquivos-cta {
  flex: 0 0 223px;
  width: 223px;
  height: 46px;
  margin-left: auto;
  padding: 0 18px;
  border: none;
  border-radius: 30px;
  background: #ff00ff;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  font-family: 'Source Code Pro', monospace;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase;
  white-space: nowrap;

  &:hover {
    opacity: 0.92;
  }
}

.arquivos-scroll {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.arquivos-grid {
  width: 100%;
  min-width: 0;
  border-collapse: collapse;
  table-layout: fixed;

  th {
    padding: 24px 16px 18px;
    text-align: left;
    font-family: 'Source Code Pro', monospace;
    font-size: 18px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0;
    color: #f7f7f7;
    opacity: 0.7;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th:first-child,
  td:first-child {
    padding-left: 38px;
  }

  th:last-child,
  td:last-child {
    padding-right: 38px;
  }

  th:last-child {
    text-align: center;
    width: 96px;
  }

  td {
    height: 60px;
    padding: 0 16px;
    text-align: left;
    vertical-align: middle;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
    letter-spacing: 0;
    color: #f7f7f7;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  td:last-child {
    width: 96px;
    overflow: visible;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 18%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 18%;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 14%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 16%;
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 16%;
  }

  th:nth-child(6),
  td:nth-child(6) {
    width: 18%;
  }

  tbody tr:nth-child(odd) {
    background: var(--night-row, rgba(33, 33, 33, 0.5));
  }

  @media (max-width: 1440px) {
    th {
      font-size: 14px;
      padding: 18px 10px 14px;
    }

    th:first-child,
    td:first-child {
      padding-left: 24px;
    }

    th:last-child,
    td:last-child {
      padding-right: 24px;
    }

    td {
      padding: 0 10px;
      font-size: 12px;
    }
  }

  @media (max-width: 1100px) {
    th {
      font-size: 12px;
      padding: 14px 8px 12px;
    }

    th:first-child,
    td:first-child {
      padding-left: 16px;
    }

    th:last-child,
    td:last-child {
      padding-right: 16px;
    }

    td {
      padding: 0 8px;
      font-size: 11px;
      height: 52px;
    }
  }
}

.arquivos-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.arquivos-action {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(121, 121, 121, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;

  &:hover {
    opacity: 0.85;
  }
}

.arquivos-empty {
  width: 100%;
}

.arquivos-paginator {
  width: 100%;
}

@media (max-width: 1200px) {
  .arquivos-toolbar {
    flex-wrap: nowrap;
    gap: 10px;
    padding: 24px 16px 28px;
  }

  .arquivos-search {
    flex: 1 1 auto;
    width: auto;
    max-width: none;
    min-width: 0;
    height: 44px;
    padding: 0 14px;

    input {
      font-size: 12px;
    }
  }

  .arquivos-cta {
    flex: 0 0 auto;
    width: auto;
    min-width: 140px;
    height: 44px;
    margin-left: 0;
    padding: 0 12px;
    font-size: 13px;
    gap: 8px;
  }

  .arquivos-action {
    width: 34px;
    height: 34px;

    img {
      width: 16px !important;
      height: 16px !important;
    }
  }

  .arquivos-actions {
    gap: 6px;
  }
}
</style>
