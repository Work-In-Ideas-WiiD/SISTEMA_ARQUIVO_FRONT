<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import {
  getAllCategoriasArquivo,
  type ICategoriaArquivo
} from '@/services/http/categorias-arquivo'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'
import iconUpload from '@/assets/imgs/arquivos/Upload.svg'
import { MESES, dateFromFile, yearOptions, type ArquivoUploadPayload } from './uploadMeta'

const props = defineProps<{
  open: boolean
  empresaId: string
  acessoLabel: string
  initialFile?: File | null
  saving?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: ArquivoUploadPayload): void
  (e: 'invalid', message: string): void
}>()

const nome = ref('')
const file = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const categoriaId = ref('')
const mes = ref<number | null>(new Date().getMonth() + 1)
const ano = ref<number | null>(new Date().getFullYear())
const selectOpen = ref<'categoria' | 'mes' | 'ano' | null>(null)
const categorias = ref<ICategoriaArquivo[]>([])
const anos = yearOptions()

const categoriaLabel = computed(
  () => categorias.value.find((c) => c.id === categoriaId.value)?.nome || 'Sem categoria'
)
const mesLabel = computed(() => MESES.find((m) => m.value === mes.value)?.label || 'Sem mês')

async function loadCategorias() {
  if (!props.empresaId) return
  try {
    const { data } = await getAllCategoriasArquivo(props.empresaId)
    categorias.value = data || []
  } catch {
    categorias.value = []
  }
}

function reset() {
  nome.value = ''
  file.value = null
  categoriaId.value = ''
  selectOpen.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
  const now = new Date()
  mes.value = now.getMonth() + 1
  ano.value = now.getFullYear()
}

function applyFile(novo: File) {
  file.value = novo
  nome.value = novo.name.replace(/\.[^.]+$/, '')
  const data = dateFromFile(novo)
  mes.value = data.mes
  ano.value = data.ano
  selectOpen.value = null
}

function onPickFile(event: Event) {
  const picked = (event.target as HTMLInputElement).files?.[0]
  if (picked) applyFile(picked)
}

function toggleSelect(key: 'categoria' | 'mes' | 'ano') {
  selectOpen.value = selectOpen.value === key ? null : key
}

function onModalClick(event: MouseEvent) {
  if (!(event.target as HTMLElement | null)?.closest('.night-select')) selectOpen.value = null
}

function submit() {
  if (!file.value) return emit('invalid', 'Selecione um arquivo')
  emit('submit', {
    file: file.value,
    nome: (nome.value || file.value.name.replace(/\.[^.]+$/, '')).trim() || 'Arquivo',
    categoria_id: categoriaId.value,
    mes: mes.value,
    ano: ano.value
  })
}

watch(
  () => props.open,
  (open) => {
    if (typeof document !== 'undefined') document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    reset()
    if (props.initialFile) applyFile(props.initialFile)
    void loadCategorias()
  },
  { immediate: true }
)

watch(
  () => props.initialFile,
  (novo) => {
    if (props.open && novo) applyFile(novo)
  }
)

