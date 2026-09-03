<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import logoWiidocs from '@/assets/imgs/login/logo-wiidocs-white.png'
import iconPerson from '@/assets/imgs/login/icon-person.svg'
import iconBuilding from '@/assets/imgs/login/icon-building.svg'
import iconLock from '@/assets/imgs/login/icon-lock.svg'
import iconBackCircle from '@/assets/imgs/login/icon-back-circle.svg'
import iconChevronLeft from '@/assets/imgs/login/icon-chevron-left.svg'
import {
  maskCpf,
  maskCnpj,
  isValidOptionalCpf,
  isValidOptionalCnpj
} from '@/utils/formatCpfCnpj'

const toast = useToast()
const auth = useAuthStore()

const form = ref({
  nome: '',
  nome_empresa: '',
  email: '',
  cpf: '',
  cnpj: '',
  password: '',
  password_confirmation: ''
})

function onCpfInput(event: Event) {
  form.value.cpf = maskCpf((event.target as HTMLInputElement).value)
}

function onCnpjInput(event: Event) {
  form.value.cnpj = maskCnpj((event.target as HTMLInputElement).value)
}

async function handleSubmit() {
  if (!form.value.nome || !form.value.email || !form.value.nome_empresa) {
    toast.error('Preencha nome, e-mail e nome da empresa.')
    return
  }
  if (!isValidOptionalCpf(form.value.cpf)) {
    toast.error('CPF inválido. Informe 11 dígitos ou deixe em branco.')
    return
  }
  if (!isValidOptionalCnpj(form.value.cnpj)) {
    toast.error('CNPJ inválido. Informe 14 dígitos ou deixe em branco.')
    return
  }
  if (form.value.password.length < 8) {
    toast.error('A senha deve ter ao menos 8 caracteres.')
    return
  }
  if (form.value.password !== form.value.password_confirmation) {
    toast.error('As senhas não conferem.')
    return
  }

  const cpfDigits = form.value.cpf.replace(/\D/g, '')
  const cnpjDigits = form.value.cnpj.replace(/\D/g, '')

  try {
    await auth.signUp({
      nome: form.value.nome,
      nome_empresa: form.value.nome_empresa,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      cpf: cpfDigits || undefined,
      cnpj: cnpjDigits || undefined
    })
  } catch {
    // erro já tratado (toast) na store
  }
}
</script>

<template>
  <main class="login_page">
    <p class="login_page__watermark" aria-hidden="true">&lt;/DOC</p>

    <RouterLink class="back_btn" to="/" aria-label="Voltar">
      <img class="back_btn__circle" :src="iconBackCircle" alt="" width="66" height="66" />
      <img class="back_btn__icon" :src="iconChevronLeft" alt="" width="40" height="40" />
    </RouterLink>

    <form class="login_form" @submit.prevent="handleSubmit">
      <img class="login_form__logo" :src="logoWiidocs" alt="WiiDocs" />

      <div class="login_form__fields">
        <label class="login_field">
          <span class="login_field__icon" aria-hidden="true">
            <img :src="iconPerson" alt="" width="13.27" height="13.27" />
          </span>
          <input
            v-model="form.nome"
            type="text"
            placeholder="Seu nome"
            autocomplete="name"
            required
          />
        </label>

        <label class="login_field">
          <span class="login_field__icon" aria-hidden="true">
            <img :src="iconBuilding" alt="" width="11" height="13" />
          </span>
          <input
            v-model="form.nome_empresa"
            type="text"
            placeholder="Nome da empresa"
            autocomplete="organization"
            required
          />
        </label>

        <label class="login_field">
          <span class="login_field__icon" aria-hidden="true">
            <img :src="iconPerson" alt="" width="13.27" height="13.27" />
          </span>
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            autocomplete="email"
            required
          />
        </label>

        <label class="login_field">
          <span class="login_field__icon" aria-hidden="true">
            <img :src="iconPerson" alt="" width="13.27" height="13.27" />
          </span>
          <input
            :value="form.cpf"
            type="text"
            inputmode="numeric"
            placeholder="CPF"
            maxlength="14"
            autocomplete="off"
            @input="onCpfInput"
          />
        </label>

        <label class="login_field">
          <span class="login_field__icon" aria-hidden="true">
            <img :src="iconBuilding" alt="" width="11" height="13" />
          </span>
          <input
            :value="form.cnpj"
            type="text"
            inputmode="numeric"
            placeholder="CNPJ"
            maxlength="18"
            autocomplete="off"
            @input="onCnpjInput"
          />
        </label>

        <label class="login_field">
          <span class="login_field__icon" aria-hidden="true">
            <img :src="iconLock" alt="" width="11.77" height="13.45" />
          </span>
          <input
            v-model="form.password"
            type="password"
            placeholder="Senha"
            autocomplete="new-password"
            required
          />
        </label>

        <label class="login_field">
          <span class="login_field__icon" aria-hidden="true">
            <img :src="iconLock" alt="" width="11.77" height="13.45" />
          </span>
          <input
            v-model="form.password_confirmation"
            type="password"
            placeholder="Confirmar senha"
            autocomplete="new-password"
            required
          />
        </label>
      </div>

      <div class="login_form__actions">
        <button type="submit" class="login_btn login_btn--primary" :disabled="auth.fetching">
          <LoadingSpinner v-if="auth.fetching" />
          <span v-else>CADASTRAR</span>
        </button>
      </div>

      <RouterLink class="login_form__first_access" to="/">
        Já tem conta? <span>Entrar.</span>
      </RouterLink>
    </form>
  </main>
