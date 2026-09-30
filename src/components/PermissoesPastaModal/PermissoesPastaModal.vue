<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import {
  getPermissoesPasta,
  putPermissoesPasta,
  type IPermissoesPasta,
  type IPessoaPasta
} from '@/services/http/pastas'
import { getApiErrorMessage } from '@/utils/apiError'

const props = defineProps<{
  open: boolean
  pasta: { id: string; nome: string } | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const toast = useToast()
const dados = ref<IPermissoesPasta | null>(null)
const comAcesso = ref(new Set<string>())
const busca = ref('')
const carregando = ref(false)
const salvando = ref(false)

const QUEM: Record<IPermissoesPasta['nivel_tipo'], string> = {
  empresa: 'Por padrão, todas as pessoas da empresa têm acesso a esta pasta.',
  setor: 'Por padrão, todas as pessoas do setor têm acesso a esta pasta.',
  funcao: 'Por padrão, todas as pessoas da função têm acesso a esta pasta.',
  agrupamento: 'Por padrão, todas as pessoas do agrupamento têm acesso a esta pasta.'
}

const pessoas = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  const lista = dados.value?.pessoas || []
  if (!termo) return lista
  return lista.filter(
    (p) => p.nome.toLowerCase().includes(termo) || (p.email || '').toLowerCase().includes(termo)
  )
})

const resumo = computed(() => {
  const lista = dados.value?.pessoas || []
  const total = lista.length
  const liberadas = lista.filter((p) => !p.bloqueado_em && comAcesso.value.has(p.id)).length
  return total ? `${liberadas} de ${total} com acesso` : ''
})

const alteraveis = computed(() => (dados.value?.pessoas || []).filter((p) => !p.bloqueado_em))
const todosComAcesso = computed(
  () => alteraveis.value.length > 0 && alteraveis.value.every((p) => comAcesso.value.has(p.id))
)

function alternarTodos() {
  comAcesso.value = todosComAcesso.value ? new Set() : new Set(alteraveis.value.map((p) => p.id))
}

function alternar(p: IPessoaPasta) {
  if (p.bloqueado_em) return
  const next = new Set(comAcesso.value)
  if (next.has(p.id)) next.delete(p.id)
  else next.add(p.id)
  comAcesso.value = next
}

function aplicar(d: IPermissoesPasta) {
  dados.value = d
  comAcesso.value = new Set(d.pessoas.filter((p) => p.acesso).map((p) => p.id))
}

async function carregar() {
  if (!props.pasta) return
  carregando.value = true
  dados.value = null
  try {
    const { data } = await getPermissoesPasta(props.pasta.id)
    aplicar(data)
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar permissões da pasta'))
    emit('close')
  } finally {
    carregando.value = false
  }
}

async function salvar() {
  if (!props.pasta || !dados.value) return
  const bloqueados = dados.value.pessoas
    .filter((p) => !p.bloqueado_em && !comAcesso.value.has(p.id))
    .map((p) => p.id)
  salvando.value = true
  try {
    const { data } = await putPermissoesPasta(props.pasta.id, bloqueados)
    aplicar(data)
    toast.success('Permissões da pasta atualizadas')
    emit('saved')
    emit('close')
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao salvar permissões'))
  } finally {
    salvando.value = false
  }
}