onUnmounted(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="night-confirm" @click.self="emit('close')">
      <div
        class="night-confirm__modal night-confirm__modal--upload"
        role="dialog"
        aria-modal="true"
        @click="onModalClick"
      >
        <h3 class="night-confirm__title">{{ file?.name || 'Upload de Arquivo' }}</h3>

        <label class="night-confirm__label">Nome</label>
        <input v-model="nome" class="night-confirm__input" type="text" maxlength="255" />

        <label class="night-confirm__label">Arquivo</label>
        <input
          ref="fileInputRef"
          class="night-confirm__file-native"
          type="file"
          accept=".jpeg,.jpg,.png,.pdf,.doc,.docx,.mp4,.mov,.wmv,.mkv,.webm"
          @change="onPickFile"
        />
        <button
          type="button"
          class="night-confirm__file-btn"
          :class="{ 'has-file': !!file }"
          @click="fileInputRef?.click()"
        >
          <img :src="iconUpload" width="20" height="20" alt="" />
          <span>{{ file?.name || 'Escolher arquivo' }}</span>
        </button>

        <div class="night-confirm__row">
          <div class="night-confirm__col">
            <label class="night-confirm__label">Mês</label>
            <div class="night-select" :class="{ 'is-open': selectOpen === 'mes' }">
              <button
                type="button"
                class="night-select__trigger"
                :class="{ 'is-placeholder': !mes, 'is-open': selectOpen === 'mes' }"
                @click="toggleSelect('mes')"
              >
                <span>{{ mesLabel }}</span>
                <img
                  class="night-select__chevron"
                  :class="{ 'is-open': selectOpen === 'mes' }"
                  :src="iconChevronDown"
                  width="14"
                  height="14"
                  alt=""
                />
              </button>
              <button
                v-if="mes"
                type="button"
                class="night-select__clear"
                title="Deixar sem mês"
                aria-label="Deixar sem mês"
                @click.stop="mes = null; selectOpen = null"
              >
                ×
              </button>
              <ul v-if="selectOpen === 'mes'" class="night-select__menu" role="listbox">
                <li v-for="m in MESES" :key="m.value">
                  <button
                    type="button"
                    class="night-select__option"
                    :class="{ 'is-active': mes === m.value }"
                    role="option"
                    @click="mes = m.value; selectOpen = null"
                  >
                    {{ m.label }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div class="night-confirm__col">
            <label class="night-confirm__label">Ano</label>
            <div class="night-select" :class="{ 'is-open': selectOpen === 'ano' }">
              <button
                type="button"
                class="night-select__trigger"
                :class="{ 'is-placeholder': !ano, 'is-open': selectOpen === 'ano' }"
                @click="toggleSelect('ano')"
              >
                <span>{{ ano || 'Sem ano' }}</span>
                <img
                  class="night-select__chevron"
                  :class="{ 'is-open': selectOpen === 'ano' }"
                  :src="iconChevronDown"
                  width="14"
                  height="14"
                  alt=""
                />
              </button>
              <button
                v-if="ano"
                type="button"
                class="night-select__clear"
                title="Deixar sem ano"
                aria-label="Deixar sem ano"
                @click.stop="ano = null; selectOpen = null"
              >
                ×
              </button>
              <ul
                v-if="selectOpen === 'ano'"
                class="night-select__menu night-select__menu--scroll"
                role="listbox"
              >
                <li v-for="y in anos" :key="y">
                  <button
                    type="button"
                    class="night-select__option"
                    :class="{ 'is-active': ano === y }"
                    role="option"
                    @click="ano = y; selectOpen = null"
                  >
                    {{ y }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <label class="night-confirm__label">Categoria (opcional)</label>
        <div class="night-select" :class="{ 'is-open': selectOpen === 'categoria' }">
          <button
            type="button"
            class="night-select__trigger"
            :class="{ 'is-placeholder': !categoriaId, 'is-open': selectOpen === 'categoria' }"
            @click="toggleSelect('categoria')"
          >
            <span>{{ categoriaLabel }}</span>
            <img
              class="night-select__chevron"
              :class="{ 'is-open': selectOpen === 'categoria' }"
              :src="iconChevronDown"
              width="14"
              height="14"
              alt=""
            />
          </button>
          <ul v-if="selectOpen === 'categoria'" class="night-select__menu" role="listbox">
            <li>
              <button
                type="button"
                class="night-select__option"
                :class="{ 'is-active': !categoriaId }"
                role="option"
                @click="categoriaId = ''; selectOpen = null"
              >
                Sem categoria
              </button>
            </li>
            <li v-for="cat in categorias" :key="cat.id">
              <button
                type="button"
                class="night-select__option"
                :class="{ 'is-active': categoriaId === cat.id }"
                role="option"
                @click="categoriaId = cat.id; selectOpen = null"
              >
                {{ cat.nome }}
              </button>
            </li>
          </ul>
        </div>
        <p v-if="!categorias.length" class="night-confirm__hint">
          Nenhuma categoria cadastrada. Crie em “Categorias de arquivo”.
        </p>

        <div class="night-confirm__acessos">
          <p class="night-confirm__acessos-title">Acessos</p>
          <p class="night-confirm__acessos-value">{{ acessoLabel }}</p>
        </div>

        <div class="night-confirm__actions">
          <button
            type="button"
            class="night-confirm__btn night-confirm__btn--ghost"
            @click="emit('close')"
          >
            Cancelar
          </button>
          <button type="button" class="night-confirm__btn" :disabled="saving" @click="submit">
            Upload
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
  width: min(420px, 100%);
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.25));
  border-radius: 16px;
  padding: 24px;
  box-sizing: border-box;

  &--upload {
    width: min(460px, 100%);
    max-height: min(90vh, 720px);
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
}

.night-confirm__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  position: relative;
  /* sobe junto com o select aberto (evita texto vazando por cima do menu) */
  z-index: 2;

  &:has(.night-select.is-open) {
    z-index: 50;
  }
}

