<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import {
  getCategoriasArquivo,
  postCategoriaArquivo,
  putCategoriaArquivo,
  deleteCategoriaArquivo,
  type ICategoriaArquivo
} from '@/services/http/categorias-arquivo'
import { getAllEmpresas } from '@/services/http/empresas'
import { getApiErrorMessage } from '@/utils/apiError'
import { useDebouncedSearch } from '@/composables/useDebouncedSearch'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import NightConfirmModal from '@/components/NightConfirmModal/NightConfirmModal.vue'
import { useNightConfirm } from '@/composables/useNightConfirm'
import iconSearch from '@/assets/imgs/administradores/icon-search.svg'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconNewFolder from '@/assets/imgs/administradores/icon-new-folder.svg'
import iconEdit from '@/assets/imgs/administradores/icon-edit.svg'
import iconDelete from '@/assets/imgs/agrupamentos/delete.svg'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.userRole === 'administrador')

const {
  open: confirmOpen,
  options: confirmOptions,
  askConfirm,
  onConfirm,
  onCancel
} = useNightConfirm()

const page = ref(1)
const pages = ref(0)
const categorias = ref<ICategoriaArquivo[]>([])
const noContent = ref(false)
const saving = ref(false)
const search = ref('')
const searchPlaceholder = ref('Pesquisar por nome…')

const empresas = ref<{ id: string; nome: string }[]>([])
const filterEmpresaId = ref('')

const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const formNome = ref('')
const formEmpresaId = ref('')

let searchPlaceholderMql: MediaQueryList | null = null

function updateSearchPlaceholder() {
  searchPlaceholder.value = window.matchMedia('(max-width: 1200px)').matches
    ? 'Pesquisar…'
    : 'Pesquisar por nome…'
}

async function loadEmpresas() {
  if (!isAdmin.value) return
  try {
    const { data } = await getAllEmpresas()
    empresas.value = (data.data || []).map(
      (e: { id: string; nome?: string; nome_empresa?: string }) => ({
        id: e.id,
        nome: (e.nome_empresa || e.nome || 'Empresa').trim()
      })
    )
  } catch {
    empresas.value = []
  }
}

