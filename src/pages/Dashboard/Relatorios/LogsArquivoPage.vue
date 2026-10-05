<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import {
  ACOES_LOG_ARQUIVO,
  getLogsArquivo,
  type ILogArquivo
} from '@/services/http/relatorios'
import { getApiErrorMessage } from '@/utils/apiError'
import { useDebouncedSearch } from '@/composables/useDebouncedSearch'
import TablePaginator from '@/components/TablePaginator/TablePaginator.vue'
import iconSearch from '@/assets/imgs/administradores/icon-search.svg'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const logs = ref<ILogArquivo[]>([])
const page = ref(1)
const lastPage = ref(1)
const total = ref(0)
const carregando = ref(true)
const busca = ref('')
const acao = ref('')
const de = ref('')
const ate = ref('')

const permitido = computed(() => authStore.userRole === 'administrador' || authStore.userRole === 'empresa')

const ROTULOS = Object.fromEntries(ACOES_LOG_ARQUIVO.map((a) => [a.value, a.label]))
const TIPOS: Record<ILogArquivo['alvo'], string> = { arquivo: 'Arquivo', pasta: 'Pasta', lixeira: 'Lixeira' }

function rotuloAcao(log: ILogArquivo): string {
  return ROTULOS[log.acao] || log.acao
}

function classeAcao(log: ILogArquivo): string {
  if (['excluiu', 'excluiu_definitivo', 'esvaziou_lixeira'].includes(log.acao)) return 'is-perigo'
  if (['visualizou', 'link_externo'].includes(log.acao)) return 'is-leitura'
  if (['enviou', 'restaurou'].includes(log.acao)) return 'is-positivo'
  return ''
}

function formatarData(iso: string): { dia: string; hora: string } {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { dia: '—', hora: '' }
  return {
    dia: d.toLocaleDateString('pt-BR'),
    hora: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }
}

async function carregar() {
  if (!permitido.value) return
  carregando.value = true
  try {
    const { data } = await getLogsArquivo(page.value, {
      like: busca.value.trim(),
      acao: acao.value,
      de: de.value,
      ate: ate.value
    })
    logs.value = data.data
    lastPage.value = data.last_page
    total.value = data.total
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar os logs'))
    logs.value = []
  } finally {
    carregando.value = false
  }
}

const debouncedSearch = useDebouncedSearch(() => {
  page.value = 1
  void carregar()
})

function mudarPagina(p: number) {
  page.value = p
  void carregar()
}

function limparFiltros() {
  busca.value = ''
  acao.value = ''
  de.value = ''
  ate.value = ''
}

watch([acao, de, ate], () => {
  page.value = 1
  void carregar()
})

watch(
  () => authStore.userRole,
  (role) => {
    if (role && !permitido.value) router.replace('/dashboard/arquivos')
  },
  { immediate: true }
)

onMounted(carregar)
</script>

