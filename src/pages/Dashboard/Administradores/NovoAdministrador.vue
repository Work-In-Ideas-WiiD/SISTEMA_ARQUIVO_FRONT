<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import iconChevronLeft from '@/assets/imgs/administradores/icon-chevron-left.svg'
import { postAdministrador } from '@/services/http/administradores'

const router = useRouter()
const toast = useToast()

const nome = ref('')
const email = ref('')
const contato = ref('')
const cpf = ref('')
const fetching = ref(false)

async function handleSubmit() {
  if (fetching.value) return

  if (!nome.value || !email.value || !cpf.value || !contato.value) {
    toast.error('Preencha todos os campos')
    return
  }

  try {
    fetching.value = true
    await postAdministrador({
      nome: nome.value,
      email: email.value,
      cpf: cpf.value,
      contato: contato.value
    })
    toast.success('Administrador cadastrado')
    setTimeout(() => {
      router.push('/dashboard/admins')
    }, 2000)
  } catch (error) {
    toast.error('Erro ao cadastrar administrador')
    console.error(error)
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
      <h2 class="novo-admin__title dashboard_title">NOVO CADASTRO</h2>
    </div>

    <div class="novo-admin__panel">
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
          />
        </div>

        <button type="submit" class="novo-admin__submit" :disabled="fetching">
          {{ fetching ? 'Salvando…' : 'ADICIONAR ADMINISTRADOR' }}
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
