<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import logoWiidocs from '@/assets/imgs/login/logo-wiidocs-white.png'
import iconBuilding from '@/assets/imgs/login/icon-building.svg'
import iconPerson from '@/assets/imgs/login/icon-person.svg'
import iconLock from '@/assets/imgs/login/icon-lock.svg'

const authStore = useAuthStore()

const companyId = ref('')
const email = ref('')
const password = ref('')

async function handleLogin() {
  await authStore.signInCustomer(email.value, password.value, companyId.value)
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
            <img :src="iconBuilding" alt="" width="11" height="13" />
          </span>
          <input
            v-model="companyId"
            type="text"
            placeholder="ID da Empresa"
            autocomplete="organization"
          />
        </label>

        <label class="login_field">
          <span class="login_field__icon" aria-hidden="true">
            <img :src="iconPerson" alt="" width="14" height="14" />
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
            <img :src="iconLock" alt="" width="12" height="14" />
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
        <RouterLink class="login_form__link" to="/recuperar/email/cliente">
          Esqueci a senha.
        </RouterLink>
        <RouterLink class="login_form__link" to="/">
          Entrar como empresa.
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
    margin-bottom: clamp(20px, 4.5vh, 56px);
    object-fit: contain;
  }

  &__fields {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: clamp(10px, 1.4vh, 15px);
  }

  &__links {
    width: 100%;
    margin-top: clamp(12px, 1.8vh, 16px);
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
    margin-top: clamp(16px, 3vh, 40px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(10px, 1.4vh, 15px);
  }

  &__first_access {
    position: relative;
    z-index: 2;
    margin-top: clamp(14px, 2.2vh, 28px);
    font-family: 'Source Code Pro', monospace;
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
  cursor: text;

  &__icon {
    width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
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

.login_btn {
  width: 168px;
  height: 49px;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Source Code Pro', monospace;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.02em;
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
    background: var(--login-gray);
    color: var(--login-black);
  }

  &--outline {
    background: transparent;
    color: var(--login-gray);
    border: 2px solid var(--login-gray);
  }
}

@media (max-height: 820px) {
  .login_form {
    &__logo {
      margin-bottom: clamp(16px, 3vh, 40px);
    }

    &__links {
      margin-top: clamp(8px, 1.4vh, 14px);
      gap: 4px;
    }

    &__actions {
      margin-top: clamp(12px, 2.2vh, 28px);
    }

    &__first_access {
      font-size: 12px;
      margin-top: clamp(10px, 1.6vh, 20px);
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
      margin-bottom: clamp(16px, 3.5vh, 36px);
    }

    &__actions {
      margin-top: clamp(12px, 2.5vh, 28px);
    }
  }
}
</style>
