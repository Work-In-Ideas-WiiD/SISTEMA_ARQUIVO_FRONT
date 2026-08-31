<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { postForgotPassword } from '@/services/http/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import iconPerson from '@/assets/imgs/login/icon-person.svg'
import iconBackCircle from '@/assets/imgs/login/icon-back-circle.svg'
import iconChevronLeft from '@/assets/imgs/login/icon-chevron-left.svg'

const route = useRoute()
const toast = useToast()

const email = ref('')
const loading = ref(false)
const target = route.params.target as string

const loginPath = computed(() => (target === 'cliente' ? '/cliente' : '/'))

async function handleSubmit() {
  try {
    loading.value = true
    await postForgotPassword(email.value, target)
    toast.success('Um e-mail foi enviado com instruções para recuperar sua senha.')
  } catch (error) {
    console.error(error)
    toast.error('Ocorreu um erro. Verifique o e-mail informado.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <RouterLink class="back_btn" :to="loginPath" aria-label="Voltar">
    <img class="back_btn__circle" :src="iconBackCircle" alt="" width="66" height="66" />
    <img class="back_btn__icon" :src="iconChevronLeft" alt="" width="40" height="40" />
  </RouterLink>

  <form class="recover_form" @submit.prevent="handleSubmit">
    <h1 class="recover_form__title">Recuperar a senha</h1>
    <p class="recover_form__subtitle">
      <span class="auth_subtitle-line auth_subtitle-line--desktop">
        Informe seu e-mail para recuperar a senha.
      </span>
      <span class="auth_subtitle-line auth_subtitle-line--mobile">
        Informe seu e-mail para<br />recuperar a senha.
      </span>
    </p>

    <label class="recover_field">
      <span class="recover_field__icon" aria-hidden="true">
        <img :src="iconPerson" alt="" width="13.27" height="13.27" />
      </span>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        autocomplete="email"
        required
      />
    </label>

    <button type="submit" class="recover_btn" :disabled="loading">
      <LoadingSpinner v-if="loading" />
      <span v-else>ENVIAR</span>
    </button>

    <RouterLink class="recover_form__back_link" :to="loginPath">
      Voltar para login.
    </RouterLink>
  </form>
</template>

<style lang="scss" scoped>
@import '@/styles/login-night-mobile.scss';

.back_btn {
  position: absolute;
  z-index: 3;
  top: clamp(24px, 17.2vh, 186px);
  left: clamp(16px, 24vw, 461px);
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
    width: 40px;
    height: 40px;
    transform: rotate(90deg);
    object-fit: contain;
    display: block;

    @include login-mobile-back-btn-icon;
  }
}

.recover_form {
  position: relative;
  z-index: 2;
  width: min(100%, 358px);
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(12px, 2.2vh, 24px) 16px clamp(16px, 4.4vh, 48px);

  &__title {
    margin: 0;
    font-family: 'Source Code Pro', monospace;
    font-size: 20px;
    font-weight: 700;
    line-height: normal;
    color: #f7f7f7;
    text-align: center;
  }

  &__subtitle {
    margin: clamp(12px, 1.6vh, 17px) 0 0;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
    color: #f7f7f7;
    text-align: center;
    white-space: nowrap;

    @include auth-subtitle-lines;
  }

  &__back_link {
    margin-top: clamp(20px, 3vh, 32px);
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
    color: #f7f7f7;
    text-align: center;
    text-decoration: none;

    &:hover {
      opacity: 0.85;
    }
  }
}

.recover_field {
  width: 100%;
  margin-top: clamp(20px, 2.8vh, 29px);
  display: flex;
  align-items: center;
  gap: 12px;
  height: 49px;
  padding: 0 22px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.2);
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
  }
}

.recover_btn {
  width: 168px;
  height: 49px;
  margin-top: clamp(32px, 5.1vh, 55px);
  border: none;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f7f7f7;
  color: #212121;
  font-family: 'Source Code Pro', monospace;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
}

@media (max-height: 820px) and (min-width: 769px) {
  .back_btn {
    top: clamp(16px, 2.5vh, 48px);
    left: clamp(16px, 4vw, 48px);
    width: 56px;
    height: 56px;

    &__icon {
      width: 32px;
      height: 32px;
    }
  }

  .recover_field {
    height: 44px;
  }

  .recover_btn {
    height: 44px;
    margin-top: clamp(24px, 4vh, 40px);
  }

  .recover_form__back_link {
    margin-top: clamp(16px, 2.2vh, 24px);
  }
}

@media (max-width: 768px) {
  .recover_form {
    width: 100%;
    max-width: 358px;
    min-height: 100dvh;
    margin: 0 auto;
    padding: 69px 18px 40px;
    box-sizing: border-box;
    align-items: stretch;
  }

  .recover_form__subtitle {
    margin-top: 26px;
  }

  .recover_form__back_link {
    display: none;
  }

  .recover_field {
    margin-top: 99px;
    height: 49px;
  }

  .recover_btn {
    margin-top: auto;
    margin-left: auto;
    margin-right: auto;
    height: 49px;
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
