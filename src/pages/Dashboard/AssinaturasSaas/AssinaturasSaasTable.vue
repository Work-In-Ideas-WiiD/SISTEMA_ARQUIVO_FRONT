<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import TableEmptyMessage from '@/components/TableEmptyMessage/TableEmptyMessage.vue'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import {
  getAssinaturasSaas,
  labelStatusAssinatura,
  type IAssinaturaSaas
} from '@/services/http/assinaturasSaas'
import { getPlanos, type IPlano } from '@/services/http/planos'
import { getApiErrorMessage } from '@/utils/apiError'
import { useDebouncedSearch } from '@/composables/useDebouncedSearch'
import iconSearch from '@/assets/imgs/administradores/icon-search.svg'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'
import iconView from '@/assets/imgs/clientes/icon-view.svg'

const router = useRouter()
const toast = useToast()

const fetching = ref(false)
const page = ref(1)
const pages = ref(0)
const itens = ref<IAssinaturaSaas[]>([])
const noContent = ref(false)
const search = ref('')
const status = ref('')
const planoId = ref('')
const criadoDe = ref('')
const criadoAte = ref('')
const proximaDe = ref('')
const proximaAte = ref('')
const planos = ref<IPlano[]>([])

const statusOpen = ref(false)
const planoOpen = ref(false)
const statusFilterRef = ref<HTMLElement | null>(null)
const planoFilterRef = ref<HTMLElement | null>(null)

const statusOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'ativa', label: 'Ativa' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'inadimplente', label: 'Inadimplente' },
  { value: 'suspensa', label: 'Suspensa' },
  { value: 'cancelada', label: 'Cancelada' },
  { value: 'expirada', label: 'Expirada' },
  { value: 'pendente_acao', label: 'Pendente ação' }
]

const statusLabel = computed(
  () => statusOptions.find((option) => option.value === status.value)?.label ?? 'Todos os status'
)

const planoLabel = computed(() => {
  if (!planoId.value) return 'Todos os planos'
  return planos.value.find((p) => p.id === planoId.value)?.nome ?? 'Todos os planos'
})

function onDocumentClick(event: MouseEvent) {
  if (statusFilterRef.value && !statusFilterRef.value.contains(event.target as Node)) {
    statusOpen.value = false
  }
  if (planoFilterRef.value && !planoFilterRef.value.contains(event.target as Node)) {
    planoOpen.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', onDocumentClick)
  await loadPlanos()
  getData(page.value)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})

async function loadPlanos() {
  try {
    const { data } = await getPlanos(1, '')
    planos.value = data.data || []
  } catch (error) {
    console.error(error)
  }
}

function filters() {
  return {
    like: search.value,
    status: status.value,
    plano_id: planoId.value,
    criado_de: criadoDe.value,
    criado_ate: criadoAte.value,
    proxima_cobranca_de: proximaDe.value,
    proxima_cobranca_ate: proximaAte.value
  }
}

async function getData(pageParam: number) {
  try {
    fetching.value = true
    const { data } = await getAssinaturasSaas(pageParam, filters())
    pages.value = data.last_page
    itens.value = data.data
    noContent.value = data.data.length === 0
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Erro ao carregar assinaturas'))
  } finally {
    fetching.value = false
  }
}

function searchData() {
  debouncedSearch.flush()
  page.value = 1
  getData(1)
}

function onSearchInput() {
  debouncedSearch.schedule()
}

const debouncedSearch = useDebouncedSearch(() => {
  page.value = 1
  getData(1)
})

function limparFiltros() {
  search.value = ''
  status.value = ''
  planoId.value = ''
  criadoDe.value = ''
  criadoAte.value = ''
  proximaDe.value = ''
  proximaAte.value = ''
  searchData()
}

function toggleStatusMenu() {
  planoOpen.value = false
  statusOpen.value = !statusOpen.value
}

function togglePlanoMenu() {
  statusOpen.value = false
  planoOpen.value = !planoOpen.value
}

function selectStatus(value: string) {
  status.value = value
  statusOpen.value = false
  searchData()
}

function selectPlano(id: string) {
  planoId.value = id
  planoOpen.value = false
  searchData()
}

function onDateChange() {
  searchData()
}

function onPageChange(newPage: number) {
  page.value = newPage
  getData(newPage)
}

function goToVisualizar(id: string) {
  router.push(`/dashboard/assinaturas-saas/${id}`)
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('pt-BR')
}

