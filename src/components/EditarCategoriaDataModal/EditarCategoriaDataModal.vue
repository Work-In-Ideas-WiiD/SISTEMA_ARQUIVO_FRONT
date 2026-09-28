<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { getAllCategoriasArquivo, type ICategoriaArquivo } from '@/services/http/categorias-arquivo'
import { patchArquivoCategoriaData, type IGetArquivosDataRes } from '@/services/http/arquivos'
import { getApiErrorMessage } from '@/utils/apiError'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'

type Campo = 'categoria' | 'mes' | 'ano'

const props = defineProps<{
  open: boolean
  empresaId: string
  arquivo: IGetArquivosDataRes | null
  formato?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
].map((label, i) => ({ value: i + 1, label }))

const anoAtual = new Date().getFullYear()
const ANOS = Array.from({ length: 33 }, (_, i) => anoAtual + 2 - i)

const toast = useToast()
const categorias = ref<ICategoriaArquivo[]>([])
const categoriaId = ref('')
const mes = ref<number | null>(null)
const ano = ref<number | null>(null)
const aberto = ref<Campo | null>(null)
const saving = ref(false)

const categoriaLabel = computed(
  () => categorias.value.find((c) => c.id === categoriaId.value)?.nome || 'Selecione a categoria'
)
const mesLabel = computed(() => MESES.find((m) => m.value === mes.value)?.label || 'Sem mês')

function alternar(campo: Campo) {
  aberto.value = aberto.value === campo ? null : campo
}

async function carregar() {
  const a = props.arquivo
  categoriaId.value = a?.categoria_id || a?.categoria?.id || ''
  mes.value = a?.mes ?? null
  ano.value = a?.ano ?? null
  aberto.value = null
  try {
    const { data } = await getAllCategoriasArquivo(props.empresaId)
    categorias.value = data || []
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar categorias'))
  }
}

