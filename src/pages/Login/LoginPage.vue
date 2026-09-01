<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import logoWiidocs from '@/assets/imgs/login/logo-wiidocs-white.png'
import iconPerson from '@/assets/imgs/login/icon-person.svg'
import iconLock from '@/assets/imgs/login/icon-lock.svg'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleLogin() {
  await authStore.signIn(email.value, password.value)
}
</script>

<template>
  <main class="login_page">
    <p class="login_page__watermark" aria-hidden="true">&lt;/DOC</p>

    <form class="login_form" @submit.prevent="handleLogin">
      <img class="login_form__logo" :src="logoWiidocs" alt="WiiDocs" />

      <div class="login_form__fields">
        <label class="login_field">
          <span class="login_field__icon" aria-hidden="true">
            <img :src="iconPerson" alt="" width="13.27" height="13.27" />
          </span>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            autocomplete="email"
          />
        </label>

        <label class="login_field">
          <span class="login_field__icon" aria-hidden="true">
            <img :src="iconLock" alt="" width="11.77" height="13.45" />
          </span>
          <input
            v-model="password"
            type="password"
            placeholder="Senha"
            autocomplete="current-password"
          />
        </label>
      </div>

      <div class="login_form__links">
        <RouterLink class="login_form__link" to="/recuperar/email/empresa">
          Esqueci a senha.
        </RouterLink>
        <RouterLink class="login_form__link" to="/cliente">
          Entrar como cliente.
        </RouterLink>
      </div>

      <div class="login_form__actions">
        <button type="submit" class="login_btn login_btn--primary" :disabled="authStore.fetching">
          <LoadingSpinner v-if="authStore.fetching" />
          <span v-else>ENTRAR</span>
        </button>

        <RouterLink class="login_btn login_btn--outline" to="/cadastro">
          CADASTRAR
        </RouterLink>
      </div>

      <RouterLink class="login_form__first_access" to="/primeiroacesso">
        É seu primeiro acesso? <span>Cadastrar senha.</span>
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
    /* Figma 1920×1080: top 867px (80.28vh), font 260px (24.07vh) */
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

/* 1024×768 (4:3) — ajuste fino: watermark no canto, sem cortar demais */
@media (min-width: 960px) and (max-width: 1080px) and (min-height: 700px) and (max-height: 820px) and (max-aspect-ratio: 16/10) {
  .login_page__watermark {
    top: auto;
    bottom: -5vh;
    right: -2vw;
    font-size: clamp(76px, 19.5vh, 180px);
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

  @include login-form-mobile;

  &__logo {
    width: clamp(180px, 22vw, 242px);
    max-width: 70%;
    height: auto;
    margin-bottom: clamp(24px, 5.2vh, 56px);
    object-fit: contain;
  }

  &__fields {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  &__links {
    width: 100%;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }

  &__link {
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    color: #f7f7f7;
    text-align: right;
    text-decoration: underline;
    text-decoration-skip-ink: none;
    text-underline-position: from-font;

    &:hover {
      opacity: 0.85;
    }
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

  &--outline {
    background: transparent;
    color: #f7f7f7;
    border: 2px solid #f7f7f7;
  }
}

@media (max-height: 820px) {
  .login_form {
    &__links {
      margin-top: clamp(10px, 1.8vh, 16px);
      gap: 4px;
    }

    &__first_access {
      font-size: 12px;
    }
  }

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
      margin-bottom: clamp(20px, 4vh, 40px);
    }

    &__actions {
      margin-top: clamp(16px, 3vh, 32px);
    }
  }
}
</style>
