<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'
import iconRadio from '@/assets/imgs/agrupamentos/icon-radio.svg'
import iconRadioSelected from '@/assets/imgs/agrupamentos/icon-radio-selected.svg'
import { postAgrupamento, type IPostAgrupamentoModel } from '@/services/http/agrupamentos'
import { getAllSetores, type ISetor } from '@/services/http/setores'
import { getAllFuncionarios, type IFuncionario } from '@/services/http/funcionarios'
import { getAllEmpresas } from '@/services/http/empresas'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(false)
const loadingData = ref(true)
const empresas = ref<{ id: string; nome: string }[]>([])
const setoresDisponiveis = ref<ISetor[]>([])
const funcionariosDisponiveis = ref<IFuncionario[]>([])
const empresaOpen = ref(false)
const empresaFilterRef = ref<HTMLElement | null>(null)

const form = ref({
  nome: '',
  descricao: '',
  tipo: 'individual' as 'individual' | 'setor',
  funcionarios: [] as string[],
  setores: [] as string[],
  empresa_id: ''
})

const isAdmin = computed(() => authStore.userRole === 'administrador')
const showFuncionarios = computed(() => form.value.tipo === 'individual')
const showSetores = computed(() => form.value.tipo === 'setor')

const empresaLabel = computed(() => {
  if (!form.value.empresa_id) return 'Selecione uma empresa'
  return empresas.value.find((e) => e.id === form.value.empresa_id)?.nome ?? 'Selecione uma empresa'
})

function onDocumentClick(event: MouseEvent) {
  if (empresaFilterRef.value && !empresaFilterRef.value.contains(event.target as Node)) {
    empresaOpen.value = false
  }
}

