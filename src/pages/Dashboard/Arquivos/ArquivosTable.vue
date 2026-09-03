<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
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
import iconGrid from '@/assets/imgs/arquivos/icon-grid.svg'
import iconList from '@/assets/imgs/arquivos/icon-list.svg'
import iconFolder from '@/assets/imgs/arquivos/folder.svg'
import iconOptions from '@/assets/imgs/arquivos/Opções.svg'
import iconUpload from '@/assets/imgs/arquivos/Upload.svg'
import iconDownloadBlack from '@/assets/imgs/arquivos/download-black.svg'
import iconDeleteBlack from '@/assets/imgs/arquivos/delete-black.svg'
import NightConfirmModal from '@/components/NightConfirmModal/NightConfirmModal.vue'
import { useNightConfirm } from '@/composables/useNightConfirm'

type ViewMode = 'list' | 'grid'

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
const arquivos = ref<IGetArquivosDataRes[]>([])
const noContent = ref(false)
const search = ref('')
const viewMode = ref<ViewMode>('list')
const selectedId = ref<string | null>(null)
const openMenuId = ref<string | null>(null)
const isMobile = ref(
  typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
)
const searchPlaceholder = ref('Pesquisar por ID, nome, e-mail e número de documento…')

const selectedArquivo = computed(() =>
  arquivos.value.find((item) => item.id === selectedId.value) ?? null
)

let searchPlaceholderMql: MediaQueryList | null = null
let searchPlaceholderTabletMql: MediaQueryList | null = null
let mobileMql: MediaQueryList | null = null

function updateSearchPlaceholder() {
  if (window.matchMedia('(max-width: 768px)').matches) {
    searchPlaceholder.value = 'Pesquisar…'
    return
  }
  if (window.matchMedia('(max-width: 1200px)').matches) {
    searchPlaceholder.value = 'Pesquisar por ID…'
    return
  }
  searchPlaceholder.value = 'Pesquisar por ID, nome, e-mail e número de documento…'
}

function updateIsMobile() {
  isMobile.value = window.matchMedia('(max-width: 768px)').matches
}

onMounted(() => {
  searchPlaceholderMql = window.matchMedia('(max-width: 1200px)')
  searchPlaceholderTabletMql = window.matchMedia('(max-width: 768px)')
  mobileMql = window.matchMedia('(max-width: 768px)')
  updateSearchPlaceholder()
  updateIsMobile()
  searchPlaceholderMql.addEventListener('change', updateSearchPlaceholder)
  searchPlaceholderTabletMql.addEventListener('change', updateSearchPlaceholder)
  mobileMql.addEventListener('change', updateIsMobile)
  document.addEventListener('click', closeTileMenu)
  getData(page.value, search.value)
})