async function salvar() {
  if (!props.arquivo) return
  if (!categoriaId.value) {
    toast.error('Selecione a categoria')
    return
  }
  saving.value = true
  try {
    await patchArquivoCategoriaData(props.arquivo.id, {
      categoria_id: categoriaId.value,
      mes: mes.value,
      ano: ano.value
    })
    toast.success('Categoria e data atualizadas')
    emit('saved')
    emit('close')
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao salvar'))
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
    <div v-if="open" class="cd-overlay" @click.self="emit('close')" @click="aberto = null">
      <div class="cd-modal" role="dialog" aria-modal="true" aria-labelledby="cd-title" @click.stop="aberto = null">
        <h3 id="cd-title" class="cd-modal__title">Editar categoria e data</h3>
        <p v-if="arquivo" class="cd-modal__sub">
          <span class="cd-modal__nome">{{ arquivo.descricao }}</span>
          <span v-if="formato" class="cd-modal__ext">{{ formato }}</span>
        </p>

        <label class="cd-modal__label">Categoria</label>
        <div class="cd-select" :class="{ 'is-open': aberto === 'categoria' }" @click.stop>
          <button
            type="button"
            class="cd-select__trigger"
            :class="{ 'is-placeholder': !categoriaId }"
            @click="alternar('categoria')"
          >
            <span>{{ categoriaLabel }}</span>
            <img class="cd-select__chevron" :src="iconChevronDown" width="14" height="14" alt="" />
          </button>
          <ul v-if="aberto === 'categoria'" class="cd-select__menu" role="listbox">
            <li v-if="!categorias.length" class="cd-select__empty">Nenhuma categoria cadastrada</li>
            <li v-for="c in categorias" :key="c.id">
              <button
                type="button"
                class="cd-select__option"
                :class="{ 'is-active': categoriaId === c.id }"
                role="option"
                @click="categoriaId = c.id; aberto = null"
              >
                {{ c.nome }}
              </button>
            </li>
          </ul>
        </div>

        <div class="cd-modal__row">
          <div class="cd-modal__col">
            <label class="cd-modal__label">Mês</label>
            <div class="cd-select" :class="{ 'is-open': aberto === 'mes' }" @click.stop>
              <button
                type="button"
                class="cd-select__trigger"
                :class="{ 'is-placeholder': !mes }"
                @click="alternar('mes')"
              >
                <span>{{ mesLabel }}</span>
                <img class="cd-select__chevron" :src="iconChevronDown" width="14" height="14" alt="" />
              </button>
              <button
                v-if="mes"
                type="button"
                class="cd-select__clear"
                aria-label="Remover mês"
                title="Remover mês"
                @click="mes = null; aberto = null"
              >
                ×
              </button>
              <ul v-if="aberto === 'mes'" class="cd-select__menu cd-select__menu--up" role="listbox">
                <li v-for="m in MESES" :key="m.value">
                  <button
                    type="button"
                    class="cd-select__option"
                    :class="{ 'is-active': mes === m.value }"
                    role="option"
                    @click="mes = m.value; aberto = null"
                  >
                    {{ m.label }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div class="cd-modal__col">
            <label class="cd-modal__label">Ano</label>
            <div class="cd-select" :class="{ 'is-open': aberto === 'ano' }" @click.stop>
              <button
                type="button"
                class="cd-select__trigger"
                :class="{ 'is-placeholder': !ano }"
                @click="alternar('ano')"
              >
                <span>{{ ano || 'Sem ano' }}</span>
                <img class="cd-select__chevron" :src="iconChevronDown" width="14" height="14" alt="" />
              </button>
              <button
                v-if="ano"
                type="button"
                class="cd-select__clear"
                aria-label="Remover ano"
                title="Remover ano"
                @click="ano = null; aberto = null"
              >
                ×
              </button>
              <ul v-if="aberto === 'ano'" class="cd-select__menu cd-select__menu--up" role="listbox">
                <li v-for="y in ANOS" :key="y">
                  <button
                    type="button"
                    class="cd-select__option"
                    :class="{ 'is-active': ano === y }"
                    role="option"
                    @click="ano = y; aberto = null"
                  >
                    {{ y }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="cd-modal__actions">
          <button type="button" class="cd-modal__btn cd-modal__btn--ghost" @click="emit('close')">
            Cancelar
          </button>
          <button type="button" class="cd-modal__btn" :disabled="saving" @click="salvar">
            Salvar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.cd-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.cd-modal {
  width: min(460px, 100%);
  padding: 24px;
  box-sizing: border-box;
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.25));
  border-radius: 16px;
  font-family: var(--night-font, 'Inter', sans-serif);
}

.cd-modal__title {
  margin: 0;
  color: #fffcff;
  font-size: 18px;
  font-weight: 700;
}

.cd-modal__sub {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
  margin: 4px 0 18px;
}

.cd-modal__nome {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(255, 252, 255, 0.85);
  font-size: 13px;
  font-weight: 600;
}

.cd-modal__ext {
  flex-shrink: 0;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1;
  color: rgba(176, 141, 87, 0.95);
  text-transform: uppercase;
}

.cd-modal__label {
  display: block;
  margin: 0 0 6px;
  color: rgba(255, 252, 255, 0.7);
  font-size: 12px;
  font-weight: 600;
}

.cd-modal__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.cd-modal__col {
  min-width: 0;
}

.cd-select {
  position: relative;
  margin-bottom: 14px;

  &.is-open {
    z-index: 5;
  }
}

.cd-select__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: #0b1b2b;
  color: #fffcff;
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.is-placeholder {
    color: rgba(255, 252, 255, 0.55);
  }
}

.cd-select.is-open .cd-select__trigger {
  border-color: rgba(176, 141, 87, 0.55);
}

.cd-select__chevron {
  flex-shrink: 0;
  opacity: 0.8;
  filter: brightness(0) invert(1);
  transition: transform 0.15s ease;
}

.cd-select.is-open .cd-select__chevron {
  transform: rotate(180deg);
}

/* O × fica no canto, à esquerda da seta, só quando há valor. */
.cd-select__clear {
  position: absolute;
  top: 50%;
  right: 32px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #fffcff;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: rgba(176, 141, 87, 0.45);
  }
}

.cd-select__menu {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  z-index: 10;
  margin: 0;
  padding: 6px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 200px;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: #0b1b2b;
  border: 1px solid rgba(176, 141, 87, 0.45);
  border-radius: 10px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.65);

  &--up {
    top: auto;
    bottom: calc(100% + 4px);
  }
}

.cd-select__option {
  width: 100%;
  border: 0;
  background: transparent;
  color: #fffcff;
  text-align: left;
  padding: 9px 12px;
  border-radius: 8px;
  font: inherit;
  font-size: 14px;
  cursor: pointer;

  &:hover,
  &.is-active {
    background: rgba(176, 141, 87, 0.28);
  }
}

.cd-select__empty {
  padding: 10px 12px;
  color: rgba(255, 252, 255, 0.55);
  font-size: 13px;
}

.cd-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.cd-modal__btn {
  border: 0;
  border-radius: 999px;
  padding: 10px 18px;
  background: #b08d57;
  color: #0b1b2b;
  font: inherit;
  font-weight: 700;
  cursor: pointer;

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
</style>
