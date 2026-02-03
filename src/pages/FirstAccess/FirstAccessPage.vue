<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { postFirstAccess } from '@/services/http/auth'

const toast = useToast()

const email = ref('')
const loading = ref(false)

async function handleSubmit() {
  try {
    loading.value = true
    await postFirstAccess(email.value)
    toast.success('Um e-mail foi enviado com instruções para cadastrar sua senha.')
  } catch (error) {
    console.error(error)
    toast.error('Ocorreu um erro. Verifique o e-mail informado.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="main">
    <form @submit.prevent="handleSubmit">
      <h2>Primeiro Acesso</h2>
      <p>Informe seu e-mail para cadastrar sua senha.</p>
      <input
        v-model="email"
        type="email"
        placeholder="E-mail"
        required
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Enviando...' : 'Enviar' }}
      </button>
      <RouterLink to="/">Voltar para login</RouterLink>
    </form>
  </main>
</template>

<style lang="scss" scoped>
.main {
  min-height: 100vh;
  background-color: var(--color-blue-700);
  display: flex;
  align-items: center;
  justify-content: center;

  form {
    max-width: 400px;
    width: 100%;
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    h2, p {
      color: white;
      text-align: center;
    }

    input {
      height: 51px;
      padding: 0 20px;
      border: 1px solid var(--color-gray-500);
      font-size: 1rem;
    }

    button {
      height: 52px;
      background-color: white;
      border: none;
      color: var(--color-blue-700);
      font-size: 1rem;
      cursor: pointer;

      &:disabled {
        opacity: 0.7;
      }
    }

    a {
      color: var(--color-orange-500);
      text-align: center;
    }
  }
}
</style>
