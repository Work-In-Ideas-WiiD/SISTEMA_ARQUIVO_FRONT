<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import { getClientes, type IGetClientesDataRes } from '@/services/http/clientes'
import { formatCnpjCpf } from '@/utils/formatCpfCnpj'
import { formatPhone } from '@/utils/formatPhone'
import { useDebouncedSearch } from '@/composables/useDebouncedSearch'
import iconSearch from '@/assets/imgs/administradores/icon-search.svg'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconNewFolder from '@/assets/imgs/administradores/icon-new-folder.svg'
import iconView from '@/assets/imgs/clientes/icon-view.svg'

const router = useRouter()
const toast = useToast()

const page = ref(1)
const pages = ref(0)
const clients = ref<IGetClientesDataRes[]>([])
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
    const { data } = await getClientes(pageParam, likeParam)
    pages.value = data.last_page
    clients.value = data.data
    noContent.value = data.data.length === 0
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar clientes')
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
  router.push('/dashboard/clientes/novo')
}

function goToVisualizar(id: string) {
  router.push(`/dashboard/clientes/visualizar/${id}`)
}

function getDocumentId(item: IGetClientesDataRes): string {
  if (item.cnpj && item.cnpj.trim() !== '') return formatCnpjCpf(item.cnpj)
  if (item.cpf && item.cpf.trim() !== '') return formatCnpjCpf(item.cpf)
  return 'n/a'
}

function getContato(item: IGetClientesDataRes): string {
  return formatPhone(item.contato)
}
</script>

<template>
  <section class="clientes-page">
    <div class="clientes-page__heading">
      <button
        type="button"
        class="clientes-page__back"
        aria-label="Voltar para Home"
        @click="router.push('/dashboard/home')"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="clientes-page__title dashboard_title">CLIENTES</h2>
    </div>

    <div class="clientes-panel">
      <form class="clientes-toolbar" @submit.prevent="searchData">
        <label class="clientes-search">
          <button type="submit" class="clientes-search__btn" aria-label="Pesquisar">
            <img :src="iconSearch" width="18" height="18" alt="" />
          </button>
          <input
            v-model="search"
            type="text"
            :placeholder="searchPlaceholder"
            @input="onSearchInput"
          />
        </label>

        <button type="button" class="clientes-cta" @click="goToNovo">
          <img :src="iconNewFolder" width="20" height="16" alt="" />
          <span>NOVO CADASTRO</span>
        </button>
      </form>

      <div class="clientes-scroll">
        <table class="clientes-grid">
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
            <tr v-for="item in clients" :key="item.id">
              <td :title="item.nome">{{ item.nome }}</td>
              <td :title="item.nome_empresa || 'n/a'">{{ item.nome_empresa || 'n/a' }}</td>
              <td :title="getDocumentId(item)">{{ getDocumentId(item) }}</td>
              <td :title="item.email || 'n/a'">{{ item.email || 'n/a' }}</td>
              <td :title="getContato(item)">{{ getContato(item) }}</td>
              <td>
                <div class="clientes-actions">
                  <button
                    type="button"
                    class="clientes-action"
                    aria-label="Visualizar cliente"
                    @click="goToVisualizar(item.id)"
                  >
                    <img :src="iconView" width="24" height="24" alt="" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <TableEmptyMessage :show="noContent" theme="night" class="clientes-empty" />
      <TablePaginator
        class="clientes-paginator"
        theme="night"
        :page-count="pages"
        :current-page="page"
        @page-change="onPageChange"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.clientes-page {
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

.clientes-panel {
  background: var(--night-surface, rgba(121, 121, 121, 0.25));
  border-radius: var(--night-radius, 30px);
  overflow: hidden;
}

.clientes-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding: 30px 38px 32px;
  flex-wrap: nowrap;
}

.clientes-search {
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

.clientes-cta {
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

.clientes-scroll {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.clientes-grid {
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
    width: 14%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 16%;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 14%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 22%;
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 14%;
  }

  th:nth-child(6),
  td:nth-child(6) {
    width: 20%;
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

.clientes-actions {
  display: flex;
  align-items: center;
  justify-content: center;
}

.clientes-action {
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

.clientes-empty {
  width: 100%;
}

.clientes-paginator {
  width: 100%;
}

@media (max-width: 1200px) {
  .clientes-toolbar {
    flex-wrap: nowrap;
    gap: 10px;
    padding: 24px 16px 28px;
  }

  .clientes-search {
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

  .clientes-cta {
    flex: 0 0 auto;
    width: auto;
    min-width: 140px;
    height: 44px;
    margin-left: 0;
    padding: 0 12px;
    font-size: 13px;
    gap: 8px;
  }

  .clientes-action {
    width: 34px;
    height: 34px;

    img {
      width: 16px !important;
      height: 16px !important;
    }
  }
}
</style>
