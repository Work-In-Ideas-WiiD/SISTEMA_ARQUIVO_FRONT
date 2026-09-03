<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import { getFuncoes, deleteFuncao, type IFuncao } from '@/services/http/funcoes'
import { useDebouncedSearch } from '@/composables/useDebouncedSearch'
import iconSearch from '@/assets/imgs/administradores/icon-search.svg'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconNewFolder from '@/assets/imgs/administradores/icon-new-folder.svg'
import iconEdit from '@/assets/imgs/administradores/icon-edit.svg'
import iconDelete from '@/assets/imgs/agrupamentos/delete.svg'
import NightConfirmModal from '@/components/NightConfirmModal/NightConfirmModal.vue'
import { useNightConfirm } from '@/composables/useNightConfirm'

const router = useRouter()
const toast = useToast()
const {
  open: confirmOpen,
  options: confirmOptions,
  askConfirm,
  onConfirm,
  onCancel
} = useNightConfirm()

const page = ref(1)
const pages = ref(0)
const funcoes = ref<IFuncao[]>([])
const noContent = ref(false)
const search = ref('')
const searchPlaceholder = ref('Pesquisar por nome…')

let searchPlaceholderMql: MediaQueryList | null = null

function updateSearchPlaceholder() {
  searchPlaceholder.value = window.matchMedia('(max-width: 1200px)').matches
    ? 'Pesquisar…'
    : 'Pesquisar por nome…'
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
    const { data } = await getFuncoes(pageParam, likeParam)
    pages.value = data.last_page
    funcoes.value = data.data
    noContent.value = data.data.length === 0
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar funções')
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
  router.push('/dashboard/funcoes/novo')
}

function goToEditar(id: string) {
  router.push(`/dashboard/funcoes/editar/${id}`)
}

async function handleDelete(id: string) {
  const ok = await askConfirm({
    title: 'Excluir função',
    body: 'Tem certeza que deseja excluir esta função?',
    confirmLabel: 'EXCLUIR',
    danger: true
  })
  if (!ok) return

  try {
    await deleteFuncao(id)
    toast.success('Função excluída com sucesso')
    getData(page.value, search.value)
  } catch (error) {
    console.error(error)
    toast.error('Erro ao excluir função')
  }
}
</script>

<template>
  <section class="funcoes-page">
    <div class="funcoes-page__heading">
      <button
        type="button"
        class="funcoes-page__back"
        aria-label="Voltar para Home"
        @click="router.push('/dashboard/home')"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="funcoes-page__title dashboard_title">FUNÇÕES</h2>
    </div>

    <div class="funcoes-panel">
      <form class="funcoes-toolbar" @submit.prevent="searchData">
        <label class="funcoes-search">
          <button type="submit" class="funcoes-search__btn" aria-label="Pesquisar">
            <img :src="iconSearch" width="18" height="18" alt="" />
          </button>
          <input
            v-model="search"
            type="text"
            :placeholder="searchPlaceholder"
            @input="onSearchInput"
          />
        </label>

        <button type="button" class="funcoes-cta" @click="goToNovo">
          <img :src="iconNewFolder" width="20" height="16" alt="" />
          <span>NOVA FUNÇÃO</span>
        </button>
      </form>

      <div class="funcoes-scroll">
        <table class="funcoes-grid">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in funcoes" :key="item.id">
              <td :title="item.nome">{{ item.nome }}</td>
              <td :title="item.descricao || '—'">{{ item.descricao || '—' }}</td>
              <td>
                <div class="funcoes-actions">
                  <button
                    type="button"
                    class="funcoes-action"
                    aria-label="Editar função"
                    @click="goToEditar(item.id)"
                  >
                    <img :src="iconEdit" width="24" height="24" alt="" />
                  </button>
                  <button
                    type="button"
                    class="funcoes-action"
                    aria-label="Excluir função"
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

      <TableEmptyMessage :show="noContent" theme="night" class="funcoes-empty" />
      <TablePaginator
        class="funcoes-paginator"
        theme="night"
        :page-count="pages"
        :current-page="page"
        @page-change="onPageChange"
      />
    </div>

    <NightConfirmModal
      :open="confirmOpen"
      :title="confirmOptions.title"
      :body="confirmOptions.body"
      :confirm-label="confirmOptions.confirmLabel"
      :cancel-label="confirmOptions.cancelLabel"
      :danger="confirmOptions.danger"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </section>
</template>

<style lang="scss" scoped>
.funcoes-page {
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

.funcoes-panel {
  background: var(--night-surface, rgba(121, 121, 121, 0.25));
  border-radius: var(--night-radius, 30px);
  overflow: hidden;
}

.funcoes-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding: 30px 38px 32px;
  flex-wrap: nowrap;
}

.funcoes-search {
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

.funcoes-cta {
  flex: 0 0 auto;
  min-width: 223px;
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

.funcoes-scroll {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.funcoes-grid {
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
    width: 30%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 50%;
  }

  th:nth-child(3),
  td:nth-child(3) {
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

.funcoes-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.funcoes-action {
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

.funcoes-empty {
  width: 100%;
}

.funcoes-paginator {
  width: 100%;
}

@media (max-width: 1200px) {
  .funcoes-toolbar {
    flex-wrap: nowrap;
    gap: 10px;
    padding: 24px 16px 28px;
  }

  .funcoes-search {
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

  .funcoes-cta {
    flex: 0 0 auto;
    width: auto;
    min-width: 140px;
    height: 44px;
    margin-left: 0;
    padding: 0 12px;
    font-size: 13px;
    gap: 8px;
  }

  .funcoes-action {
    width: 34px;
    height: 34px;

    img {
      width: 16px !important;
      height: 16px !important;
    }
  }

  .funcoes-actions {
    gap: 6px;
  }
}
</style>
