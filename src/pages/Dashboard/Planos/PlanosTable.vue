<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import { getPlanos, deletePlano, patchPlanoStatus, type IPlano } from '@/services/http/planos'
import { getApiErrorMessage } from '@/utils/apiError'
import { useDebouncedSearch } from '@/composables/useDebouncedSearch'
import iconSearch from '@/assets/imgs/administradores/icon-search.svg'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconNewFolder from '@/assets/imgs/administradores/icon-new-folder.svg'
import iconEdit from '@/assets/imgs/administradores/icon-edit.svg'
import iconView from '@/assets/imgs/clientes/icon-view.svg'
import iconDelete from '@/assets/imgs/agrupamentos/delete.svg'

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
  <section class="planos-page">
    <div class="planos-page__heading">
      <button
        type="button"
        class="planos-page__back"
        aria-label="Voltar para Home"
        @click="router.push('/dashboard/home')"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="planos-page__title dashboard_title">PLANOS</h2>
    </div>

    <div class="planos-panel">
      <form class="planos-toolbar" @submit.prevent="searchData">
        <label class="planos-search">
          <button type="submit" class="planos-search__btn" aria-label="Pesquisar">
            <img :src="iconSearch" width="18" height="18" alt="" />
          </button>
          <input
            v-model="search"
            type="text"
            placeholder="Pesquisar por nome..."
            @input="onSearchInput"
          />
        </label>

        <button type="button" class="planos-cta" @click="goToNovo">
          <img :src="iconNewFolder" width="20" height="16" alt="" />
          <span>NOVO PLANO</span>
        </button>
      </form>

      <div class="planos-scroll">
        <table class="planos-grid">
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
              <td :title="item.nome">{{ item.nome }}</td>
              <td :title="formatBRL(item.valor_mensal_centavos)">
                {{ formatBRL(item.valor_mensal_centavos) }}
              </td>
              <td :title="String(item.max_usuarios)">{{ item.max_usuarios }}</td>
              <td :title="formatArmazenamento(item.armazenamento_bytes)">
                {{ formatArmazenamento(item.armazenamento_bytes) }}
              </td>
              <td>
                <button
                  type="button"
                  class="planos-status"
                  :class="item.ativo ? 'planos-status--ativo' : 'planos-status--inativo'"
                  :title="item.ativo ? 'Clique para desativar' : 'Clique para ativar'"
                  @click="toggleStatus(item)"
                >
                  {{ item.ativo ? 'Ativo' : 'Inativo' }}
                </button>
              </td>
              <td>
                <div class="planos-actions">
                  <button
                    type="button"
                    class="planos-action"
                    aria-label="Visualizar plano"
                    @click="goToVisualizar(item.id)"
                  >
                    <img :src="iconView" width="24" height="24" alt="" />
                  </button>
                  <button
                    type="button"
                    class="planos-action"
                    aria-label="Editar plano"
                    @click="goToEditar(item.id)"
                  >
                    <img :src="iconEdit" width="24" height="24" alt="" />
                  </button>
                  <button
                    type="button"
                    class="planos-action"
                    aria-label="Excluir plano"
                    @click="handleDelete(item.id)"
                  >
                    <img :src="iconDelete" width="24" height="24" alt="" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <TableEmptyMessage :show="noContent" theme="night" class="planos-empty" />
      <TablePaginator
        class="planos-paginator"
        theme="night"
        :page-count="pages"
        :current-page="page"
        @page-change="onPageChange"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.planos-page {
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

.planos-panel {
  background: var(--night-surface, rgba(121, 121, 121, 0.25));
  border-radius: var(--night-radius, 30px);
  overflow: hidden;
}

.planos-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding: 30px 38px 32px;
  flex-wrap: nowrap;
}

.planos-search {
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

.planos-cta {
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

.planos-scroll {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.planos-grid {
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
    width: 140px;
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
    width: 140px;
    overflow: visible;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 18%;
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
    width: 16%;
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 12%;
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

.planos-status {
  border: none;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 20px;
  font-family: 'Source Code Pro', monospace;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;

  &--ativo {
    background: rgba(76, 175, 80, 0.25);
    color: #8ee99a;
  }

  &--inativo {
    background: rgba(121, 121, 121, 0.35);
    color: rgba(247, 247, 247, 0.65);
  }

  &:hover {
    opacity: 0.9;
  }
}

.planos-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.planos-action {
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

  img {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  &:hover {
    opacity: 0.85;
  }
}

.planos-empty {
  width: 100%;
}

.planos-paginator {
  width: 100%;
}

@media (max-width: 1200px) {
  .planos-toolbar {
    flex-wrap: nowrap;
    gap: 10px;
    padding: 24px 16px 28px;
  }

  .planos-search {
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

  .planos-cta {
    flex: 0 0 auto;
    width: auto;
    min-width: 140px;
    height: 44px;
    margin-left: 0;
    padding: 0 12px;
    font-size: 13px;
    gap: 8px;
  }

  .planos-action {
    width: 34px;
    height: 34px;

    img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
