<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import { getAgrupamentos, deleteAgrupamento, type IAgrupamento } from '@/services/http/agrupamentos'
import iconSearch from '@/assets/imgs/administradores/icon-search.svg'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconNewFolder from '@/assets/imgs/administradores/icon-new-folder.svg'
import iconEdit from '@/assets/imgs/administradores/icon-edit.svg'
import iconDelete from '@/assets/imgs/agrupamentos/delete.svg'

const router = useRouter()
const toast = useToast()

const searchFetching = ref(false)
const page = ref(1)
const pages = ref(0)
const agrupamentos = ref<IAgrupamento[]>([])
const noContent = ref(false)
const search = ref('')
const tipo = ref<'' | 'individual' | 'setor'>('')
const tipoOpen = ref(false)
const tipoFilterRef = ref<HTMLElement | null>(null)
const searchPlaceholder = ref('Pesquisar por ID, nome, e-mail e número de documento…')

const tipoOptions = [
  { value: '', label: 'Tipo' },
  { value: 'individual', label: 'Funcionário' },
  { value: 'setor', label: 'Setor' }
] as const

const tipoLabel = computed(
  () => tipoOptions.find((option) => option.value === tipo.value)?.label ?? 'Tipo'
)

let searchPlaceholderMql: MediaQueryList | null = null

function onDocumentClick(event: MouseEvent) {
  if (tipoFilterRef.value && !tipoFilterRef.value.contains(event.target as Node)) {
    tipoOpen.value = false
  }
}

function updateSearchPlaceholder() {
  searchPlaceholder.value = window.matchMedia('(max-width: 1200px)').matches
    ? 'Pesquisar…'
    : 'Pesquisar por ID, nome, e-mail e número de documento…'
}

onMounted(() => {
  searchPlaceholderMql = window.matchMedia('(max-width: 1200px)')
  updateSearchPlaceholder()
  searchPlaceholderMql.addEventListener('change', updateSearchPlaceholder)
  document.addEventListener('click', onDocumentClick)
  getData(page.value, search.value)
})

onUnmounted(() => {
  searchPlaceholderMql?.removeEventListener('change', updateSearchPlaceholder)
  document.removeEventListener('click', onDocumentClick)
})

async function getData(
  pageParam: number,
  likeParam: string = '',
  tipoParam: '' | 'individual' | 'setor' = tipo.value,
  showSearchLoader = false
) {
  try {
    if (showSearchLoader) searchFetching.value = true
    const { data } = await getAgrupamentos(pageParam, likeParam, undefined, tipoParam || undefined)
    pages.value = data.last_page
    agrupamentos.value = data.data
    noContent.value = data.data.length === 0
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar agrupamentos')
  } finally {
    if (showSearchLoader) searchFetching.value = false
  }
}

function searchData() {
  page.value = 1
  getData(page.value, search.value, tipo.value, true)
}

function onTipoChange() {
  page.value = 1
  getData(page.value, search.value)
}

function toggleTipoMenu() {
  tipoOpen.value = !tipoOpen.value
}

function selectTipo(value: '' | 'individual' | 'setor') {
  if (tipo.value !== value) {
    tipo.value = value
    onTipoChange()
  }
  tipoOpen.value = false
}

function onPageChange(newPage: number) {
  page.value = newPage
  getData(newPage, search.value)
}

function goToNovo() {
  router.push('/dashboard/agrupamentos/novo')
}

function goToEditar(id: string) {
  router.push(`/dashboard/agrupamentos/editar/${id}`)
}

async function handleDelete(id: string) {
  if (!confirm('Tem certeza que deseja excluir este agrupamento?')) return

  try {
    await deleteAgrupamento(id)
    toast.success('Agrupamento excluído com sucesso')
    getData(page.value, search.value)
  } catch (error) {
    console.error(error)
    toast.error('Erro ao excluir agrupamento')
  }
}

function getTipoBadgeLabel(itemTipo: IAgrupamento['tipo']): string {
  return itemTipo === 'individual' ? 'FUNCIONÁRIO' : 'SETOR'
}

