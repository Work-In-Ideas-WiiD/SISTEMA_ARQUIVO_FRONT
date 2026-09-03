<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import iconChevronDown from '@/assets/imgs/administradores/icon-chevron-down.svg'
import { getFuncionario, patchFuncionario, type IPostFuncionarioModel } from '@/services/http/funcionarios'
import { getAllSetores, type ISetor } from '@/services/http/setores'
import { getAllFuncoes, type IFuncao } from '@/services/http/funcoes'
import { getAllEmpresas } from '@/services/http/empresas'
import { isValidOptionalCpf, maskCpf } from '@/utils/formatCpfCnpj'
import { maskPhone, stripDigits } from '@/utils/formatPhone'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(false)
const fetching = ref(true)
const readyEmpresaWatch = ref(false)
const empresas = ref<{ id: string; nome: string }[]>([])
const setoresDisponiveis = ref<ISetor[]>([])
const funcoesDisponiveis = ref<IFuncao[]>([])
const empresaOpen = ref(false)
const empresaFilterRef = ref<HTMLElement | null>(null)

const form = ref({
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
  data_nascimento: '',
  setores: [] as string[],
  funcoes: [] as string[],
  empresa_id: ''
})

const isAdmin = computed(() => authStore.userRole === 'administrador')

const empresaLabel = computed(() => {
  if (!form.value.empresa_id) return 'Selecione uma empresa'
  return empresas.value.find((e) => e.id === form.value.empresa_id)?.nome ?? 'Selecione uma empresa'
})

function onDocumentClick(event: MouseEvent) {
  if (empresaFilterRef.value && !empresaFilterRef.value.contains(event.target as Node)) {
    empresaOpen.value = false
  }
}

function formatDateInput(value?: string): string {
  if (!value) return ''
  return value.slice(0, 10)
}