watch(
  () => props.open,
  (open) => {
    if (typeof document !== 'undefined') document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    busca.value = ''
    void carregar()
  },
  { immediate: true }
)
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="night-confirm" @click.self="emit('close')">
      <div class="night-confirm__modal perm-pasta" role="dialog" aria-modal="true" aria-labelledby="perm-pasta-title">
        <h3 id="perm-pasta-title" class="night-confirm__title">Permissões da pasta</h3>
        <p v-if="pasta" class="perm-pasta__nome">{{ pasta.nome }}</p>

        <p v-if="carregando" class="perm-pasta__status">Carregando…</p>

        <template v-else-if="dados">
          <div class="perm-pasta__nivel">
            <span class="perm-pasta__tag">Local</span>
            <span class="perm-pasta__caminho">{{ dados.nivel }}</span>
            <p>{{ QUEM[dados.nivel_tipo] }} Você pode tirar ou devolver o acesso de cada pessoa.</p>
          </div>

          <div class="perm-pasta__head">
            <input
              v-model="busca"
              class="perm-pasta__busca"
              type="search"
              placeholder="Pesquisar pessoa…"
              aria-label="Pesquisar pessoa"
            />
            <span class="perm-pasta__resumo">{{ resumo }}</span>
            <button
              v-if="alteraveis.length"
              type="button"
              class="perm-pasta__todos"
              @click="alternarTodos"
            >
              {{ todosComAcesso ? 'Tirar todos' : 'Marcar todos' }}
            </button>
          </div>

          <ul v-if="dados.sempre?.length && !busca.trim()" class="perm-pasta__lista perm-pasta__lista--fixa">
            <li v-for="u in dados.sempre" :key="u.id">
              <div class="perm-pasta__pessoa is-fixa">
                <input type="checkbox" checked disabled />
                <span class="perm-pasta__info">
                  <span class="perm-pasta__pnome">{{ u.nome }}</span>
                  <span class="perm-pasta__obs">{{ u.papel }} · sempre tem acesso</span>
                </span>
                <span class="perm-pasta__estado is-on">Com acesso</span>
              </div>
            </li>
          </ul>

          <ul v-if="pessoas.length" class="perm-pasta__lista">
            <li v-for="p in pessoas" :key="p.id">
              <label class="perm-pasta__pessoa" :class="{ 'is-travada': p.bloqueado_em }">
                <input
                  type="checkbox"
                  :checked="!p.bloqueado_em && comAcesso.has(p.id)"
                  :disabled="!!p.bloqueado_em"
                  @change="alternar(p)"
                />
                <span class="perm-pasta__info">
                  <span class="perm-pasta__pnome">{{ p.nome }}</span>
                  <span v-if="p.bloqueado_em" class="perm-pasta__obs">
                    Sem acesso pela pasta “{{ p.bloqueado_em }}”
                  </span>
                  <span v-else-if="p.email" class="perm-pasta__obs">{{ p.email }}</span>
                </span>
                <span
                  class="perm-pasta__estado"
                  :class="{ 'is-on': !p.bloqueado_em && comAcesso.has(p.id) }"
                >
                  {{ !p.bloqueado_em && comAcesso.has(p.id) ? 'Com acesso' : 'Sem acesso' }}
                </span>
              </label>
            </li>
          </ul>
          <p v-else class="perm-pasta__status">
            {{ dados.pessoas.length ? 'Nenhuma pessoa encontrada.' : 'Ninguém cadastrado neste local ainda.' }}
          </p>
        </template>

        <div class="night-confirm__actions">
          <button type="button" class="night-confirm__btn night-confirm__btn--ghost" @click="emit('close')">
            Cancelar
          </button>
          <button
            type="button"
            class="night-confirm__btn"
            :disabled="salvando || carregando || !dados"
            @click="salvar"
          >
            {{ salvando ? 'Salvando…' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.night-confirm {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
  overscroll-behavior: contain;
}

.night-confirm__modal {
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.25));
  border-radius: 16px;
  padding: 24px;
  box-sizing: border-box;
}

.night-confirm__title {
  margin: 0;
  color: #fffcff;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 18px;
  font-weight: 700;
}

.night-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.night-confirm__btn {
  border: 0;
  border-radius: 999px;
  padding: 10px 18px;
  background: #b08d57;
  color: #0b1b2b;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--night-font, 'Inter', sans-serif);

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

.perm-pasta {
  width: min(540px, 100%);
  max-height: min(88vh, 720px);
  display: flex;
  flex-direction: column;
  font-family: var(--night-font, 'Inter', sans-serif);
  color: #fffcff;
}

.perm-pasta__nome {
  margin: 4px 0 14px;
  color: #b08d57;
  font-size: 13px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.perm-pasta__status {
  margin: 16px 0;
  color: rgba(255, 252, 255, 0.65);
  font-size: 14px;
}

.perm-pasta__nivel {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);

  p {
    margin: 8px 0 0;
    color: rgba(255, 252, 255, 0.7);
    font-size: 13px;
    line-height: 1.45;
  }
}

.perm-pasta__tag {
  display: inline-block;
  margin-right: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(176, 141, 87, 0.22);
  color: #d9b77e;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.perm-pasta__caminho {
  font-size: 14px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.perm-pasta__head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 14px 0 8px;
}

.perm-pasta__busca {
  flex: 1 1 auto;
  min-width: 0;
  padding: 9px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.25);
  color: #fffcff;
  font: inherit;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #b08d57;
  }
}

.perm-pasta__resumo {
  flex-shrink: 0;
  color: rgba(255, 252, 255, 0.6);
  font-size: 12px;
}

.perm-pasta__todos {
  flex-shrink: 0;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(176, 141, 87, 0.5);
  background: transparent;
  color: #d9b77e;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: rgba(176, 141, 87, 0.15);
  }
}

.perm-pasta__lista--fixa {
  flex: 0 0 auto;
  min-height: 0;
  margin-bottom: 8px;
}

.perm-pasta__lista {
  flex: 1 1 auto;
  min-height: 120px;
  margin: 0;
  padding: 6px;
  list-style: none;
  overflow-y: auto;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  scrollbar-width: thin;
  scrollbar-color: rgba(176, 141, 87, 0.45) transparent;
}

.perm-pasta__pessoa {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 10px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &.is-travada {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &.is-fixa {
    cursor: default;

    &:hover {
      background: transparent;
    }
  }

  input {
    width: 16px;
    height: 16px;
    accent-color: #b08d57;
    flex-shrink: 0;
  }
}

.perm-pasta__info {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.perm-pasta__pnome {
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.perm-pasta__obs {
  color: rgba(255, 252, 255, 0.55);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.perm-pasta__estado {
  flex-shrink: 0;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 252, 255, 0.6);
  font-size: 11px;
  font-weight: 700;

  &.is-on {
    background: rgba(76, 175, 80, 0.2);
    color: #8fd694;
  }
}
</style>