function getMembrosInfo(item: IAgrupamento): string {
  if (item.tipo === 'individual') {
    const count = item.funcionarios_count ?? item.funcionarios?.length ?? 0
    return `${count} Funcionário${count === 1 ? '' : 's'}`
  }

  const count = item.setores_count ?? item.setores?.length ?? 0
  return `${count} Setor${count === 1 ? '' : 'es'}`
}
</script>

<template>
  <section class="agrup-page">
    <div class="agrup-page__heading">
      <button
        type="button"
        class="agrup-page__back"
        aria-label="Voltar para Home"
        @click="router.push('/dashboard/home')"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="agrup-page__title dashboard_title">AGRUPAMENTOS</h2>
    </div>

    <div class="agrup-panel">
      <form class="agrup-toolbar" @submit.prevent="searchData">
        <div class="agrup-toolbar__left">
          <label class="agrup-search">
            <button v-if="searchFetching" type="button" class="agrup-search__loader" aria-hidden="true" />
            <button v-else type="submit" class="agrup-search__btn" aria-label="Pesquisar">
              <img :src="iconSearch" width="18" height="18" alt="" />
            </button>
            <input
              v-model="search"
              type="text"
              :placeholder="searchPlaceholder"
            />
          </label>

          <div ref="tipoFilterRef" class="agrup-filter">
            <button
              type="button"
              class="agrup-filter__trigger"
              aria-haspopup="listbox"
              :aria-expanded="tipoOpen"
              @click.stop="toggleTipoMenu"
            >
              <span>{{ tipoLabel }}</span>
              <img
                class="agrup-filter__chevron"
                :class="{ 'agrup-filter__chevron--open': tipoOpen }"
                :src="iconChevronDown"
                width="16"
                height="9"
                alt=""
              />
            </button>

            <ul v-if="tipoOpen" class="agrup-filter__menu" role="listbox" aria-label="Filtrar por tipo">
              <li v-for="option in tipoOptions" :key="option.value || 'all'">
                <button
                  type="button"
                  class="agrup-filter__option"
                  role="option"
                  :aria-selected="tipo === option.value"
                  :class="{ 'is-active': tipo === option.value }"
                  @click="selectTipo(option.value)"
                >
                  {{ option.label }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <button type="button" class="agrup-cta" @click="goToNovo">
          <img :src="iconNewFolder" width="20" height="16" alt="" />
          <span>NOVO AGRUPAMENTO</span>
        </button>
      </form>

      <div class="agrup-scroll">
        <table class="agrup-grid">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Membros</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in agrupamentos" :key="item.id">
              <td :title="item.nome">{{ item.nome }}</td>
              <td>
                <span
                  class="agrup-badge"
                  :class="item.tipo === 'individual' ? 'agrup-badge--funcionario' : 'agrup-badge--setor'"
                >
                  {{ getTipoBadgeLabel(item.tipo) }}
                </span>
              </td>
              <td :title="getMembrosInfo(item)">{{ getMembrosInfo(item) }}</td>
              <td :title="item.descricao || 'n/a'">{{ item.descricao || 'n/a' }}</td>
              <td>
                <div class="agrup-actions">
                  <button
                    type="button"
                    class="agrup-action"
                    aria-label="Editar agrupamento"
                    @click="goToEditar(item.id)"
                  >
                    <img :src="iconEdit" width="18" height="18" alt="" />
                  </button>
                  <button
                    type="button"
                    class="agrup-action"
                    aria-label="Excluir agrupamento"
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

      <TableEmptyMessage :show="noContent" theme="night" class="agrup-empty" />
      <TablePaginator
        class="agrup-paginator"
        theme="night"
        :page-count="pages"
        :current-page="page"
        @page-change="onPageChange"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.agrup-page {
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

.agrup-panel {
  background: var(--night-surface, rgba(121, 121, 121, 0.25));
  border-radius: var(--night-radius, 30px);
  overflow: hidden;
}

.agrup-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding: 30px 38px 32px;
  flex-wrap: nowrap;

  &__left {
    display: contents;
  }
}

.agrup-search {
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

  &__btn,
  &__loader {
    flex-shrink: 0;
    border: none;
    background: transparent;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  &__loader {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(247, 247, 247, 0.3);
    border-top-color: #f7f7f7;
    border-radius: 50%;
    animation: agrup-spin 0.8s linear infinite;
    cursor: default;
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

.agrup-filter {
  position: relative;
  flex: 0 0 130px;
  width: 130px;
  height: 49px;
  z-index: 5;

  &__trigger {
    width: 100%;
    height: 100%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 0 14px;
    background: rgba(121, 121, 121, 0.3);
    border-radius: 30px;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
    color: #f7f7f7;
    cursor: pointer;

    &:hover {
      background: rgba(121, 121, 121, 0.4);
    }
  }

  &__chevron {
    flex-shrink: 0;
    transition: transform 0.2s ease;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 100%;
    margin: 0;
    padding: 6px;
    list-style: none;
    background: rgba(33, 33, 33, 0.96);
    border: 1px solid rgba(121, 121, 121, 0.45);
    border-radius: 16px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
    overflow: hidden;
  }

  &__option {
    width: 100%;
    border: none;
    background: transparent;
    text-align: center;
    padding: 10px 12px;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
    color: #f7f7f7;
    border-radius: 10px;
    cursor: pointer;

    &:hover {
      background: rgba(121, 121, 121, 0.35);
    }

    &.is-active {
      background: #ff00ff;
      color: #ffffff;
      font-weight: 400;
    }
  }
}

.agrup-cta {
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

.agrup-scroll {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.agrup-grid {
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

  td:nth-child(2) {
    overflow: hidden;
  }

  td:last-child {
    width: 96px;
    overflow: visible;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 17%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 15%;
    padding-right: 10px;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 14%;
    padding-left: 4px;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 34%;
  }

  th:nth-child(5),
  td:nth-child(5) {
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

    th:nth-child(2),
    td:nth-child(2) {
      padding-right: 8px;
    }

    th:nth-child(3),
    td:nth-child(3) {
      padding-left: 6px;
    }

    td {
      padding: 0 8px;
      font-size: 11px;
      height: 52px;
    }
  }
}

.agrup-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  max-width: 114px;
  min-width: 0;
  height: 26px;
  padding: 0 10px;
  border-radius: 30px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &--funcionario {
    background: #ffed82;
    color: #a8910a;
  }

  &--setor {
    background: #ffbdff;
    color: #de41de;
  }
}

.agrup-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.agrup-action {
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

.agrup-empty {
  width: 100%;
}

.agrup-paginator {
  width: 100%;
}

@keyframes agrup-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1200px) {
  .agrup-toolbar {
    flex-wrap: nowrap;
    gap: 10px;
    padding: 24px 16px 28px;

    &__left {
      display: flex;
      flex: 1;
      min-width: 0;
      align-items: center;
      gap: 10px;
    }
  }

  .agrup-search {
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

  .agrup-filter {
    flex: 0 0 100px;
    width: 100px;
    height: 44px;

    &__trigger {
      gap: 8px;
      padding: 0 10px;
      font-size: 12px;
    }

    &__chevron {
      width: 14px;
      height: 8px;
    }

    &__option {
      font-size: 12px;
      padding: 8px 10px;
    }
  }

  .agrup-cta {
    flex: 0 0 auto;
    min-width: 140px;
    height: 44px;
    margin-left: 0;
    padding: 0 12px;
    font-size: 12px;
    gap: 8px;
  }

  .agrup-badge {
    max-width: 100%;
    height: 22px;
    font-size: 9px;
    padding: 0 6px;
  }

  .agrup-action {
    width: 34px;
    height: 34px;

    img {
      width: 16px !important;
      height: 16px !important;
    }
  }

  .agrup-actions {
    gap: 6px;
  }
}
</style>