.night-confirm__col {
  min-width: 0;
  position: relative;
}

.night-select {
  position: relative;
  z-index: 2;
  margin-bottom: 14px;

  &.is-open {
    z-index: 60;
  }
}

.night-select__trigger {
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
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;

  &.is-placeholder {
    color: rgba(255, 252, 255, 0.55);
  }

  &.is-open {
    border-color: rgba(176, 141, 87, 0.55);
  }
}

.night-select__clear {
  position: absolute;
  top: 50%;
  right: 32px;
  transform: translateY(-50%);
  z-index: 3;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 252, 255, 0.75);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: rgba(176, 141, 87, 0.35);
    color: #fffcff;
  }
}

.night-select__chevron {
  flex-shrink: 0;
  opacity: 0.8;
  transition: transform 0.15s ease;
  filter: brightness(0) invert(1);

  &.is-open {
    transform: rotate(180deg);
  }
}

.night-select__menu {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  z-index: 70;
  margin: 0;
  padding: 6px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #0b1b2b;
  border: 1px solid rgba(176, 141, 87, 0.45);
  border-radius: 10px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.65);
  max-height: 200px;
  overflow-y: auto;
  overscroll-behavior: contain;
  isolation: isolate;

  &--scroll {
    max-height: 160px;
  }
}

.night-select__option {
  width: 100%;
  border: 0;
  background: #0b1b2b;
  color: #fffcff;
  text-align: left;
  padding: 10px 12px;
  border-radius: 8px;
  font: inherit;
  cursor: pointer;

  &:hover,
  &.is-active {
    background: rgba(176, 141, 87, 0.28);
    color: #fffcff;
  }
}

.night-select__empty {
  padding: 10px 12px;
  color: rgba(255, 252, 255, 0.55);
  font-size: 13px;
}

.night-confirm__acessos {
  margin: 4px 0 16px;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.night-confirm__acessos-title {
  margin: 0 0 6px;
  color: #b08d57;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.night-confirm__acessos-value {
  margin: 0;
  color: #fffcff;
  font-size: 14px;
  font-weight: 500;
}

.night-confirm__title {
  margin: 0 0 16px;
  color: #fffcff;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 18px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.night-confirm__label {
  display: block;
  margin: 0 0 6px;
  color: #b08d57;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--night-font, 'Inter', sans-serif);
}

.night-confirm__hint {
  margin: 0 0 12px;
  color: #f7f7f7;
  opacity: 0.65;
  font-size: 12px;
  font-family: var(--night-font, 'Inter', sans-serif);
}

.night-confirm__input {
  width: 100%;
  margin-bottom: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  font-family: var(--night-font, 'Inter', sans-serif);
  box-sizing: border-box;
}

.night-confirm__file-native {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.night-confirm__file-btn {
  width: 100%;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px dashed rgba(176, 141, 87, 0.55);
  background: rgba(255, 255, 255, 0.04);
  color: #fffcff;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.has-file {
    border-style: solid;
    border-color: rgba(176, 141, 87, 0.7);
    background: rgba(176, 141, 87, 0.12);
  }

  &:hover {
    border-color: #b08d57;
    background: rgba(176, 141, 87, 0.15);
  }
}

.night-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
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
</style>
