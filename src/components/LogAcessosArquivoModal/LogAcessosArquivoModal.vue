<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { getArquivoLog, type IArquivoLogEvento } from '@/services/http/arquivos'
import { getApiErrorMessage } from '@/utils/apiError'

type Filtro = 'todos' | 'acesso' | 'alteracao'

const props = defineProps<{
  open: boolean
  arquivoId: string
  arquivoNome?: string
  arquivoFormato?: string
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const toast = useToast()
const eventos = ref<IArquivoLogEvento[]>([])
const loading = ref(false)
const busca = ref('')
const filtro = ref<Filtro>('todos')

const FILTROS: { id: Filtro; label: string }[] = [
  { id: 'todos', label: 'Tudo' },
  { id: 'acesso', label: 'Visualizações' },
  { id: 'alteracao', label: 'Alterações' }
]

const ACOES: Record<string, string> = {
  visualizou: 'Visualizou',
  link_externo: 'Link externo',
  permissoes: 'Permissões',
  moveu: 'Moveu',
  created: 'Enviou',
  updated: 'Alterou',
  deleted: 'Excluiu',
  restored: 'Restaurou'
}

const dataHora = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo'
})

function formatar(data: string) {
  const d = new Date(data)
  return Number.isNaN(d.getTime()) ? data : dataHora.format(d).replace(',', ' às')
}

const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return eventos.value.filter((e) => {
    if (filtro.value !== 'todos' && e.tipo !== filtro.value) return false
    if (!q) return true
    return [e.nome, e.email, e.detalhe, ACOES[e.acao], formatar(e.data)]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q))
  })
})

const contagem = computed(() => ({
  todos: eventos.value.length,
  acesso: eventos.value.filter((e) => e.tipo === 'acesso').length,
  alteracao: eventos.value.filter((e) => e.tipo === 'alteracao').length
}))

async function carregar() {
  loading.value = true
  busca.value = ''
  filtro.value = 'todos'
  eventos.value = []
  try {
    const { data } = await getArquivoLog(props.arquivoId)
    eventos.value = data || []
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar o log do arquivo'))
  } finally {
    loading.value = false
  }
}

watch(
  () => props.open,
  (open) => {
    if (typeof document !== 'undefined') document.body.style.overflow = open ? 'hidden' : ''
    if (open && props.arquivoId) void carregar()
  },
  { immediate: true }
)
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="log-overlay" @click.self="emit('close')">
      <div class="log-modal" role="dialog" aria-modal="true" aria-labelledby="log-modal-title">
        <h3 id="log-modal-title" class="log-modal__title">Log de acessos</h3>
        <p v-if="arquivoNome" class="log-modal__sub">
          <span class="log-modal__nome">{{ arquivoNome }}</span>
          <span v-if="arquivoFormato" class="log-modal__ext">{{ arquivoFormato }}</span>
        </p>

        <input
          v-model="busca"
          class="log-modal__search"
          type="search"
          placeholder="Buscar por pessoa, e-mail, ação ou data"
          :disabled="loading"
        />

        <div class="log-modal__chips" role="tablist">
          <button
            v-for="f in FILTROS"
            :key="f.id"
            type="button"
            class="log-modal__chip"
            :class="{ 'is-active': filtro === f.id }"
            role="tab"
            :aria-selected="filtro === f.id"
            @click="filtro = f.id"
          >
            {{ f.label }} <span>{{ contagem[f.id] }}</span>
          </button>
        </div>

        <div class="log-modal__body">
          <p v-if="loading" class="log-modal__empty">Carregando…</p>
          <p v-else-if="!filtrados.length" class="log-modal__empty">
            {{ eventos.length ? 'Nenhum registro encontrado.' : 'Nenhum acesso registrado ainda.' }}
          </p>
          <ul v-else class="log-modal__list">
            <li v-for="e in filtrados" :key="e.id" class="log-modal__item">
              <span class="log-modal__tag" :class="`log-modal__tag--${e.tipo}`">
                {{ ACOES[e.acao] || e.acao }}
              </span>
              <div class="log-modal__info">
                <p class="log-modal__quem">
                  {{ e.nome || e.email || 'Usuário desconhecido' }}
                  <small v-if="e.nome && e.email">{{ e.email }}</small>
                </p>
                <p v-if="e.detalhe" class="log-modal__detalhe">{{ e.detalhe }}</p>
              </div>
              <time class="log-modal__data" :datetime="e.data">{{ formatar(e.data) }}</time>
            </li>
          </ul>
        </div>

        <div class="log-modal__actions">
          <button type="button" class="log-modal__btn" @click="emit('close')">Fechar</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.log-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overscroll-behavior: contain;
}

.log-modal {
  width: min(640px, 100%);
  max-height: min(90vh, 780px);
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-sizing: border-box;
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.25));
  border-radius: 16px;
  font-family: var(--night-font, 'Inter', sans-serif);
}

.log-modal__title {
  margin: 0;
  color: #fffcff;
  font-size: 18px;
  font-weight: 700;
}

.log-modal__sub {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
  margin: 4px 0 12px;
}

.log-modal__nome {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(255, 252, 255, 0.85);
  font-size: 13px;
  font-weight: 600;
}

.log-modal__ext {
  flex-shrink: 0;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1;
  color: rgba(176, 141, 87, 0.95);
  text-transform: uppercase;
}

.log-modal__search {
  height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.25);
  color: #fffcff;
  font-size: 13px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #b08d57;
  }
}

.log-modal__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
}

.log-modal__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: #f7f7f7;
  font: inherit;
  font-size: 12px;
  cursor: pointer;

  span {
    opacity: 0.6;
  }

  &.is-active {
    border-color: #b08d57;
    background: rgba(176, 141, 87, 0.18);
    color: #fffcff;
  }
}

.log-modal__body {
  flex: 0 0 auto;
  /* Altura fixa para ~6 registros; o resto rola. */
  height: min(430px, 55vh);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  scrollbar-width: thin;
  scrollbar-color: rgba(176, 141, 87, 0.45) transparent;
}

.log-modal__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.log-modal__item {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  &:last-child {
    border-bottom: 0;
  }
}

.log-modal__tag {
  justify-self: start;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;

  &--acesso {
    background: rgba(90, 170, 120, 0.18);
    color: #8fd6a8;
  }

  &--alteracao {
    background: rgba(176, 141, 87, 0.2);
    color: #d9b77e;
  }
}

.log-modal__info {
  min-width: 0;
}

.log-modal__quem {
  margin: 0;
  color: #fffcff;
  font-size: 14px;
  overflow-wrap: anywhere;

  small {
    display: block;
    color: rgba(255, 252, 255, 0.55);
    font-size: 12px;
  }
}

.log-modal__detalhe {
  margin: 2px 0 0;
  color: rgba(255, 252, 255, 0.75);
  font-size: 12px;
  overflow-wrap: anywhere;
}

.log-modal__data {
  color: rgba(255, 252, 255, 0.7);
  font-size: 12px;
  white-space: nowrap;
}

.log-modal__empty {
  margin: 12px 0;
  color: #f7f7f7;
  opacity: 0.7;
  font-size: 13px;
}

.log-modal__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.log-modal__btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 10px 18px;
  background: transparent;
  color: #fffcff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 560px) {
  .log-modal__item {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .log-modal__tag {
    grid-column: 1 / -1;
  }
}
</style>
