<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import { getAdministrador, patchAdministrador } from '@/services/http/administradores'
import { maskCpf } from '@/utils/formatCpfCnpj'
import { maskPhone, stripDigits } from '@/utils/formatPhone'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const nome = ref('')
const email = ref('')
const contato = ref('')
const cpf = ref('')
const fetching = ref(false)
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
    toast.error('Erro ao carregar administrador')
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

  try {
    fetching.value = true
    await patchAdministrador(
      {
        nome: nome.value.trim(),
        cpf: cpfDigits,
        contato: contatoDigits
      },
      adminId
    )
    toast.success('Administrador atualizado')
    setTimeout(() => {
      router.push('/dashboard/admins')
    }, 2000)
  } catch (error) {
    toast.error('Erro ao atualizar administrador')
  } finally {
    fetching.value = false
  }
}

function goBack() {
  router.push('/dashboard/admins')
}
</script>

<template>
  <section class="novo-admin">
    <div class="novo-admin__heading">
      <button
        type="button"
        class="novo-admin__back"
        aria-label="Voltar para Administradores"
        @click="goBack"
      >
        <img :src="iconChevronLeft" width="24" height="24" alt="" />
      </button>
      <h2 class="novo-admin__title dashboard_title">EDITAR ADMINISTRADOR</h2>
    </div>

    <div v-if="loading" class="novo-admin__loading">
      <p>Carregando…</p>
    </div>

    <div v-else class="novo-admin__panel">
      <form class="novo-admin__form" @submit.prevent="handleSubmit">
        <div class="novo-admin__field">
          <label class="novo-admin__label night-field-label" for="nome">NOME DO ADMINISTRADOR</label>
          <input
            id="nome"
            v-model="nome"
            type="text"
            class="novo-admin__input"
            placeholder="Nome completo"
          />
        </div>

        <div class="novo-admin__field">
          <label class="novo-admin__label night-field-label" for="email">E-MAIL</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="novo-admin__input"
            placeholder="contato@email.com"
            disabled
          />
        </div>

        <div class="novo-admin__field">
          <label class="novo-admin__label night-field-label" for="contato">CONTATO</label>
          <input
            id="contato"
            v-model="contato"
            type="text"
            class="novo-admin__input"
            placeholder="(00) 00000-0000"
            inputmode="tel"
            autocomplete="tel"
            @input="onContatoInput"
          />
        </div>

        <div class="novo-admin__field">
          <label class="novo-admin__label night-field-label" for="cpf">CPF</label>
          <input
            id="cpf"
            v-model="cpf"
            type="text"
            class="novo-admin__input"
            placeholder="000.000.000-00"
            inputmode="numeric"
            autocomplete="off"
            @input="onCpfInput"
          />
        </div>

        <button type="submit" class="novo-admin__submit" :disabled="fetching">
          {{ fetching ? 'Salvando…' : 'SALVAR ALTERAÇÕES' }}
        </button>
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.novo-admin {
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
    align-items: flex-start;
    gap: 24px;
  }

  &__field {
    width: 650px;
    max-width: 100%;
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

    &::placeholder {
      color: #f7f7f7;
      opacity: 0.6;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: auto;
    min-width: 295px;
    max-width: 100%;
    height: 46px;
    margin: 8px auto 0;
    align-self: center;
    padding: 0 28px;
    border: none;
    border-radius: 30px;
    background: #ff00ff;
    color: #ffffff;
    font-family: 'Source Code Pro', monospace;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0;
    text-transform: uppercase;
    white-space: nowrap;
    cursor: pointer;

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
      padding: 32px 24px 32px;
    }

    &__form,
    &__field {
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

    &__submit {
      height: 44px;
      font-size: 14px;
    }
  }
}
</style>