<template>
  <main class="logs dashboard_padding">
    <div class="logs__heading">
      <button type="button" class="logs__back" aria-label="Voltar" @click="router.push('/dashboard/arquivos')">
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <div>
        <p class="logs__secao">Relatórios</p>
        <h2 class="logs__title dashboard_title">LOGS DE ARQUIVO</h2>
      </div>
    </div>

    <div class="logs__panel">
      <form class="logs__toolbar" @submit.prevent="debouncedSearch.flush()">
        <label class="logs__search">
          <button type="submit" class="logs__search-btn" aria-label="Pesquisar">
            <img :src="iconSearch" width="18" height="18" alt="" />
          </button>
          <input
            v-model="busca"
            type="text"
            placeholder="Pesquisar por arquivo, pessoa ou e-mail…"
            @input="debouncedSearch.schedule()"
          />
        </label>

        <select v-model="acao" class="logs__campo" aria-label="Ação">
          <option value="">Todas as ações</option>
          <option v-for="a in ACOES_LOG_ARQUIVO" :key="a.value" :value="a.value">{{ a.label }}</option>
        </select>

        <label class="logs__data">
          <span>De</span>
          <input v-model="de" type="date" class="logs__campo" />
        </label>
        <label class="logs__data">
          <span>Até</span>
          <input v-model="ate" type="date" class="logs__campo" />
        </label>

        <button
          v-if="busca || acao || de || ate"
          type="button"
          class="logs__limpar"
          @click="limparFiltros(); debouncedSearch.flush()"
        >
          Limpar filtros
        </button>
      </form>

      <p class="logs__total">
        {{ total === 1 ? '1 registro' : `${total.toLocaleString('pt-BR')} registros` }}
      </p>

      <div class="logs__scroll">
        <table class="logs__grid">
          <thead>
            <tr>
              <th class="logs__col-data">Data e hora</th>
              <th class="logs__col-acao">Ação</th>
              <th>Arquivo ou pasta</th>
              <th>Quem fez</th>
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td data-label="Data e hora">
                <span class="logs__dia">{{ formatarData(log.data).dia }}</span>
                <span class="logs__hora">{{ formatarData(log.data).hora }}</span>
              </td>
              <td data-label="Ação">
                <span class="logs__acao" :class="classeAcao(log)">{{ rotuloAcao(log) }}</span>
              </td>
              <td data-label="Arquivo ou pasta">
                <span class="logs__alvo" :title="log.alvo_nome || ''">{{ log.alvo_nome || '—' }}</span>
                <span class="logs__sub">
                  {{ TIPOS[log.alvo] }}<template v-if="log.empresa_nome"> · {{ log.empresa_nome }}</template>
                </span>
              </td>
              <td data-label="Quem fez">
                <span class="logs__alvo">{{ log.nome || log.email || '—' }}</span>
                <span v-if="log.nome && log.email" class="logs__sub">{{ log.email }}</span>
              </td>
              <td data-label="Detalhes" class="logs__detalhe">{{ log.detalhe || '—' }}</td>
            </tr>
            <tr v-if="!carregando && !logs.length">
              <td colspan="5" class="logs__vazio">Nenhum registro encontrado.</td>
            </tr>
            <tr v-if="carregando && !logs.length">
              <td colspan="5" class="logs__vazio">Carregando…</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="logs__paginacao">
        <TablePaginator :page-count="lastPage" :current-page="page" theme="night" @page-change="mudarPagina" />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.logs {
  width: 100%;
  min-width: 0;
  font-family: var(--night-font, 'Inter', sans-serif);
  color: #f7f7f7;

  &__heading {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 32px;
  }

  &__back {
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

  &__secao {
    margin: 0 0 2px;
    color: #b08d57;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__title {
    margin: 0;
  }

  &__panel {
    background: var(--night-surface, #132438);
    border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.18));
    border-radius: var(--night-radius, 20px);
    overflow: hidden;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 28px 32px 8px;
  }

  &__search {
    flex: 1 1 320px;
    max-width: 460px;
    min-width: 0;
    height: 46px;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 20px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 30px;

    &:focus-within {
      border-color: #b08d57;
      box-shadow: 0 0 0 2px rgba(176, 141, 87, 0.2);
    }

    input {
      flex: 1;
      min-width: 0;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      font: inherit;
      font-size: 14px;
      color: #fff;

      &::placeholder {
        color: #fff;
        opacity: 0.7;
      }
    }
  }

  &__search-btn {
    border: none;
    background: transparent;
    padding: 0;
    display: flex;
    cursor: pointer;
  }

  &__campo {
    height: 46px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
    font: inherit;
    font-size: 14px;
    color-scheme: dark;

    &:focus {
      outline: none;
      border-color: #b08d57;
    }

    option {
      background: #132438;
    }
  }

  &__data {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    opacity: 0.9;
  }

  &__limpar {
    border: 0;
    background: transparent;
    color: #d9b77e;
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
  }

  &__total {
    margin: 8px 32px 0;
    font-size: 12px;
    opacity: 0.6;
  }

  &__scroll {
    overflow-x: auto;
  }

  &__grid {
    width: 100%;
    min-width: 860px;
    border-collapse: collapse;

    th {
      padding: 18px 14px 12px;
      text-align: left;
      font-size: 13px;
      font-weight: 700;
      opacity: 0.7;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    td {
      padding: 12px 14px;
      font-size: 14px;
      vertical-align: top;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    th:first-child,
    td:first-child {
      padding-left: 32px;
    }

    th:last-child,
    td:last-child {
      padding-right: 32px;
    }

    tbody tr:hover td {
      background: rgba(255, 255, 255, 0.025);
    }
  }

  &__col-data {
    width: 130px;
  }

  &__col-acao {
    width: 190px;
  }

  &__dia,
  &__alvo {
    display: block;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  &__hora,
  &__sub {
    display: block;
    margin-top: 2px;
    font-size: 12px;
    opacity: 0.6;
    overflow-wrap: anywhere;
  }

  &__acao {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    background: rgba(176, 141, 87, 0.18);
    color: #d9b77e;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;

    &.is-perigo {
      background: rgba(229, 115, 115, 0.18);
      color: #ffb4b4;
    }

    &.is-leitura {
      background: rgba(100, 160, 230, 0.18);
      color: #a8cdf5;
    }

    &.is-positivo {
      background: rgba(76, 175, 80, 0.18);
      color: #8fd694;
    }
  }

  &__detalhe {
    opacity: 0.85;
    overflow-wrap: anywhere;
  }

  &__vazio {
    padding: 32px !important;
    text-align: center;
    opacity: 0.7;
  }

  &__paginacao {
    padding: 12px 32px 20px;
  }

  @media (max-width: 900px) {
    &__toolbar {
      padding: 20px 18px 8px;
    }

    &__total {
      margin: 8px 18px 0;
    }
  }
}
</style>
