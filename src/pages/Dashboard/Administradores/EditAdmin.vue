<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import {
  getAdministrador,
  patchAdministrador,
  postEnviarRecuperacaoSenha
} from '@/services/http/administradores'
import { maskCpf } from '@/utils/formatCpfCnpj'
import { maskPhone, stripDigits } from '@/utils/formatPhone'
import { getApiErrorMessage } from '@/utils/apiError'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const nome = ref('')
const email = ref('')
const contato = ref('')
const cpf = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const fetching = ref(false)
const sendingRecovery = ref(false)
const loading = ref(true)

const adminId = route.params.id as string

onMounted(async () => {
  try {
    const { data } = await getAdministrador(adminId)
    nome.value = data.nome || ''
    email.value = data.email || ''
    contato.value = data.contato ? maskPhone(data.contato) : ''
    cpf.value = data.cpf ? maskCpf(data.cpf) : ''
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao carregar administrador'))
    router.push('/dashboard/admins')
  } finally {
    loading.value = false
  }
})

function onCpfInput(event: Event) {
  cpf.value = maskCpf((event.target as HTMLInputElement).value)
}

function onContatoInput(event: Event) {
  contato.value = maskPhone((event.target as HTMLInputElement).value)
}

async function handleSendRecovery() {
  if (sendingRecovery.value) return
  try {
    sendingRecovery.value = true
    const { data } = await postEnviarRecuperacaoSenha(adminId)
    toast.success(data.message || 'E-mail de recuperação enviado')
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao enviar recuperação de senha'))
  } finally {
    sendingRecovery.value = false
  }
}

async function handleSubmit() {
  if (fetching.value) return

  const cpfDigits = stripDigits(cpf.value)
  const contatoDigits = stripDigits(contato.value)

  if (!nome.value.trim() || !cpfDigits || !contatoDigits) {
    toast.error('Preencha todos os campos')
    return
  }

  if (cpfDigits.length !== 11) {
    toast.error('CPF inválido')
    return
  }

  if (contatoDigits.length < 10 || contatoDigits.length > 11) {
    toast.error('Contato inválido')
    return
  }

  if (password.value || passwordConfirmation.value) {
    if (password.value.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres')
      return
    }
    if (password.value !== passwordConfirmation.value) {
      toast.error('A confirmação da nova senha não confere')
      return
    }
  }

  try {
    fetching.value = true
    const payload: Parameters<typeof patchAdministrador>[0] = {
      nome: nome.value.trim(),
      cpf: cpfDigits,
      contato: contatoDigits
    }
    if (password.value) {
      payload.password = password.value
      payload.password_confirmation = passwordConfirmation.value
    }
    await patchAdministrador(payload, adminId)
    toast.success('Administrador atualizado')
    password.value = ''
    passwordConfirmation.value = ''
    setTimeout(() => {
      router.push('/dashboard/admins')
    }, 2000)
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'Erro ao atualizar administrador'))
  } finally {
    fetching.value = false
  }
}

function goBack() {
  router.push('/dashboard/admins')
}
</script>

<template>
  <section class="admin-form-night">
    <div class="admin-form-night__heading">
      <button
        type="button"
        class="admin-form-night__back"
        aria-label="Voltar para Administradores"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="admin-form-night__title dashboard_title">EDITAR ADMINISTRADOR</h2>
    </div>

    <div v-if="loading" class="admin-form-night__loading">
      <p>Carregando…</p>
    </div>

    <div v-else class="admin-form-night__panel">
      <form class="admin-form-night__form" @submit.prevent="handleSubmit">
        <div class="admin-form-night__field">
          <label class="admin-form-night__label night-field-label" for="nome">NOME DO ADMINISTRADOR</label>
          <input
            id="nome"
            v-model="nome"
            type="text"
            class="admin-form-night__input"
            placeholder="Nome completo"
          />
        </div>

        <div class="admin-form-night__field">
          <label class="admin-form-night__label night-field-label" for="email">E-MAIL</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="admin-form-night__input"
            placeholder="contato@email.com"
            disabled
          />
        </div>

        <div class="admin-form-night__field">
          <label class="admin-form-night__label night-field-label" for="contato">CONTATO</label>
          <input
            id="contato"
            v-model="contato"
            type="text"
            class="admin-form-night__input"
            placeholder="(00) 00000-0000"
            inputmode="tel"
            autocomplete="tel"
            @input="onContatoInput"
          />
        </div>

        <div class="admin-form-night__field">
          <label class="admin-form-night__label night-field-label" for="cpf">CPF</label>
          <input
            id="cpf"
            v-model="cpf"
            type="text"
            class="admin-form-night__input"
            placeholder="000.000.000-00"
            inputmode="numeric"
            autocomplete="off"
            @input="onCpfInput"
          />
        </div>

        <div class="admin-form-night__field">
          <label class="admin-form-night__label night-field-label" for="password">NOVA SENHA</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="admin-form-night__input"
            placeholder="Deixe em branco para manter"
            autocomplete="new-password"
          />
        </div>

        <div class="admin-form-night__field">
          <label class="admin-form-night__label night-field-label" for="password_confirmation">
            CONFIRMAR NOVA SENHA
          </label>
          <input
            id="password_confirmation"
            v-model="passwordConfirmation"
            type="password"
            class="admin-form-night__input"
            placeholder="Repita a nova senha"
            autocomplete="new-password"
          />
        </div>

        <div class="admin-form-night__actions">
          <button
            type="button"
            class="admin-form-night__secondary"
            :disabled="sendingRecovery || fetching"
            @click="handleSendRecovery"
          >
            {{ sendingRecovery ? 'Enviando…' : 'ENVIAR RECUPERAÇÃO DE SENHA' }}
          </button>

          <button type="submit" class="admin-form-night__submit" :disabled="fetching">
            {{ fetching ? 'Salvando…' : 'SALVAR ALTERAÇÕES' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/styles/admin-form-night.scss';

.admin-form-night__actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 8px;

  .admin-form-night__submit,
  .admin-form-night__secondary {
    margin: 0;
  }
}

.admin-form-night__secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  min-width: 295px;
  max-width: 100%;
  height: 46px;
  padding: 0 28px;
  border: 1px solid rgba(247, 247, 247, 0.7);
  border-radius: 30px;
  background: transparent;
  color: #ffffff;
  font-family: var(--night-font, 'Inter', sans-serif);
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
}
</style>
