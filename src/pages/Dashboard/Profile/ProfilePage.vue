<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import { patchUser } from '@/services/http/user'
import {
  isValidOptionalCnpj,
  isValidOptionalCpf,
  maskCnpj,
  maskCpf
} from '@/utils/formatCpfCnpj'
import { maskPhone, stripDigits } from '@/utils/formatPhone'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const nome = ref('')
const email = ref('')
const contato = ref('')
const cpf = ref('')
const cnpj = ref('')
const nomeEmpresa = ref('')
const fetching = ref(false)

const userRole = computed(() => authStore.userRole)
const isEmpresa = computed(() => userRole.value === 'empresa')

const nomeLabel = computed(() => {
  if (userRole.value === 'empresa') return 'NOME DO RESPONSÁVEL'
  if (userRole.value === 'cliente') return 'NOME'
  return 'NOME DO ADMINISTRADOR'
})

onMounted(() => {
  if (!authStore.me) return

  nome.value = authStore.me.nome || ''
  email.value = authStore.me.email || ''
  contato.value = authStore.me.contato ? maskPhone(authStore.me.contato) : ''
  cpf.value = authStore.me.cpf ? maskCpf(authStore.me.cpf) : ''
  cnpj.value = authStore.me.cnpj ? maskCnpj(authStore.me.cnpj) : ''
  nomeEmpresa.value = authStore.me.nome_empresa || ''
})

function onCpfInput(event: Event) {
  cpf.value = maskCpf((event.target as HTMLInputElement).value)
}

function onCnpjInput(event: Event) {
  cnpj.value = maskCnpj((event.target as HTMLInputElement).value)
}

function onContatoInput(event: Event) {
  contato.value = maskPhone((event.target as HTMLInputElement).value)
}

async function handleSubmit() {
  if (fetching.value || !authStore.me?.id) return

  if (!nome.value.trim()) {
    toast.error('Nome é obrigatório')
    return
  }

  if (!isValidOptionalCpf(cpf.value)) {
    toast.error('CPF inválido')
    return
  }

  if (!isValidOptionalCnpj(cnpj.value)) {
    toast.error('CNPJ inválido')
    return
  }

  const contatoDigits = stripDigits(contato.value)
  if (contatoDigits && (contatoDigits.length < 10 || contatoDigits.length > 11)) {
    toast.error('Contato inválido')
    return
  }

  try {
    fetching.value = true

    const payload: Record<string, string> = {
      nome: nome.value.trim(),
      ...(contatoDigits ? { contato: contatoDigits } : {})
    }

    const cpfDigits = stripDigits(cpf.value)
    if (cpfDigits) payload.cpf = cpfDigits

    if (isEmpresa.value) {
      const cnpjDigits = stripDigits(cnpj.value)
      if (cnpjDigits) payload.cnpj = cnpjDigits
      if (nomeEmpresa.value.trim()) payload.nome_empresa = nomeEmpresa.value.trim()
    }

    await patchUser(payload, authStore.me.id)
    await authStore.refreshUserData()
    toast.success('Perfil atualizado')
    setTimeout(() => router.push('/dashboard/home'), 1500)
  } catch (error) {
    toast.error('Erro ao editar perfil')
    console.error(error)
  } finally {
    fetching.value = false
  }
}

function goBack() {
  router.push('/dashboard/home')
}
</script>

<template>
  <main class="perfil dashboard_padding">
    <div class="perfil__heading">
      <button
        type="button"
        class="perfil__back"
        aria-label="Voltar para Home"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="perfil__title dashboard_title">PERFIL</h2>
    </div>

    <div class="perfil__panel">
      <form class="perfil__form" @submit.prevent="handleSubmit">
        <div class="perfil__field">
          <label class="perfil__label night-field-label" for="nome">{{ nomeLabel }}</label>
          <input
            id="nome"
            v-model="nome"
            type="text"
            class="perfil__input"
            placeholder="Nome completo"
            required
          />
        </div>

        <div v-if="isEmpresa" class="perfil__field">
          <label class="perfil__label night-field-label" for="nome_empresa">NOME DA EMPRESA</label>
          <input
            id="nome_empresa"
            v-model="nomeEmpresa"
            type="text"
            class="perfil__input"
            placeholder="Nome da empresa"
          />
        </div>

        <div class="perfil__field">
          <label class="perfil__label night-field-label" for="email">E-MAIL</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="perfil__input"
            placeholder="email@exemplo.com"
            disabled
          />
        </div>

        <div class="perfil__field">
          <label class="perfil__label night-field-label" for="contato">CONTATO</label>
          <input
            id="contato"
            v-model="contato"
            type="text"
            class="perfil__input"
            placeholder="(00) 00000-0000"
            inputmode="tel"
            autocomplete="tel"
            @input="onContatoInput"
          />
        </div>

        <div v-if="!isEmpresa" class="perfil__field">
          <label class="perfil__label night-field-label" for="cpf">CPF</label>
          <input
            id="cpf"
            v-model="cpf"
            type="text"
            class="perfil__input"
            placeholder="000.000.000-00"
            inputmode="numeric"
            autocomplete="off"
            @input="onCpfInput"
          />
        </div>

        <div v-if="isEmpresa" class="perfil__field">
          <label class="perfil__label night-field-label" for="cnpj">CNPJ</label>
          <input
            id="cnpj"
            v-model="cnpj"
            type="text"
            class="perfil__input"
            placeholder="00.000.000/0000-00"
            inputmode="numeric"
            autocomplete="off"
            @input="onCnpjInput"
          />
        </div>

        <div class="perfil__actions">
          <button type="button" class="perfil__cancel" @click="goBack">
            CANCELAR
          </button>
          <button type="submit" class="perfil__submit" :disabled="fetching">
            {{ fetching ? 'Salvando…' : 'SALVAR' }}
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.perfil {
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

    &::placeholder {
      color: #f7f7f7;
      opacity: 0.6;
      -webkit-text-fill-color: #f7f7f7;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      color: #f7f7f7;
      -webkit-text-fill-color: #f7f7f7;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
      -webkit-text-fill-color: #ffffff !important;
      caret-color: #ffffff;
      -webkit-box-shadow: 0 0 0 1000px rgba(121, 121, 121, 0.3) inset !important;
      transition: background-color 99999s ease-in-out 0s;
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

    &__input {
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