async function loadSetoresFuncoes(empresaId?: string) {
  try {
    const [setoresRes, funcoesRes] = await Promise.all([
      getAllSetores(empresaId),
      getAllFuncoes(empresaId)
    ])
    setoresDisponiveis.value = setoresRes.data
    funcoesDisponiveis.value = funcoesRes.data
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => form.value.empresa_id,
  async (empresaId) => {
    if (!readyEmpresaWatch.value) return

    form.value.setores = []
    form.value.funcoes = []
    setoresDisponiveis.value = []
    funcoesDisponiveis.value = []

    if (isAdmin.value && empresaId) {
      await loadSetoresFuncoes(empresaId)
    }
  }
)

onMounted(async () => {
  document.addEventListener('click', onDocumentClick)

  try {
    if (isAdmin.value) {
      const { data } = await getAllEmpresas()
      empresas.value = data.data
    }

    const { data: funcionario } = await getFuncionario(route.params.id as string)
    const empresaId = funcionario.empresa_id || ''

    form.value.nome = funcionario.nome
    form.value.email = funcionario.email || ''
    form.value.cpf = funcionario.cpf ? maskCpf(funcionario.cpf) : ''
    form.value.telefone = maskPhone(funcionario.telefone || funcionario.contato || '')
    form.value.data_nascimento = formatDateInput(funcionario.data_nascimento)
    form.value.empresa_id = empresaId
    form.value.setores = funcionario.setores?.map((s: ISetor) => s.id) || []
    form.value.funcoes = funcionario.funcoes?.map((f: IFuncao) => f.id) || []

    await loadSetoresFuncoes(isAdmin.value ? empresaId || undefined : undefined)
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar funcionário')
    router.push('/dashboard/funcionarios')
  } finally {
    fetching.value = false
    readyEmpresaWatch.value = true
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

function onCpfInput(event: Event) {
  form.value.cpf = maskCpf((event.target as HTMLInputElement).value)
}

function onTelefoneInput(event: Event) {
  form.value.telefone = maskPhone((event.target as HTMLInputElement).value)
}

function toggleSetor(id: string) {
  const index = form.value.setores.indexOf(id)
  if (index > -1) {
    form.value.setores.splice(index, 1)
  } else {
    form.value.setores.push(id)
  }
}

function toggleFuncao(id: string) {
  const index = form.value.funcoes.indexOf(id)
  if (index > -1) {
    form.value.funcoes.splice(index, 1)
  } else {
    form.value.funcoes.push(id)
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

  if (!isValidOptionalCpf(form.value.cpf)) {
    toast.error('CPF inválido')
    return
  }

  const telefoneDigits = stripDigits(form.value.telefone)
  if (telefoneDigits && (telefoneDigits.length < 10 || telefoneDigits.length > 11)) {
    toast.error('Telefone inválido')
    return
  }

  try {
    loading.value = true
    const payload: Partial<IPostFuncionarioModel> & {
      telefone?: string
      data_nascimento?: string
    } = {
      nome: form.value.nome.trim(),
      email: form.value.email.trim() || '',
      ...(stripDigits(form.value.cpf) ? { cpf: stripDigits(form.value.cpf) } : {}),
      ...(telefoneDigits ? { contato: telefoneDigits, telefone: telefoneDigits } : {}),
      ...(form.value.data_nascimento ? { data_nascimento: form.value.data_nascimento } : {}),
      setores: [...form.value.setores],
      funcoes: [...form.value.funcoes],
      ...(isAdmin.value ? { empresa_id: form.value.empresa_id } : {})
    }

    await patchFuncionario(payload, route.params.id as string)
    toast.success('Funcionário atualizado com sucesso')
    router.push('/dashboard/funcionarios')
  } catch (error) {
    console.error(error)
    toast.error('Erro ao atualizar funcionário')
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/dashboard/funcionarios')
}
</script>

<template>
  <section class="novo-funcionario">
    <div class="novo-funcionario__heading">
      <button
        type="button"
        class="novo-funcionario__back"
        aria-label="Voltar para Funcionários"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="novo-funcionario__title dashboard_title">EDITAR FUNCIONÁRIO</h2>
    </div>

    <div v-if="fetching" class="novo-funcionario__loading">
      <p>Carregando…</p>
    </div>

    <div v-else class="novo-funcionario__panel">
      <form class="novo-funcionario__form" @submit.prevent="handleSubmit">
        <div v-if="isAdmin" class="novo-funcionario__field">
          <span class="novo-funcionario__label night-field-label" id="empresa-label">EMPRESA*</span>
          <div ref="empresaFilterRef" class="novo-funcionario__select">
            <button
              type="button"
              class="novo-funcionario__select-trigger"
              :class="{ 'is-placeholder': !form.empresa_id }"
              aria-haspopup="listbox"
              aria-labelledby="empresa-label"
              :aria-expanded="empresaOpen"
              @click.stop="toggleEmpresaMenu"
            >
              <span>{{ empresaLabel }}</span>
              <img
                class="novo-funcionario__select-chevron"
                :class="{ 'novo-funcionario__select-chevron--open': empresaOpen }"
                :src="iconChevronDown"
                width="16"
                height="9"
                alt=""
              />
            </button>

            <ul
              v-if="empresaOpen"
              class="novo-funcionario__select-menu"
              role="listbox"
              aria-labelledby="empresa-label"
            >
              <li>
                <button
                  type="button"
                  class="novo-funcionario__select-option"
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
                  class="novo-funcionario__select-option"
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

        <div class="novo-funcionario__row">
          <div class="novo-funcionario__field">
            <label class="novo-funcionario__label night-field-label" for="nome">NOME*</label>
            <input
              id="nome"
              v-model="form.nome"
              type="text"
              class="novo-funcionario__input"
              placeholder="Nome completo"
              required
            />
          </div>
          <div class="novo-funcionario__field">
            <label class="novo-funcionario__label night-field-label" for="cpf">CPF</label>
            <input
              id="cpf"
              v-model="form.cpf"
              type="text"
              class="novo-funcionario__input"
              placeholder="000.000.000-00"
              inputmode="numeric"
              autocomplete="off"
              @input="onCpfInput"
            />
          </div>
        </div>

        <div class="novo-funcionario__row">
          <div class="novo-funcionario__field">
            <label class="novo-funcionario__label night-field-label" for="data_nascimento">
              DATA DE NASCIMENTO
            </label>
            <input
              id="data_nascimento"
              v-model="form.data_nascimento"
              type="date"
              class="novo-funcionario__input"
            />
          </div>
          <div class="novo-funcionario__field">
            <label class="novo-funcionario__label night-field-label" for="telefone">TELEFONE</label>
            <input
              id="telefone"
              v-model="form.telefone"
              type="text"
              class="novo-funcionario__input"
              placeholder="(00) 00000-0000"
              inputmode="tel"
              autocomplete="tel"
              @input="onTelefoneInput"
            />
          </div>
        </div>

        <div class="novo-funcionario__field">
          <label class="novo-funcionario__label night-field-label" for="email">E-MAIL</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="novo-funcionario__input"
            placeholder="email@exemplo.com"
          />
        </div>

        <div class="novo-funcionario__field">
          <span class="novo-funcionario__label night-field-label">
            SETOR <span class="novo-funcionario__optional">(opcional)</span>
          </span>
          <div class="novo-funcionario__checks">
            <div v-if="isAdmin && !form.empresa_id" class="novo-funcionario__checks-empty">
              Selecione uma empresa primeiro
            </div>
            <div v-else-if="setoresDisponiveis.length === 0" class="novo-funcionario__checks-empty">
              Nenhum setor cadastrado
            </div>
            <label
              v-for="setor in setoresDisponiveis"
              :key="setor.id"
              class="novo-funcionario__check"
            >
              <input
                type="checkbox"
                :checked="form.setores.includes(setor.id)"
                @change="toggleSetor(setor.id)"
              />
              <span>{{ setor.nome }}</span>
            </label>
          </div>
        </div>

        <div class="novo-funcionario__field">
          <span class="novo-funcionario__label night-field-label">
            FUNÇÃO <span class="novo-funcionario__optional">(opcional)</span>
          </span>
          <div class="novo-funcionario__checks">
            <div v-if="isAdmin && !form.empresa_id" class="novo-funcionario__checks-empty">
              Selecione uma empresa primeiro
            </div>
            <div v-else-if="funcoesDisponiveis.length === 0" class="novo-funcionario__checks-empty">
              Nenhuma função cadastrada
            </div>
            <label
              v-for="funcao in funcoesDisponiveis"
              :key="funcao.id"
              class="novo-funcionario__check"
            >
              <input
                type="checkbox"
                :checked="form.funcoes.includes(funcao.id)"
                @change="toggleFuncao(funcao.id)"
              />
              <span>{{ funcao.nome }}</span>
            </label>
          </div>
        </div>

        <div class="novo-funcionario__actions">
          <button type="button" class="novo-funcionario__cancel" @click="goBack">
            CANCELAR
          </button>
          <button type="submit" class="novo-funcionario__submit" :disabled="loading">
            {{ loading ? 'Salvando…' : 'SALVAR' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.novo-funcionario {
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
    width: 1000px;
    max-width: 100%;
    box-sizing: border-box;
    padding: 48px 75px 40px;
    background: rgba(121, 121, 121, 0.1);
    border-radius: var(--night-radius, 30px);
  }

  &__form {
    width: 850px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }

  &__row {
    display: flex;
    gap: 13px;
    width: 100%;
  }

  &__field {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    min-width: 0;
    flex: 1;
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

  &__optional {
    font-weight: 400;
    text-transform: none;
    opacity: 0.8;
  }

  &__input {
    width: 100%;
    height: 49px;
    box-sizing: border-box;
    padding: 0 20px;
    border: none;
    border-radius: 30px;
    background: rgba(121, 121, 121, 0.3);
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
    color: #ffffff;
    outline: none;
    -webkit-text-fill-color: #ffffff;
    color-scheme: dark;

    &::placeholder {
      color: #f7f7f7;
      opacity: 0.6;
      -webkit-text-fill-color: #f7f7f7;
    }

    &::-webkit-calendar-picker-indicator {
      filter: invert(1);
      opacity: 0.7;
      cursor: pointer;
    }
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

  &__checks {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 14px 16px;
    min-height: 49px;
    border-radius: 30px;
    background: rgba(121, 121, 121, 0.3);
    max-height: 160px;
    overflow-y: auto;
  }

  &__checks-empty {
    font-family: 'Source Code Pro', monospace;
    font-size: 13px;
    font-weight: 300;
    color: #f7f7f7;
    opacity: 0.6;
    font-style: italic;
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

  @media (max-width: 1024px) {
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

    &__row {
      flex-direction: column;
      gap: 24px;
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
    &__select-trigger {
      height: 44px;
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