onUnmounted(() => {
  searchPlaceholderMql?.removeEventListener('change', updateSearchPlaceholder)
  searchPlaceholderTabletMql?.removeEventListener('change', updateSearchPlaceholder)
  mobileMql?.removeEventListener('change', updateIsMobile)
  document.removeEventListener('click', closeTileMenu)
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
  const ok = await askConfirm({
    title: 'Excluir arquivo',
    body: 'Tem certeza que deseja excluir este arquivo?',
    confirmLabel: 'EXCLUIR',
    danger: true
  })
  if (!ok) return

  try {
    await deleteArquivo(id)
    toast.success('Arquivo excluído.')
    if (selectedId.value === id) selectedId.value = null
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

function setViewMode(mode: ViewMode) {
  viewMode.value = mode
  if (mode === 'list') {
    selectedId.value = null
  }
}

function toggleViewMode() {
  setViewMode(viewMode.value === 'list' ? 'grid' : 'list')
}

function handleBack() {
  if (viewMode.value === 'grid') {
    setViewMode('list')
    return
  }
  router.push('/dashboard/home')
}

function selectArquivo(id: string) {
  selectedId.value = id
  closeTileMenu()
}

function toggleTileMenu(id: string, event: Event) {
  event.stopPropagation()
  selectedId.value = id
  openMenuId.value = openMenuId.value === id ? null : id
}

function closeTileMenu() {
  openMenuId.value = null
}

function downloadArquivo(item: IGetArquivosDataRes) {
  closeTileMenu()
  openFile(item.url)
}

function deleteFromMenu(item: IGetArquivosDataRes) {
  closeTileMenu()
  void removeArquivo(item.id)
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${day}.${month}.${year}`
}

function getDisplayName(item: IGetArquivosDataRes): string {
  if (item.descricao) return item.descricao
  if (item.path) {
    const parts = item.path.split('/')
    return parts[parts.length - 1] || '—'
  }
  return '—'
}

function formatFileSize(bytes?: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes}b`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}kb`
  return `${(bytes / (1024 * 1024)).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}mb`
}

watch(viewMode, () => {
  closeTileMenu()
})
</script>

<template>
  <section class="arquivos-page" :class="{ 'arquivos-page--mobile': isMobile }">
    <div v-if="!isMobile" class="arquivos-page__heading">
      <div class="arquivos-page__heading-left">
        <button
          type="button"
          class="arquivos-page__back"
          :aria-label="viewMode === 'grid' ? 'Voltar para lista' : 'Voltar para Home'"
          @click="handleBack"
        >
          <img :src="iconChevronLeft" width="24" height="24" alt="" />
        </button>
        <h2 class="arquivos-page__title dashboard_title">ARQUIVOS</h2>
      </div>

      <button
        type="button"
        class="arquivos-page__view-btn"
        :aria-label="viewMode === 'list' ? 'Alternar para grade' : 'Alternar para lista'"
        @click="toggleViewMode"
      >
        <img
          :src="viewMode === 'list' ? iconGrid : iconList"
          :width="viewMode === 'list' ? 22 : 18"
          :height="viewMode === 'list' ? 14 : 12"
          alt=""
        />
      </button>
    </div>

    <div
      class="arquivos-panel"
      :class="{
        'arquivos-panel--grid': viewMode === 'grid',
        'arquivos-panel--grid-selected': viewMode === 'grid' && selectedArquivo
      }"
    >
      <form
        class="arquivos-toolbar"
        :class="{ 'arquivos-toolbar--grid': viewMode === 'grid' }"
        @submit.prevent="searchData"
      >
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

        <div class="arquivos-toolbar__actions">
          <button
            v-if="viewMode === 'grid'"
            type="button"
            class="arquivos-upload"
            @click="goToNovo"
          >
            <img :src="iconUpload" width="24" height="24" alt="" />
            <span>Fazer upload do arquivo</span>
          </button>

          <button
            type="button"
            class="arquivos-cta"
            :class="{ 'arquivos-cta--folder': viewMode === 'grid' }"
            @click="goToNovo"
          >
            <img :src="iconNewFolder" width="20" height="16" alt="" />
            <span>{{ viewMode === 'grid' ? 'NOVA PASTA' : 'NOVO CADASTRO' }}</span>
          </button>
        </div>
      </form>

      <!-- Mobile Figma: busca → botão à direita → grade/lista full width -->
      <div v-if="isMobile" class="arquivos-mobile-body">
        <div class="arquivos-mobile-body__toolbar">
          <button
            type="button"
            class="arquivos-page__view-btn arquivos-page__view-btn--mobile"
            :aria-label="viewMode === 'list' ? 'Alternar para grade' : 'Alternar para lista'"
            @click="toggleViewMode"
          >
            <img
              :src="viewMode === 'list' ? iconGrid : iconList"
              :width="viewMode === 'list' ? 22 : 18"
              :height="viewMode === 'list' ? 14 : 12"
              alt=""
            />
          </button>
        </div>

        <ul v-if="viewMode === 'list'" class="arquivos-mobile-list">
          <li v-for="item in arquivos" :key="item.id">
            <button
              type="button"
              class="arquivos-mobile-list__row"
              @click="openFile(item.url)"
            >
                <img
                  class="arquivos-mobile-list__icon"
                  :src="iconFolder"
                  width="30"
                  height="30"
                  alt=""
                />
              <span class="arquivos-mobile-list__name" :title="item.descricao">
                {{ item.descricao }}
              </span>
            </button>
          </li>
        </ul>

        <div v-else class="arquivos-grade__tiles arquivos-grade__tiles--mobile">
          <button
            v-for="item in arquivos"
            :key="item.id"
            type="button"
            class="arquivos-tile"
            :aria-label="item.descricao"
            @click="openFile(item.url)"
          >
            <span class="arquivos-tile__box">
              <img class="arquivos-tile__icon" :src="iconFolder" width="40" height="40" alt="" />
            </span>
            <span class="arquivos-tile__name" :title="item.descricao">{{ item.descricao }}</span>
          </button>
        </div>
      </div>

      <div v-if="viewMode === 'list' && !isMobile" class="arquivos-scroll">
        <table class="arquivos-grid arquivos-grid--desktop">
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

      <div v-if="viewMode === 'grid' && !isMobile" class="arquivos-grade__tiles">
        <div
          v-for="item in arquivos"
          :key="item.id"
          class="arquivos-tile"
          role="button"
          tabindex="0"
          :aria-label="`Selecionar ${item.descricao}`"
          @click="selectArquivo(item.id)"
          @keydown.enter="selectArquivo(item.id)"
        >
          <div
            class="arquivos-tile__box"
            :class="{ 'arquivos-tile__box--active': selectedId === item.id }"
          >
            <button
              type="button"
              class="arquivos-tile__options-btn"
              aria-label="Opções do arquivo"
              @click="toggleTileMenu(item.id, $event)"
            >
              <img :src="iconOptions" width="3" height="15" alt="" />
            </button>

            <div
              v-if="openMenuId === item.id"
              class="arquivos-tile__menu"
              @click.stop
            >
              <button
                type="button"
                class="arquivos-tile__menu-item"
                @click="downloadArquivo(item)"
              >
                <img :src="iconDownloadBlack" width="24" height="24" alt="" />
                <span>Baixar</span>
              </button>
              <button
                type="button"
                class="arquivos-tile__menu-item"
                @click="deleteFromMenu(item)"
              >
                <img :src="iconDeleteBlack" width="24" height="24" alt="" />
                <span>Apagar</span>
              </button>
            </div>

            <img class="arquivos-tile__icon" :src="iconFolder" width="40" height="40" alt="" />
          </div>

          <span class="arquivos-tile__name" :title="item.descricao">{{ item.descricao }}</span>
        </div>
      </div>

      <aside v-if="viewMode === 'grid' && selectedArquivo && !isMobile" class="arquivos-grade__sidebar">
        <h3 class="arquivos-grade__sidebar-title">informações</h3>

        <div class="arquivos-grade__info">
          <p class="arquivos-grade__info-line">
            <strong>Nome</strong>
            {{ getDisplayName(selectedArquivo) }}
          </p>
          <p class="arquivos-grade__info-line">
            <strong>Empresa</strong>
            {{ getEmpresaName(selectedArquivo) }}
          </p>
          <p class="arquivos-grade__info-line">
            <strong>CPF/CNPJ</strong>
            {{ getEmpresaCnpj(selectedArquivo) }}
          </p>
          <p class="arquivos-grade__info-line">
            <strong>Data de inclusão</strong>
            {{ formatDate(selectedArquivo.created_at) }}
          </p>
          <p class="arquivos-grade__info-line">
            <strong>Tamanho total</strong>
            {{ formatFileSize(selectedArquivo.tamanho_bytes) }}
          </p>
        </div>
      </aside>

      <TableEmptyMessage :show="noContent" theme="night" class="arquivos-empty" />
      <TablePaginator
        class="arquivos-paginator"
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
.arquivos-page {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: clip;

  &__heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 42px;
  }

  &__heading-left {
    display: flex;
    align-items: center;
    gap: 1px;
    min-width: 0;
  }

  &__view-btn {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    margin-top: 5px; /* Figma: top 63px = padding 58px + 5px */
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    transition: opacity 0.15s ease;

    &:hover {
      opacity: 0.85;
    }
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
  overflow-x: clip;
  overflow-y: visible;
  max-width: 100%;

  &--grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto;
    min-height: auto;
    padding-right: 0;
    box-sizing: border-box;

    .arquivos-toolbar {
      grid-column: 1;
      grid-row: 1;
      min-width: 0;
      padding: 30px 38px 24px 38px;
      flex-wrap: wrap;
      row-gap: 12px;
    }

    .arquivos-search {
      flex: 1 1 180px;
      width: auto;
      max-width: 518px;
      min-width: 0;
    }

    .arquivos-toolbar__actions {
      flex-shrink: 0;
    }

    .arquivos-grade__tiles {
      grid-column: 1;
      grid-row: 2;
      min-width: 0;
      padding: 0 38px 32px 38px;
      min-height: 0;
      align-self: start;
    }

    .arquivos-empty {
      grid-column: 1;
      grid-row: 2;
    }
  }

  &--grid-selected {
    grid-template-columns: minmax(0, 1fr) 320px;
    column-gap: 0;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      'toolbar sidebar'
      'tiles sidebar'
      'paginator sidebar';
    align-items: stretch;

    .arquivos-toolbar {
      grid-area: toolbar;
      padding: 30px 24px 16px 38px;
      flex-wrap: wrap;
      row-gap: 12px;
      min-width: 0;
    }

    .arquivos-search {
      flex: 1 1 180px;
      width: auto;
      max-width: none;
      min-width: 0;
    }

    .arquivos-toolbar__actions {
      flex-shrink: 0;
      margin-left: auto;
    }

    .arquivos-grade__tiles {
      grid-area: tiles;
      padding: 0 24px 16px 38px;
      min-width: 0;
      margin-top: 0;
      align-self: start;
    }

    .arquivos-grade__sidebar {
      grid-area: sidebar;
      align-self: stretch;
      flex: unset;
      width: 100%;
      min-width: 0;
      max-width: none;
      height: auto;
      min-height: 0;
      margin: 0;
      box-sizing: border-box;
      border-radius: 0;
      border-top-right-radius: var(--night-radius, 30px);
      border-bottom-right-radius: var(--night-radius, 30px);
    }

    .arquivos-paginator {
      grid-area: paginator;
      padding: 0 24px 24px 38px;
      box-sizing: border-box;
    }

    .arquivos-empty {
      grid-area: tiles;
    }
  }
}

.arquivos-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding: 30px 38px 32px;
  flex-wrap: wrap;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;

  &__actions {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-left: auto;
    flex-shrink: 0;
  }
}

.arquivos-search {
  flex: 1 1 180px;
  width: auto;
  max-width: 518px;
  min-width: 0;
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

.arquivos-upload {
  flex: 0 0 auto;
  height: 49px;
  max-width: 100%;
  padding: 0 20px;
  border: 3px solid #f7f7f7;
  border-radius: 30px;
  background: rgba(121, 121, 121, 0.3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  white-space: nowrap;
  min-width: 0;

  span {
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    color: #f7f7f7;
    text-transform: uppercase;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  &:hover {
    opacity: 0.9;
  }
}

.arquivos-cta {
  flex: 0 0 223px;
  width: 223px;
  height: 46px;
  margin-left: 0;
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

  &--folder {
    flex: 0 0 187px;
    width: 187px;
  }
}

.arquivos-grade {
  &__tiles {
    flex: 1;
    min-width: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, 110px);
    gap: 16px;
    align-content: start;
    padding: 0;
    overflow-x: clip;
    overflow-y: visible;
  }

  &__sidebar {
    flex: unset;
    width: 100%;
    min-width: 0;
    min-height: 0;
    padding: 28px 24px 32px;
    border-radius: 29px;
    background: rgba(121, 121, 121, 0.3);
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
  }

  &__sidebar-title {
    margin: 0;
    font-family: 'Source Code Pro', monospace;
    font-size: 20px;
    font-weight: 400;
    line-height: 1;
    color: #f7f7f7;
    opacity: 0.7;
    text-transform: uppercase;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex: 1;
    min-height: 0;
    overflow-y: visible;
  }

  &__info-line {
    margin: 0;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.28;
    color: #ffffff;
    word-break: break-word;

    strong {
      display: block;
      font-weight: 700;
      margin-bottom: 2px;
    }
  }

  &__empty-info {
    margin: 0;
    flex: 1;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    color: #f7f7f7;
    opacity: 0.6;
  }
}

.arquivos-tile {
  position: relative;
  width: 110px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;

  &__box {
    position: relative;
    width: 110px;
    height: 94px;
    border-radius: 15px;
    background: rgba(121, 121, 121, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease, outline 0.15s ease;

    &--active {
      background: rgba(121, 121, 121, 0.5);
      outline: 2px solid rgba(247, 247, 247, 0.35);
    }
  }

  &:hover &__box {
    background: rgba(121, 121, 121, 0.45);
  }

  &:hover &__box--active {
    background: rgba(121, 121, 121, 0.5);
  }

  &__options-btn {
    position: absolute;
    top: 13px;
    right: 10px;
    z-index: 2;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    img {
      width: 3px;
      height: 15px;
      flex-shrink: 0;
    }

    &:hover {
      opacity: 0.85;
    }
  }

  &__menu {
    position: absolute;
    top: 28px;
    right: 0;
    left: auto;
    z-index: 20;
    width: 123px;
    min-height: 95px;
    padding: 16px 14px;
    border-radius: 13px;
    background: #d9d9d9;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }

  &__menu-item {
    border: none;
    background: transparent;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 13px;
    width: 100%;
    cursor: pointer;
    padding: 0;

    img {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
    }

    span {
      font-family: 'Source Code Pro', monospace;
      font-size: 14px;
      font-weight: 400;
      line-height: 18px;
      color: #212121;
      white-space: nowrap;
    }

    &:hover {
      opacity: 0.85;
    }
  }

  &__icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    opacity: 0.7;
    pointer-events: none;
  }

  &__name {
    width: 110px;
    max-width: 100%;
    min-height: 18px;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0;
    color: #ffffff;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
  }
}

.arquivos-scroll {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  .arquivos-grid {
    min-width: 640px;
  }
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

@media (min-width: 769px) and (max-width: 1200px) {
  .arquivos-page__heading {
    margin-bottom: 24px;
  }

  .arquivos-panel--grid {
    .arquivos-toolbar {
      padding: 20px 16px 14px;
    }

    .arquivos-grade__tiles {
      padding: 0 16px 20px;
    }
  }

  /* Grade em tablet (~1024px): busca em cima, botões embaixo */
  .arquivos-panel--grid .arquivos-toolbar {
    flex-wrap: wrap;
    align-items: stretch;
    gap: 12px;
  }

  .arquivos-panel--grid .arquivos-search {
    flex: 1 1 100%;
    width: 100%;
    max-width: none;
    min-width: 0;
    height: 44px;
    padding: 0 14px;

    input {
      font-size: 12px;
    }
  }

  .arquivos-panel--grid .arquivos-toolbar__actions {
    flex: 1 1 100%;
    width: 100%;
    margin-left: 0;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 10px;
  }

  .arquivos-panel--grid-selected {
    grid-template-columns: minmax(0, 1fr) 260px;
    column-gap: 0;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      'toolbar sidebar'
      'tiles sidebar'
      'paginator sidebar';
    align-items: stretch;

    .arquivos-toolbar {
      grid-area: toolbar;
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
      padding: 20px 16px 12px 16px;
    }

    .arquivos-search {
      flex: none;
      width: 100%;
      max-width: none;
      min-width: 0;
    }

    .arquivos-toolbar__actions {
      flex: none;
      width: 100%;
      margin-left: 0;
      justify-content: flex-start;
      gap: 10px;
    }

    .arquivos-grade__tiles {
      grid-area: tiles;
      padding: 0 16px 12px 16px;
      margin-top: 0;
      align-self: start;
    }

    .arquivos-grade__sidebar {
      grid-area: sidebar;
      align-self: stretch;
      flex: unset;
      width: 100%;
      min-width: 0;
      max-width: none;
      height: auto;
      min-height: 0;
      margin: 0;
      padding: 20px 16px 24px;
      border-radius: 0;
      border-top-right-radius: var(--night-radius, 30px);
      border-bottom-right-radius: var(--night-radius, 30px);
    }

    .arquivos-paginator {
      grid-area: paginator;
      padding: 0 16px 16px 16px;
    }

    .arquivos-upload {
      flex: 1 1 auto;
      width: auto;
      max-width: none;
      min-width: 0;
      height: 44px;
      padding: 0 14px;

      span {
        font-size: 11px;
      }
    }

    .arquivos-cta--folder {
      flex: 0 0 auto;
      width: auto;
      min-width: 0;
      height: 44px;
      padding: 0 14px;
      font-size: 12px;
    }
  }

  .arquivos-grade__tiles {
    grid-template-columns: repeat(auto-fill, minmax(100px, 110px));
    gap: 12px;
  }

  .arquivos-grade__sidebar-title {
    font-size: 18px;
  }

  .arquivos-grade__info-line {
    font-size: 13px;
  }
}

@media (max-width: 1500px) {
  .arquivos-panel--grid,
  .arquivos-panel--grid-selected {
    min-height: auto;
  }
}

@media (max-width: 1200px) {
  .arquivos-panel--grid:not(.arquivos-panel--grid-selected) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    min-height: auto;
    padding-right: 0;

    .arquivos-toolbar {
      grid-column: 1;
      grid-row: 1;
      padding: 24px 16px 20px;
    }

    .arquivos-grade__tiles {
      grid-column: 1;
      grid-row: 2;
      padding: 0 16px 24px;
    }

    .arquivos-empty {
      grid-column: 1;
      grid-row: 2;
    }
  }

  .arquivos-panel--grid.arquivos-panel--grid-selected {
    .arquivos-toolbar {
      padding-bottom: 12px;
    }

    .arquivos-grade__tiles {
      padding-top: 0;
    }
  }

  .arquivos-grade__tiles {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  }

  .arquivos-cta--folder {
    min-width: 140px;
    width: auto;
    flex: 0 0 auto;
  }

  .arquivos-panel--grid:not(.arquivos-panel--grid-selected) .arquivos-toolbar {
    flex-wrap: wrap;
    gap: 12px;
    padding: 24px 16px 28px;
  }

  .arquivos-panel--grid .arquivos-search {
    flex: 1 1 100%;
    width: 100%;
    max-width: none;
    min-width: 0;
    height: 44px;
    padding: 0 14px;

    input {
      font-size: 12px;
    }
  }

  .arquivos-panel--grid .arquivos-toolbar__actions {
    flex: 1 1 100%;
    width: 100%;
    margin-left: 0;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 10px;
  }

  .arquivos-upload {
    height: 44px;
    padding: 0 12px;
    gap: 8px;

    span {
      font-size: 11px;
    }

    img {
      width: 18px !important;
      height: 18px !important;
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

@media (max-width: 768px) {
  /* Padding vem do ArquivosPage (18px) — não duplicar */
  .arquivos-page--mobile {
    padding-left: 0;
    padding-right: 0;
    box-sizing: border-box;
  }

  /* Figma: lista e grade iguais — sem card, fundo #212121 */
  .arquivos-panel,
  .arquivos-panel--grid,
  .arquivos-panel--grid-selected {
    background: transparent !important;
    border-radius: 0 !important;
    display: block !important;
    grid-template-columns: none !important;
    min-height: 0 !important;
    padding: 0 !important;
  }

  .arquivos-toolbar,
  .arquivos-panel--grid .arquivos-toolbar,
  .arquivos-panel--grid:not(.arquivos-panel--grid-selected) .arquivos-toolbar,
  .arquivos-panel--grid-selected .arquivos-toolbar {
    padding: 0 0 10px !important;
    margin: 0 !important;
    flex-wrap: nowrap !important;
    align-items: center;
    gap: 0 !important;
  }

  /* Figma Rectangle 1: 358×49, r30, #797979 30% — mesma busca nos 2 modos */
  .arquivos-search,
  .arquivos-panel--grid .arquivos-search,
  .arquivos-panel--grid-selected .arquivos-search {
    flex: 1 1 100% !important;
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
    height: 49px !important;
    padding: 0 18px !important;
    background: rgba(121, 121, 121, 0.3) !important;
    border-radius: 30px !important;
    gap: 14px !important;
    box-sizing: border-box;

    input {
      font-family: 'Source Code Pro', monospace !important;
      font-size: 14px !important;
      font-weight: 300 !important;
      line-height: 1 !important;
      color: #f7f7f7 !important;

      &::placeholder {
        color: #f7f7f7 !important;
        opacity: 1 !important;
      }
    }
  }

  .arquivos-toolbar__actions,
  .arquivos-panel--grid .arquivos-toolbar__actions,
  .arquivos-panel--grid-selected .arquivos-toolbar__actions {
    display: none !important;
  }

  .arquivos-grade__sidebar,
  .arquivos-paginator {
    display: none !important;
  }

  .arquivos-mobile-body {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0;
  }

  .arquivos-mobile-body__toolbar {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-bottom: 14px;
  }

  /* Figma Botão galeria/lista: 50×50 */
  .arquivos-page__view-btn--mobile {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    margin-top: 0;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
  }

  /* Figma lista: pasta 30×30 70%, texto 16px / 400 / #FFF */
  .arquivos-mobile-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 18px;

    &__row {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 0;
      border: none;
      background: transparent;
      cursor: pointer;
      text-align: left;
      min-height: 30px;
    }

    &__icon {
      flex-shrink: 0;
      width: 30px;
      height: 30px;
      opacity: 0.7;
    }

    &__name {
      min-width: 0;
      font-family: 'Source Code Pro', monospace;
      font-size: 16px;
      font-weight: 400;
      line-height: 1;
      color: #ffffff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  /* Figma grade: 3× tile 110×94 r15 #797979 30%, pasta 40×40 70% */
  .arquivos-grade__tiles--mobile {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px 14px;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  .arquivos-tile {
    width: 100%;
    max-width: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    text-align: left;

    &__box {
      width: 100%;
      height: auto;
      aspect-ratio: 110 / 94;
      border-radius: 15px;
      background: rgba(121, 121, 121, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
    }

    &__icon {
      width: 40px;
      height: 40px;
      opacity: 0.7;
      pointer-events: none;
      flex-shrink: 0;
    }

    &__name {
      width: 100%;
      max-width: 100%;
      min-height: 18px;
      font-family: 'Source Code Pro', monospace;
      font-size: 14px;
      font-weight: 400;
      line-height: 18px;
      color: #ffffff;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__options-btn,
    &__menu {
      display: none;
    }
  }
}

@media (max-width: 480px) {
  .arquivos-grade__tiles--mobile {
    gap: 14px 12px;
  }
}
</style>