async function getData(pageParam: number = page.value, likeParam: string = search.value) {
  try {
    const { data } = await getCategoriasArquivo(
      pageParam,
      likeParam,
      isAdmin.value ? filterEmpresaId.value || undefined : undefined
    )
    pages.value = data.last_page
    categorias.value = data.data
    noContent.value = data.data.length === 0
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar categorias'))
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

function onFilterEmpresaChange() {
  page.value = 1
  getData(1, search.value)
}

function openCreate() {
  editingId.value = null
  formNome.value = ''
  formEmpresaId.value = filterEmpresaId.value || ''
  modalOpen.value = true
}

function openEdit(item: ICategoriaArquivo) {
  editingId.value = item.id
  formNome.value = item.nome
  formEmpresaId.value = ''
  modalOpen.value = true
}

async function saveCategoria() {
  if (!formNome.value.trim()) {
    toast.error('Informe o nome da categoria')
    return
  }
  if (isAdmin.value && !editingId.value && !formEmpresaId.value) {
    toast.error('Selecione a empresa')
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await putCategoriaArquivo(editingId.value, { nome: formNome.value.trim() })
      toast.success('Categoria atualizada')
    } else {
      await postCategoriaArquivo({
        nome: formNome.value.trim(),
        ...(isAdmin.value ? { empresa_id: formEmpresaId.value } : {})
      })
      toast.success('Categoria criada')
    }
    modalOpen.value = false
    await getData(page.value, search.value)
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao salvar categoria'))
  } finally {
    saving.value = false
  }
}

async function removeCategoria(item: ICategoriaArquivo) {
  const ok = await askConfirm({
    title: 'Excluir categoria',
    body: `Tem certeza que deseja excluir a categoria “${item.nome}”? Arquivos existentes ficam sem categoria.`,
    confirmLabel: 'EXCLUIR',
    danger: true
  })
  if (!ok) return
  try {
    await deleteCategoriaArquivo(item.id)
    toast.success('Categoria excluída com sucesso')
    await getData(page.value, search.value)
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao excluir categoria'))
  }
}

onMounted(async () => {
  searchPlaceholderMql = window.matchMedia('(max-width: 1200px)')
  updateSearchPlaceholder()
  searchPlaceholderMql.addEventListener('change', updateSearchPlaceholder)
  await loadEmpresas()
  await getData(1)
})

onUnmounted(() => {
  searchPlaceholderMql?.removeEventListener('change', updateSearchPlaceholder)
})
</script>

<template>
  <section class="categorias-page">
    <div class="categorias-page__heading">
      <button
        type="button"
        class="categorias-page__back"
        aria-label="Voltar"
        @click="router.push('/dashboard/arquivos')"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="categorias-page__title dashboard_title">CATEGORIAS DE ARQUIVO</h2>
    </div>

    <div class="categorias-panel">
      <form class="categorias-toolbar" @submit.prevent="searchData">
        <label class="categorias-search">
          <button type="submit" class="categorias-search__btn" aria-label="Pesquisar">
            <img :src="iconSearch" width="18" height="18" alt="" />
          </button>
          <input
            v-model="search"
            type="text"
            :placeholder="searchPlaceholder"
            @input="onSearchInput"
          />
        </label>

        <select
          v-if="isAdmin"
          v-model="filterEmpresaId"
          class="categorias-empresa"
          aria-label="Filtrar por empresa"
          @change="onFilterEmpresaChange"
        >
          <option value="">Todas as empresas</option>
          <option v-for="emp in empresas" :key="emp.id" :value="emp.id">{{ emp.nome }}</option>
        </select>

        <button type="button" class="categorias-cta" @click="openCreate">
          <img :src="iconNewFolder" width="20" height="16" alt="" />
          <span>NOVA CATEGORIA</span>
        </button>
      </form>

      <div class="categorias-scroll">
        <table class="categorias-grid">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in categorias" :key="item.id">
              <td :title="item.nome">{{ item.nome }}</td>
              <td>
                <div class="categorias-actions">
                  <button
                    type="button"
                    class="categorias-action"
                    aria-label="Editar categoria"
                    @click="openEdit(item)"
                  >
                    <img :src="iconEdit" width="24" height="24" alt="" />
                  </button>
                  <button
                    type="button"
                    class="categorias-action"
                    aria-label="Excluir categoria"
                    @click="removeCategoria(item)"
                  >
                    <img :src="iconDelete" width="24" height="24" alt="" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <TableEmptyMessage :show="noContent" theme="night" class="categorias-empty" />
      <TablePaginator
        class="categorias-paginator"
        theme="night"
        :page-count="pages"
        :current-page="page"
        @page-change="onPageChange"
      />
    </div>

    <Teleport to="body">
      <div v-if="modalOpen" class="night-confirm" @click.self="modalOpen = false">
        <div class="night-confirm__modal" role="dialog" aria-modal="true">
          <h3 class="night-confirm__title">
            {{ editingId ? 'Editar categoria' : 'Nova categoria' }}
          </h3>
          <label v-if="isAdmin && !editingId" class="night-confirm__label">Empresa</label>
          <select
            v-if="isAdmin && !editingId"
            v-model="formEmpresaId"
            class="night-confirm__input"
          >
            <option value="" disabled>Selecione</option>
            <option v-for="emp in empresas" :key="emp.id" :value="emp.id">{{ emp.nome }}</option>
          </select>
          <label class="night-confirm__label">Nome</label>
          <input v-model="formNome" class="night-confirm__input" type="text" maxlength="255" />
          <div class="night-confirm__actions">
            <button
              type="button"
              class="night-confirm__btn night-confirm__btn--ghost"
              @click="modalOpen = false"
            >
              VOLTAR
            </button>
            <button
              type="button"
              class="night-confirm__btn"
              :disabled="saving"
              @click="saveCategoria"
            >
              SALVAR
            </button>
          </div>
        </div>
      </div>
    </Teleport>

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
.categorias-page {
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

.categorias-panel {
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.18));
  border-radius: var(--night-radius, 20px);
  overflow: hidden;
}

