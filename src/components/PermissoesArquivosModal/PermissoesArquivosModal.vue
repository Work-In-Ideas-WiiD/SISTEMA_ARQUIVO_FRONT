<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { getAllSetores } from '@/services/http/setores'
import { getAllFuncoes } from '@/services/http/funcoes'
import { editarPermissoesArquivos, type IGetArquivosDataRes } from '@/services/http/arquivos'
import { getApiErrorMessage } from '@/utils/apiError'
import iconSetor from '@/assets/imgs/dashboard/icon-menu-setores.svg'
import iconFuncao from '@/assets/imgs/dashboard/icon-menu-funcoes.svg'

type Estado = 'on' | 'off' | 'mixed'

interface Opcao {
  id: string
  nome: string
}

const props = defineProps<{
  open: boolean
  empresaId: string
  arquivos: IGetArquivosDataRes[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const toast = useToast()
const setores = ref<Opcao[]>([])
const funcoes = ref<Opcao[]>([])
const estadoSetores = ref<Record<string, Estado>>({})
const estadoFuncoes = ref<Record<string, Estado>>({})
const loading = ref(false)
const saving = ref(false)

const titulo = computed(() =>
  props.arquivos.length === 1
    ? props.arquivos[0].descricao
    : `${props.arquivos.length} arquivos selecionados`
)

const grupos = computed(() => [
  { titulo: 'Setores', icon: iconSetor, itens: setores.value, mapa: estadoSetores.value },
  { titulo: 'Funções', icon: iconFuncao, itens: funcoes.value, mapa: estadoFuncoes.value }
])

function estadoInicial(ids: string[], chave: 'setores' | 'funcoes'): Record<string, Estado> {
  const total = props.arquivos.length
  const out: Record<string, Estado> = {}
  for (const id of ids) {
    const qtd = props.arquivos.filter((a) => a[chave]?.some((v) => v.id === id)).length
    out[id] = qtd === 0 ? 'off' : qtd === total ? 'on' : 'mixed'
  }
  return out
}

function alternar(mapa: Record<string, Estado>, id: string) {
  mapa[id] = mapa[id] === 'on' ? 'off' : 'on'
}

function separar(mapa: Record<string, Estado>) {
  const ids = Object.keys(mapa)
  return {
    adicionar: ids.filter((id) => mapa[id] === 'on'),
    remover: ids.filter((id) => mapa[id] === 'off')
  }
}

async function carregar() {
  loading.value = true
  try {
    const [{ data: s }, { data: f }] = await Promise.all([
      getAllSetores(props.empresaId),
      getAllFuncoes(props.empresaId)
    ])
    setores.value = (s || []).map(({ id, nome }) => ({ id, nome }))
    funcoes.value = (f || []).map(({ id, nome }) => ({ id, nome }))
    estadoSetores.value = estadoInicial(setores.value.map((o) => o.id), 'setores')
    estadoFuncoes.value = estadoInicial(funcoes.value.map((o) => o.id), 'funcoes')
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar setores e funções'))
  } finally {
    loading.value = false
  }
}

async function salvar() {
  const s = separar(estadoSetores.value)
  const f = separar(estadoFuncoes.value)
  saving.value = true
  try {
    await editarPermissoesArquivos(
      props.arquivos.map((a) => a.id),
      props.empresaId,
      {
        setores_adicionar: s.adicionar,
        setores_remover: s.remover,
        funcoes_adicionar: f.adicionar,
        funcoes_remover: f.remover
      }
    )
    toast.success('Permissões atualizadas')
    emit('saved')
    emit('close')
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao salvar permissões'))
  } finally {
    saving.value = false
  }
}

watch(
  () => props.open,
  (open) => {
    if (typeof document !== 'undefined') document.body.style.overflow = open ? 'hidden' : ''
    if (open) void carregar()
  },
  { immediate: true }
)
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="night-confirm" @click.self="emit('close')">
      <div class="night-confirm__modal perm-modal" role="dialog" aria-modal="true">
        <h3 class="night-confirm__title">Editar permissões</h3>
        <p class="perm-modal__sub">{{ titulo }}</p>
        <p class="perm-modal__hint">
          Marque quem pode ver {{ arquivos.length === 1 ? 'o arquivo' : 'os arquivos' }}.
          <template v-if="arquivos.length > 1">
            Itens “parcial” ficam como estão em cada arquivo, a menos que você os altere.
          </template>
        </p>

        <div class="perm-modal__body">
          <p v-if="loading" class="perm-modal__empty">Carregando…</p>
          <template v-else>
            <section v-for="grupo in grupos" :key="grupo.titulo" class="perm-modal__group">
              <h4 class="perm-modal__group-title">{{ grupo.titulo }}</h4>
              <p v-if="!grupo.itens.length" class="perm-modal__empty">
                Nenhum item cadastrado.
              </p>
              <label v-for="item in grupo.itens" :key="item.id" class="perm-modal__item">
                <input
                  type="checkbox"
                  :checked="grupo.mapa[item.id] === 'on'"
                  :indeterminate="grupo.mapa[item.id] === 'mixed'"
                  @change="alternar(grupo.mapa, item.id)"
                />
                <img class="perm-modal__icon" :src="grupo.icon" width="16" height="16" alt="" />
                <span>{{ item.nome }}</span>
                <small v-if="grupo.mapa[item.id] === 'mixed'">parcial</small>
              </label>
            </section>
          </template>
        </div>

        <div class="night-confirm__actions">
          <button
            type="button"
            class="night-confirm__btn night-confirm__btn--ghost"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="night-confirm__btn"
            :disabled="saving || loading"
            @click="salvar"
          >
            Salvar
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

.perm-modal {
  width: min(480px, 100%);
  max-height: min(88vh, 720px);
  display: flex;
  flex-direction: column;
  font-family: var(--night-font, 'Inter', sans-serif);
}

.perm-modal__sub {
  margin: 4px 0 8px;
  color: #b08d57;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  overflow-wrap: anywhere;
}

.perm-modal__hint {
  margin: 0 0 12px;
  color: #f7f7f7;
  opacity: 0.7;
  font-size: 12px;
}

.perm-modal__body {
  flex: 1 1 auto;
  min-height: 160px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  scrollbar-width: thin;
  scrollbar-color: rgba(176, 141, 87, 0.45) transparent;
}

.perm-modal__group + .perm-modal__group {
  margin-top: 14px;
}

.perm-modal__group-title {
  margin: 0 0 6px;
  color: #b08d57;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.perm-modal__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 6px;
  border-radius: 8px;
  color: #fffcff;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  input {
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: #b08d57;
    cursor: pointer;
  }

  span {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    color: rgba(255, 252, 255, 0.55);
    font-size: 11px;
  }
}

.perm-modal__icon {
  flex-shrink: 0;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(67%) sepia(18%) saturate(742%) hue-rotate(7deg)
    brightness(95%) contrast(88%);
}

.perm-modal__empty {
  margin: 4px 0;
  color: #f7f7f7;
  opacity: 0.7;
  font-size: 13px;
}
</style>
