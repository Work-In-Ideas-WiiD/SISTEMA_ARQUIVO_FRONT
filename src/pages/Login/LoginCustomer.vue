<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import IconInput from '@/components/inputs/IconInput/IconInput.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const companyId = ref('')

async function handleLogin() {
  await authStore.signInCustomer(email.value, password.value, companyId.value)
}
</script>

<template>
  <main class="main">
    <form @submit.prevent="handleLogin">
      <img class="logo" src="@/assets/imgs/logo_login.png" alt="logo" />
      <div class="input_container">
        <IconInput
          v-model="companyId"
          type="text"
          icon="building"
          placeholder="ID da Empresa"
        />
        <IconInput
          v-model="email"
          type="text"
          icon="login"
          placeholder="Usuario"
          autocomplete="email"
        />
        <IconInput
          v-model="password"
          type="password"
          icon="password"
          placeholder="Senha"
          autocomplete="current-password"
        />
      </div>

      <RouterLink class="vue-router-link forgot_password" to="/recuperar/email/cliente">
        Esqueci a senha.
      </RouterLink>
      <RouterLink class="vue-router-link forgot_password" to="/">
        Entrar como empresa
      </RouterLink>
      
      <button type="submit" class="submit_button">
        <LoadingSpinner v-if="authStore.fetching" />
        <span v-else>Entrar</span>
      </button>
      
      <RouterLink class="vue-router-link first_access" to="/primeiroacesso">
        É seu primeiro acesso? <span>Cadastrar senha.</span>
      </RouterLink>
    </form>
  </main>
</template>

<style lang="scss" scoped>
.main {
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100vh;
  min-width: 100vw;
  width: 100%;
  height: 100%;
  background-color: var(--color-blue-700);
  display: flex;
  align-items: center;
  justify-content: center;

  form {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    max-width: 400px;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 480px) {
      position: initial;
      transform: none;
      padding: 2%;
      top: 0;
    }

    .logo {
      width: 100%;
      max-width: 300px;
      margin-bottom: 30px;
    }

    .input_container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .forgot_password {
      font-size: 0.875rem;
      margin-top: 13px;
      align-self: flex-end;
      color: var(--color-orange-600);

      @media (max-width: 480px) {
        font-size: 1.25rem;
      }
    }

    .first_access {
      font-size: 0.875rem;
      margin-top: 55px;
      color: var(--color-white-100);

      span {
        color: var(--color-orange-600);
      }

      @media (max-width: 480px) {
        font-size: 1.25rem;
      }
    }

    .submit_button {
      width: 182px;
      height: 52px;
      border: none;
      background-color: var(--color-white-100);
      color: var(--color-blue-700);
      filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.161));
      font-size: 0.938rem;
      margin-top: 59px;
      outline: none;
      display: flex;
      align-items: center;
      justify-content: center;

      @media (max-width: 480px) {
        font-size: 1.25rem;
      }
    }
  }
}
</style>
