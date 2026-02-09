<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { postResetPassword } from '@/services/http/auth'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const token = route.query.token as string
const id = route.params.id as string

async function handleSubmit() {
  if (password.value !== confirmPassword.value) {
    toast.error('As senhas não coincidem.')
    return
  }

  try {
    loading.value = true
    await postResetPassword(token, id, password.value, confirmPassword.value)
    toast.success('Senha alterada com sucesso!')
    router.push('/')
  } catch (error) {
    console.error(error)
    toast.error('Ocorreu um erro ao alterar a senha.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <h2>Nova Senha</h2>
    <p>Defina sua nova senha.</p>
    <input
      v-model="password"
      type="password"
      placeholder="Nova senha"
      required
    />
    <input
      v-model="confirmPassword"
      type="password"
      placeholder="Confirmar senha"
      required
    />
    <button type="submit" :disabled="loading">
      {{ loading ? 'Salvando...' : 'Salvar' }}
    </button>
    <RouterLink to="/">Voltar para login</RouterLink>
  </form>
</template>

<style lang="scss" scoped>
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
</style>