.categorias-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding: 30px 38px 32px;
  flex-wrap: nowrap;
}

.categorias-search {
  flex: 0 0 518px;
  width: 518px;
  max-width: 518px;
  height: 49px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 30px;
  cursor: text;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #b08d57;
    box-shadow: 0 0 0 2px rgba(176, 141, 87, 0.2);
  }

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
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 14px;
    font-weight: 400;
    line-height: 1;
    color: #ffffff;

    &::placeholder {
      color: #ffffff;
      opacity: 0.7;
    }
  }
}

.categorias-empresa {
  flex: 0 1 220px;
  height: 49px;
  padding: 0 16px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 14px;
}

.categorias-cta {
  flex: 0 0 240px;
  width: 240px;
  height: 46px;
  margin-left: auto;
  padding: 0 18px;
  border: none;
  border-radius: 30px;
  background: #b08d57;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: #c29f68;
    box-shadow: 0 4px 12px rgba(176, 141, 87, 0.3);
  }
}

.categorias-scroll {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.categorias-grid {
  width: 100%;
  min-width: 0;
  border-collapse: collapse;
  table-layout: fixed;

  th {
    padding: 24px 16px 18px;
    text-align: left;
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0;
    color: #f7f7f7;
    opacity: 0.7;
    text-transform: uppercase;
    white-space: nowrap;
  }

  th:first-child,
  td:first-child {
    padding-left: 38px;
  }

  th:last-child,
  td:last-child {
    padding-right: 38px;
    text-align: center;
    width: 120px;
  }

  td {
    height: 60px;
    padding: 0 16px;
    text-align: left;
    vertical-align: middle;
    font-family: var(--night-font, 'Inter', sans-serif);
    font-size: 14px;
    font-weight: 400;
    line-height: 1;
    color: #f7f7f7;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  td:last-child {
    overflow: visible;
  }

  tbody tr:nth-child(odd) {
    background: rgba(255, 255, 255, 0.02);
  }
}

.categorias-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.categorias-action {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: all 0.2s ease;

  img {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  &:hover {
    background: rgba(176, 141, 87, 0.25);
    transform: scale(1.05);
  }
}

.categorias-empty,
.categorias-paginator {
  width: 100%;
}

.night-confirm {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow: hidden;
}

.night-confirm__modal {
  width: min(420px, 100%);
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.25));
  border-radius: 16px;
  padding: 24px;
  box-sizing: border-box;
}

.night-confirm__title {
  margin: 0 0 16px;
  color: #fffcff;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 18px;
  font-weight: 700;
}

.night-confirm__label {
  display: block;
  margin: 10px 0 6px;
  color: #b08d57;
  font-size: 12px;
  font-weight: 600;
}

.night-confirm__input {
  width: 100%;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #fffcff;
  padding: 10px 12px;
  font: inherit;
  margin-bottom: 8px;
}

.night-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.night-confirm__btn {
  border: 0;
  border-radius: 30px;
  background: #b08d57;
  color: #ffffff;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-weight: 700;
  font-size: 14px;
  padding: 12px 18px;
  cursor: pointer;
  text-transform: uppercase;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--ghost {
    background: transparent;
    color: #fffcff;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}

@media (max-width: 1200px) {
  .categorias-toolbar {
    flex-wrap: wrap;
    gap: 10px;
    padding: 24px 16px 28px;
  }

  .categorias-search {
    flex: 1 1 auto;
    width: auto;
    max-width: none;
  }

  .categorias-cta {
    flex: 0 0 auto;
    width: auto;
    margin-left: 0;
  }

  .categorias-grid {
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
      font-size: 12px;
    }
  }
}
</style>