</template>

<style lang="scss" scoped>
@import '@/styles/login-night-mobile.scss';

.login_page {
  --login-black: #212121;
  --login-magenta: #ff00ff;
  --login-gray: #f7f7f7;
  --login-input-bg: rgba(255, 255, 255, 0.2);

  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(119deg, var(--login-black) 0%, var(--login-magenta) 90%);
  font-family: 'Source Code Pro', monospace;

  @include login-mobile-gradient;
  @include login-mobile-shell;

  &__watermark {
    position: absolute;
    z-index: 0;
    top: 80.28vh;
    right: -1.82vw;
    bottom: auto;
    margin: 0;
    font-size: clamp(90px, 24.07vh, 260px);
    font-weight: 700;
    line-height: 0.9;
    color: var(--login-gray);
    pointer-events: none;
    user-select: none;
    white-space: nowrap;

    @include login-mobile-watermark-hidden;
  }
}

@media (min-width: 960px) and (max-width: 1080px) and (min-height: 700px) and (max-height: 820px) and (max-aspect-ratio: 16/10) {
  .login_page__watermark {
    top: auto;
    bottom: -5vh;
    right: -2vw;
    font-size: clamp(76px, 19.5vh, 180px);
  }
}

.back_btn {
  position: fixed;
  z-index: 10;
  top: clamp(24px, 3.5vh, 48px);
  left: clamp(16px, 3vw, 48px);
  width: 66px;
  height: 66px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: opacity 0.15s ease;

  @include login-mobile-back-btn;

  &:hover {
    opacity: 0.85;
  }

  &__circle {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  &__icon {
    position: relative;
    z-index: 1;
    width: 40px;
    height: 40px;
    transform: rotate(90deg);
    object-fit: contain;
    display: block;

    @include login-mobile-back-btn-icon;
  }
}

.login_form {
  position: relative;
  z-index: 2;
  width: min(100%, 358px);
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(12px, 2.2vh, 24px) 16px clamp(16px, 4.4vh, 48px);

  &__logo {
    width: clamp(180px, 22vw, 242px);
    max-width: 70%;
    height: auto;
    margin-bottom: clamp(20px, 3.6vh, 40px);
    object-fit: contain;
  }

  &__fields {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  &__actions {
    margin-top: clamp(20px, 3.7vh, 40px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(10px, 1.4vh, 15px);
  }

  &__first_access {
    position: relative;
    z-index: 2;
    margin-top: clamp(16px, 2.6vh, 28px);
    font-size: 13px;
    font-weight: 400;
    color: var(--login-gray);
    text-align: center;

    span {
      font-weight: 600;
      text-decoration: underline;
    }

    &:hover {
      opacity: 0.85;
    }
  }
}

.login_field {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 49px;
  padding: 0 22px;
  border-radius: 30px;
  background: var(--login-input-bg);
  overflow: hidden;
  cursor: text;

  &__icon {
    @include login-field-icon;
  }

  input {
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: #fff;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 400;

    &::placeholder {
      color: rgba(255, 255, 255, 0.85);
    }

    @include login-input-autofill(#fff);
  }
}

.login_btn {
  width: 168px;
  height: 49px;
  box-sizing: border-box;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Source Code Pro', monospace;
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0;
  text-decoration: none;
  border: none;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  &--primary {
    background: #f7f7f7;
    color: #212121;
  }
}

@media (max-width: 768px) {
  .login_form {
    width: 100%;
    max-width: 358px;
    max-height: none;
    margin: 0 auto;
    padding: 90px 18px 40px;
    box-sizing: border-box;

    &__logo {
      width: 168px;
      max-width: none;
      margin-bottom: 40px;
    }

    &__fields {
      gap: 15px;
    }

    &__actions {
      margin-top: 32px;
    }

    &__first_access {
      display: block;
      margin-top: 28px;
      font-size: 13px;
    }
  }
}

@media (max-height: 820px) {
  .login_field {
    height: 44px;
  }

  .login_btn {
    height: 44px;
  }
}

@media (max-width: 480px) {
  .login_form {
    &__logo {
      margin-bottom: 32px;
    }

    &__actions {
      margin-top: 24px;
    }
  }
}
</style>