async function loadSetoresFuncionarios(empresaId?: string) {
  try {
    const [setoresRes, funcionariosRes] = await Promise.all([
      getAllSetores(empresaId),
      getAllFuncionarios(empresaId)
    ])
    setoresDisponiveis.value = setoresRes.data
    funcionariosDisponiveis.value = funcionariosRes.data
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => form.value.empresa_id,
  async (empresaId) => {
    form.value.funcionarios = []
    form.value.setores = []
    setoresDisponiveis.value = []
    funcionariosDisponiveis.value = []

    if (isAdmin.value && empresaId) {
      await loadSetoresFuncionarios(empresaId)
    }
  }
)

onMounted(async () => {
  document.addEventListener('click', onDocumentClick)

  try {
    if (isAdmin.value) {
      const { data } = await getAllEmpresas()
      empresas.value = data.data
    } else {
      await loadSetoresFuncionarios()
    }
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar dados')
  } finally {
    loadingData.value = false
  }
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})

function toggleEmpresaMenu() {
  empresaOpen.value = !empresaOpen.value
}

function selectEmpresa(id: string) {
  form.value.empresa_id = id
  empresaOpen.value = false
}

function selectTipo(tipo: 'individual' | 'setor') {
  if (form.value.tipo === tipo) return
  form.value.tipo = tipo
  form.value.funcionarios = []
  form.value.setores = []
}

function toggleFuncionario(id: string) {
  const index = form.value.funcionarios.indexOf(id)
  if (index > -1) {
    form.value.funcionarios.splice(index, 1)
  } else {
    form.value.funcionarios.push(id)
  }
}

function toggleSetor(id: string) {
  const index = form.value.setores.indexOf(id)
  if (index > -1) {
    form.value.setores.splice(index, 1)
  } else {
    form.value.setores.push(id)
  }
}

async function handleSubmit() {
  if (loading.value) return

  if (!form.value.nome.trim()) {
    toast.error('Nome é obrigatório')
    return
  }

  if (isAdmin.value && !form.value.empresa_id) {
    toast.error('Selecione uma empresa')
    return
  }

  if (form.value.tipo === 'individual' && form.value.funcionarios.length === 0) {
    toast.error('Selecione pelo menos um funcionário')
    return
  }

  if (form.value.tipo === 'setor' && form.value.setores.length === 0) {
    toast.error('Selecione pelo menos um setor')
    return
  }

  try {
    loading.value = true
    const payload: IPostAgrupamentoModel = {
      nome: form.value.nome.trim(),
      ...(form.value.descricao.trim() ? { descricao: form.value.descricao.trim() } : {}),
      tipo: form.value.tipo,
      ...(form.value.tipo === 'individual' ? { funcionarios: [...form.value.funcionarios] } : {}),
      ...(form.value.tipo === 'setor' ? { setores: [...form.value.setores] } : {}),
      ...(isAdmin.value ? { empresa_id: form.value.empresa_id } : {})
    }

    await postAgrupamento(payload)
    toast.success('Agrupamento criado com sucesso')
    router.push('/dashboard/agrupamentos')
  } catch (error) {
    console.error(error)
    toast.error('Erro ao criar agrupamento')
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/dashboard/agrupamentos')
}
</script>

<template>
  <section class="novo-agrupamento">
    <div class="novo-agrupamento__heading">
      <button
        type="button"
        class="novo-agrupamento__back"
        aria-label="Voltar para Agrupamentos"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="novo-agrupamento__title dashboard_title">NOVO AGRUPAMENTO</h2>
    </div>

    <div v-if="loadingData" class="novo-agrupamento__loading">
      <p>Carregando…</p>
    </div>

    <div v-else class="novo-agrupamento__panel">
      <form class="novo-agrupamento__form" @submit.prevent="handleSubmit">
        <div v-if="isAdmin" class="novo-agrupamento__field">
          <span class="novo-agrupamento__label night-field-label" id="empresa-label">EMPRESA*</span>
          <div ref="empresaFilterRef" class="novo-agrupamento__select">
            <button
              type="button"
              class="novo-agrupamento__select-trigger"
              :class="{ 'is-placeholder': !form.empresa_id }"
              aria-haspopup="listbox"
              aria-labelledby="empresa-label"
              :aria-expanded="empresaOpen"
              @click.stop="toggleEmpresaMenu"
            >
              <span>{{ empresaLabel }}</span>
              <img
                class="novo-agrupamento__select-chevron"
                :class="{ 'novo-agrupamento__select-chevron--open': empresaOpen }"
                :src="iconChevronDown"
                width="16"
                height="9"
                alt=""
              />
            </button>

            <ul
              v-if="empresaOpen"
              class="novo-agrupamento__select-menu"
              role="listbox"
              aria-labelledby="empresa-label"
            >
              <li>
                <button
                  type="button"
                  class="novo-agrupamento__select-option"
                  role="option"
                  :aria-selected="!form.empresa_id"
                  :class="{ 'is-active': !form.empresa_id }"
                  @click="selectEmpresa('')"
                >
                  Selecione uma empresa
                </button>
              </li>
              <li v-for="empresa in empresas" :key="empresa.id">
                <button
                  type="button"
                  class="novo-agrupamento__select-option"
                  role="option"
                  :aria-selected="form.empresa_id === empresa.id"
                  :class="{ 'is-active': form.empresa_id === empresa.id }"
                  @click="selectEmpresa(empresa.id)"
                >
                  {{ empresa.nome }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div class="novo-agrupamento__field">
          <label class="novo-agrupamento__label night-field-label" for="nome">NOME*</label>
          <input
            id="nome"
            v-model="form.nome"
            type="text"
            class="novo-agrupamento__input"
            placeholder="Nome do agrupamento"
            required
          />
        </div>

        <div class="novo-agrupamento__field">
          <label class="novo-agrupamento__label night-field-label" for="descricao">DESCRIÇÃO</label>
          <textarea
            id="descricao"
            v-model="form.descricao"
            class="novo-agrupamento__textarea"
            placeholder="Descrição do agrupamento (opcional)"
            rows="4"
          />
        </div>

        <div class="novo-agrupamento__field">
          <span class="novo-agrupamento__label night-field-label">TIPO DE AGRUPAMENTO</span>
          <div class="novo-agrupamento__radios" role="radiogroup" aria-label="Tipo de agrupamento">
            <button
              type="button"
              class="novo-agrupamento__radio"
              :class="{ 'is-selected': form.tipo === 'individual' }"
              role="radio"
              :aria-checked="form.tipo === 'individual'"
              @click="selectTipo('individual')"
            >
              <span class="novo-agrupamento__radio-text">
                Individual (selecionar funcionário um a um)
              </span>
              <img
                :src="form.tipo === 'individual' ? iconRadioSelected : iconRadio"
                width="24"
                height="24"
                alt=""
              />
            </button>

            <button
              type="button"
              class="novo-agrupamento__radio"
              :class="{ 'is-selected': form.tipo === 'setor' }"
              role="radio"
              :aria-checked="form.tipo === 'setor'"
              @click="selectTipo('setor')"
            >
              <span class="novo-agrupamento__radio-text">
                Por setor (incluir todos de um ou mais setores)
              </span>
              <img
                :src="form.tipo === 'setor' ? iconRadioSelected : iconRadio"
                width="24"
                height="24"
                alt=""
              />
            </button>
          </div>
        </div>

        <div v-if="showFuncionarios" class="novo-agrupamento__field">
          <span class="novo-agrupamento__label night-field-label">FUNCIONÁRIOS*</span>
          <div
            class="novo-agrupamento__checks"
            :class="{
              'novo-agrupamento__checks--empty':
                (isAdmin && !form.empresa_id) || funcionariosDisponiveis.length === 0
            }"
          >
            <p v-if="isAdmin && !form.empresa_id" class="novo-agrupamento__checks-empty">
              Selecione uma empresa primeiro
            </p>
            <p
              v-else-if="funcionariosDisponiveis.length === 0"
              class="novo-agrupamento__checks-empty"
            >
              Nenhum funcionário cadastrado
            </p>
            <label
              v-for="funcionario in funcionariosDisponiveis"
              :key="funcionario.id"
              class="novo-agrupamento__check"
            >
              <input
                type="checkbox"
                :checked="form.funcionarios.includes(funcionario.id)"
                @change="toggleFuncionario(funcionario.id)"
              />
              <span>{{ funcionario.nome }}</span>
            </label>
          </div>
          <small class="novo-agrupamento__helper">
            {{ funcionariosDisponiveis.length }} funcionário(s) cadastrado(s)
          </small>
        </div>

        <div v-if="showSetores" class="novo-agrupamento__field">
          <span class="novo-agrupamento__label night-field-label">SETORES*</span>
          <div
            class="novo-agrupamento__checks"
            :class="{
              'novo-agrupamento__checks--empty':
                (isAdmin && !form.empresa_id) || setoresDisponiveis.length === 0
            }"
          >
            <p v-if="isAdmin && !form.empresa_id" class="novo-agrupamento__checks-empty">
              Selecione uma empresa primeiro
            </p>
            <p v-else-if="setoresDisponiveis.length === 0" class="novo-agrupamento__checks-empty">
              Nenhum setor cadastrado
            </p>
            <label
              v-for="setor in setoresDisponiveis"
              :key="setor.id"
              class="novo-agrupamento__check"
            >
              <input
                type="checkbox"
                :checked="form.setores.includes(setor.id)"
                @change="toggleSetor(setor.id)"
              />
              <span>{{ setor.nome }}</span>
            </label>
          </div>
          <small class="novo-agrupamento__helper">
            {{ setoresDisponiveis.length }} setor(es) cadastrado(s)
          </small>
        </div>

        <div class="novo-agrupamento__actions">
          <button type="button" class="novo-agrupamento__cancel" @click="goBack">
            CANCELAR
          </button>
          <button type="submit" class="novo-agrupamento__submit" :disabled="loading">
            {{ loading ? 'Salvando…' : 'SALVAR' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.novo-agrupamento {
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

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;

    p {
      font-family: 'Source Code Pro', monospace;
      font-size: 14px;
      color: #f7f7f7;
      opacity: 0.7;
    }
  }

  &__panel {
    width: 800px;
    max-width: 100%;
    box-sizing: border-box;
    padding: 48px 75px 40px;
    background: rgba(121, 121, 121, 0.1);
    border-radius: var(--night-radius, 30px);
  }

  &__form {
    width: 650px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }

  &__field {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  &__label {
    display: block;
    flex-shrink: 0;
    width: 100%;
    margin: 0;
    padding-left: 20px;
    box-sizing: border-box;
    font-family: var(--night-font, 'Source Code Pro', monospace);
    font-size: 14px;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: 0;
    color: var(--night-gray, #f7f7f7);
    opacity: 0.7;
    text-transform: uppercase;
  }

  &__input,
  &__textarea {
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-radius: 30px;
    background: rgba(121, 121, 121, 0.3);
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.4;
    color: #ffffff;
    outline: none;
    -webkit-text-fill-color: #ffffff;

    &::placeholder {
      color: #f7f7f7;
      opacity: 0.6;
      -webkit-text-fill-color: #f7f7f7;
    }
  }

  &__input {
    height: 49px;
    padding: 0 20px;
    line-height: 1;
  }

  &__textarea {
    min-height: 120px;
    padding: 16px 20px;
    resize: vertical;
  }

  &__select {
    position: relative;
    width: 100%;
    z-index: 5;
  }

  &__select-trigger {
    width: 100%;
    height: 49px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 20px;
    background: rgba(121, 121, 121, 0.3);
    border-radius: 30px;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
    color: #ffffff;
    cursor: pointer;
    text-align: left;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &.is-placeholder {
      color: #f7f7f7;
      opacity: 0.85;

      span {
        opacity: 0.7;
      }
    }

    &:hover {
      background: rgba(121, 121, 121, 0.4);
    }
  }

  &__select-chevron {
    flex-shrink: 0;
    opacity: 0.7;
    transition: transform 0.2s ease;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__select-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 100%;
    max-height: 240px;
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
    z-index: 10;
  }

  &__select-option {
    width: 100%;
    border: none;
    background: transparent;
    text-align: left;
    padding: 10px 14px;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.2;
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

  &__radios {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__radio {
    width: 100%;
    min-height: 49px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 20px;
    border: 1px solid transparent;
    border-radius: 30px;
    background: rgba(33, 33, 33, 0.2);
    cursor: pointer;
    text-align: left;

    &.is-selected {
      background: rgba(121, 121, 121, 0.3);
      border-color: #797979;
    }

    &:hover:not(.is-selected) {
      background: rgba(33, 33, 33, 0.35);
    }

    img {
      flex-shrink: 0;
    }
  }

  &__radio-text {
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
    color: #f7f7f7;
  }

  &__checks {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    min-height: 49px;
    border-radius: 30px;
    background: rgba(121, 121, 121, 0.3);
    max-height: 200px;
    overflow-y: auto;

    &--empty {
      height: 49px;
      min-height: 49px;
      max-height: 49px;
      padding: 0 20px;
      background: #212121;
      overflow: hidden;
    }
  }

  &__checks-empty {
    margin: 0;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
    letter-spacing: 0;
    color: #f7f7f7;
  }

  &__check {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 20px;
    background: rgba(33, 33, 33, 0.4);
    cursor: pointer;
    font-family: 'Source Code Pro', monospace;
    font-size: 13px;
    font-weight: 300;
    color: #f7f7f7;

    input[type='checkbox'] {
      appearance: none;
      -webkit-appearance: none;
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      margin: 0;
      box-sizing: border-box;
      border: 1.5px solid rgba(247, 247, 247, 0.55);
      border-radius: 4px;
      background: transparent;
      cursor: pointer;
      transition: background 0.15s ease, border-color 0.15s ease;

      &:checked {
        border-color: #ff00ff;
        background-color: #ff00ff;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M2.5 6.2l2.4 2.4 4.6-4.8'/%3E%3C/svg%3E");
        background-size: 12px 12px;
        background-position: center;
        background-repeat: no-repeat;
      }

      &:focus-visible {
        outline: 2px solid rgba(255, 0, 255, 0.45);
        outline-offset: 2px;
      }
    }
  }

  &__helper {
    display: block;
    margin: 0;
    padding-left: 20px;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
    letter-spacing: 0;
    color: #1e3f49;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-top: 8px;
  }

  &__cancel,
  &__submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 140px;
    height: 46px;
    padding: 0 28px;
    border-radius: 30px;
    font-family: 'Source Code Pro', monospace;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;
  }

  &__cancel {
    border: 1px solid rgba(247, 247, 247, 0.7);
    background: transparent;
    color: #ffffff;

    &:hover {
      opacity: 0.85;
    }
  }

  &__submit {
    border: none;
    background: #ff00ff;
    color: #ffffff;

    &:hover:not(:disabled) {
      opacity: 0.92;
    }

    &:disabled {
      opacity: 0.7;
      cursor: wait;
    }
  }

  @media (max-width: 900px) {
    &__panel {
      width: 100%;
      padding: 32px 24px;
    }

    &__form {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    &__heading {
      margin-bottom: 24px;
    }

    &__panel {
      padding: 28px 20px 32px;
    }

    &__actions {
      flex-direction: column-reverse;
    }

    &__cancel,
    &__submit {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    &__heading {
      margin-bottom: 16px;
    }

    &__panel {
      padding: 24px 16px 28px;
      border-radius: 20px;
    }

    &__form {
      gap: 18px;
    }

    &__label {
      font-size: 12px;
    }

    &__input,
    &__select-trigger,
    &__radio {
      min-height: 44px;
      font-size: 13px;
    }

    &__radio-text {
      font-size: 12px;
      line-height: 1.3;
    }

    &__textarea {
      min-height: 100px;
      font-size: 13px;
    }

    &__cancel,
    &__submit {
      height: 44px;
      font-size: 14px;
    }
  }
}
</style>