function formatBRL(centavos?: number) {
  if (centavos === undefined || centavos === null) return '—'
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function statusClass(s?: string) {
  return s || 'desconhecido'
}
</script>

<template>
  <section class="saas-page">
    <div class="saas-page__heading">
      <button
        type="button"
        class="saas-page__back"
        aria-label="Voltar para Home"
        @click="router.push('/dashboard/home')"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="saas-page__title dashboard_title">ASSINATURAS SAAS</h2>
    </div>

    <div class="saas-panel">
      <form class="saas-toolbar" @submit.prevent="searchData">
        <div class="saas-toolbar__top">
          <label class="saas-search">
            <button type="submit" class="saas-search__btn" aria-label="Pesquisar">
              <img :src="iconSearch" width="18" height="18" alt="" />
            </button>
            <input
              v-model="search"
              type="text"
              placeholder="Buscar cliente, e-mail, CPF/CNPJ…"
              @input="onSearchInput"
            />
          </label>

          <div ref="statusFilterRef" class="saas-filter saas-filter--status">
            <button
              type="button"
              class="saas-filter__trigger"
              aria-haspopup="listbox"
              :aria-expanded="statusOpen"
              @click.stop="toggleStatusMenu"
            >
              <span>{{ statusLabel }}</span>
              <img
                class="saas-filter__chevron"
                :class="{ 'saas-filter__chevron--open': statusOpen }"
                :src="iconChevronDown"
                width="16"
                height="9"
                alt=""
              />
            </button>
            <ul v-if="statusOpen" class="saas-filter__menu" role="listbox" aria-label="Filtrar por status">
              <li v-for="option in statusOptions" :key="option.value || 'all'">
                <button
                  type="button"
                  class="saas-filter__option"
                  role="option"
                  :aria-selected="status === option.value"
                  :class="{ 'is-active': status === option.value }"
                  @click="selectStatus(option.value)"
                >
                  {{ option.label }}
                </button>
              </li>
            </ul>
          </div>

          <div ref="planoFilterRef" class="saas-filter saas-filter--plano">
            <button
              type="button"
              class="saas-filter__trigger"
              aria-haspopup="listbox"
              :aria-expanded="planoOpen"
              @click.stop="togglePlanoMenu"
            >
              <span>{{ planoLabel }}</span>
              <img
                class="saas-filter__chevron"
                :class="{ 'saas-filter__chevron--open': planoOpen }"
                :src="iconChevronDown"
                width="16"
                height="9"
                alt=""
              />
            </button>
            <ul v-if="planoOpen" class="saas-filter__menu" role="listbox" aria-label="Filtrar por plano">
              <li>
                <button
                  type="button"
                  class="saas-filter__option"
                  role="option"
                  :aria-selected="!planoId"
                  :class="{ 'is-active': !planoId }"
                  @click="selectPlano('')"
                >
                  Todos os planos
                </button>
              </li>
              <li v-for="p in planos" :key="p.id">
                <button
                  type="button"
                  class="saas-filter__option"
                  role="option"
                  :aria-selected="planoId === p.id"
                  :class="{ 'is-active': planoId === p.id }"
                  @click="selectPlano(p.id)"
                >
                  {{ p.nome }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div class="saas-toolbar__dates">
          <label class="saas-date">
            <span class="saas-date__label">Criado de</span>
            <input
              v-model="criadoDe"
              type="date"
              class="saas-date__input"
              @change="onDateChange"
            />
          </label>
          <label class="saas-date">
            <span class="saas-date__label">Criado até</span>
            <input
              v-model="criadoAte"
              type="date"
              class="saas-date__input"
              @change="onDateChange"
            />
          </label>
          <label class="saas-date">
            <span class="saas-date__label">Próx. cob. de</span>
            <input
              v-model="proximaDe"
              type="date"
              class="saas-date__input"
              @change="onDateChange"
            />
          </label>
          <label class="saas-date">
            <span class="saas-date__label">Próx. cob. até</span>
            <input
              v-model="proximaAte"
              type="date"
              class="saas-date__input"
              @change="onDateChange"
            />
          </label>

          <div class="saas-toolbar__actions">
            <button type="button" class="saas-btn saas-btn--ghost" @click="limparFiltros">
              LIMPAR
            </button>
          </div>
        </div>
      </form>

      <div class="saas-scroll">
        <table class="saas-grid">
          <thead>
            <tr>
              <th>Cliente / Conta</th>
              <th>Plano</th>
              <th>Status</th>
              <th>Criação</th>
              <th>Próxima cobrança</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in itens" :key="item.id">
              <td :title="item.conta?.nome || '—'">{{ item.conta?.nome || '—' }}</td>
              <td>
                <div class="saas-plano" :title="item.plano?.nome || '—'">
                  <span>{{ item.plano?.nome || '—' }}</span>
                  <small>{{ formatBRL(item.plano?.valor_mensal_centavos) }}</small>
                </div>
              </td>
              <td>
                <span class="saas-status" :class="`saas-status--${statusClass(item.status)}`">
                  {{ labelStatusAssinatura(item.status) }}
                </span>
              </td>
              <td :title="formatDate(item.created_at)">{{ formatDate(item.created_at) }}</td>
              <td :title="formatDate(item.proxima_cobranca_em)">
                {{ formatDate(item.proxima_cobranca_em) }}
              </td>
              <td>
                <div class="saas-actions">
                  <button
                    type="button"
                    class="saas-action"
                    aria-label="Visualizar assinatura"
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

      <TableEmptyMessage :show="noContent" theme="night" class="saas-empty" />
      <TablePaginator
        class="saas-paginator"
        theme="night"
        :page-count="pages"
        :current-page="page"
        @page-change="onPageChange"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.saas-page {
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

.saas-panel {
  background: var(--night-surface, rgba(121, 121, 121, 0.25));
  border-radius: var(--night-radius, 30px);
  overflow: hidden;
}

.saas-toolbar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 30px 38px 28px;

  &__top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  &__dates {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 12px;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
  }
}

.saas-search {
  flex: 1 1 320px;
  min-width: 220px;
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

.saas-filter {
  position: relative;
  flex: 0 0 auto;
  height: 49px;
  z-index: 5;

  &--status {
    width: 180px;
  }

  &--plano {
    width: 180px;
  }

  &__trigger {
    width: 100%;
    height: 100%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 0 16px;
    background: rgba(121, 121, 121, 0.3);
    border-radius: 30px;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
    color: #f7f7f7;
    cursor: pointer;
    text-align: left;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

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
    width: max(100%, 200px);
    max-height: 260px;
    margin: 0;
    padding: 10px;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow-y: auto;
    background: rgba(33, 33, 33, 0.96);
    border: 1px solid rgba(121, 121, 121, 0.45);
    border-radius: 16px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
    box-sizing: border-box;
    z-index: 10;
  }

  &__option {
    width: 100%;
    border: none;
    background: transparent;
    text-align: left;
    padding: 10px 12px;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.2;
    color: #f7f7f7;
    border-radius: 10px;
    cursor: pointer;
    white-space: nowrap;

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

.saas-date {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 150px;

  &__label {
    padding-left: 12px;
    font-family: 'Source Code Pro', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #f7f7f7;
    opacity: 0.7;
    text-transform: uppercase;
  }

  &__input {
    height: 44px;
    padding: 0 14px;
    border: none;
    border-radius: 30px;
    background: rgba(121, 121, 121, 0.3);
    color: #ffffff;
    font-family: 'Source Code Pro', monospace;
    font-size: 13px;
    outline: none;
    color-scheme: dark;

    &::-webkit-calendar-picker-indicator {
      filter: invert(1);
      opacity: 0.7;
      cursor: pointer;
    }
  }
}

.saas-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  min-width: 110px;
  padding: 0 20px;
  border-radius: 30px;
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;

  &--ghost {
    border: 1px solid rgba(247, 247, 247, 0.7);
    background: transparent;
    color: #ffffff;

    &:hover {
      opacity: 0.85;
    }
  }
}

.saas-scroll {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.saas-grid {
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
    overflow: visible;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 22%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 20%;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 16%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 14%;
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 16%;
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

.saas-plano {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    font-size: 12px;
    opacity: 0.65;
    line-height: 1;
  }
}

.saas-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;

  &--ativa {
    background: rgba(76, 175, 80, 0.25);
    color: #8ee99a;
  }

  &--pendente,
  &--pendente_acao {
    background: rgba(255, 193, 7, 0.25);
    color: #ffd666;
  }

  &--inadimplente {
    background: rgba(220, 53, 69, 0.25);
    color: #ff8a96;
  }

  &--suspensa {
    background: rgba(121, 121, 121, 0.4);
    color: rgba(247, 247, 247, 0.8);
  }

  &--cancelada,
  &--expirada,
  &--desconhecido {
    background: rgba(121, 121, 121, 0.35);
    color: rgba(247, 247, 247, 0.65);
  }
}

.saas-actions {
  display: flex;
  align-items: center;
  justify-content: center;
}

.saas-action {
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

.saas-empty,
.saas-paginator {
  width: 100%;
}

@media (max-width: 1200px) {
  .saas-toolbar {
    padding: 24px 16px 24px;
  }

  .saas-search {
    flex: 1 1 100%;
    max-width: none;
    height: 44px;
  }

  .saas-filter {
    height: 44px;

    &--status,
    &--plano {
      width: calc(50% - 6px);
      flex: 1 1 calc(50% - 6px);
    }

    &__trigger {
      font-size: 12px;
      padding: 0 12px;
    }
  }

  .saas-date {
    min-width: calc(50% - 6px);
    flex: 1 1 calc(50% - 6px);
  }

  .saas-toolbar__actions {
    width: 100%;
    margin-left: 0;
    justify-content: stretch;

    .saas-btn {
      flex: 1;
    }
  }

  .saas-action {
    width: 34px;
    height: 34px;

    img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
