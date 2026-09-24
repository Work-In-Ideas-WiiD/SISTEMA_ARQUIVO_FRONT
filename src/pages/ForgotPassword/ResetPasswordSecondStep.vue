<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { postResetPassword } from '@/services/http/auth'
import { getApiErrorMessage } from '@/utils/apiError'

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
    router.push('/login')
  } catch (error) {
    console.error(error)
    toast.error(getApiErrorMessage(error, 'Ocorreu um erro ao alterar a senha.'))
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
    <RouterLink to="/login">Voltar para login</RouterLink>
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
  font-family: 'Inter', sans-serif;

  h2 {
    color: #FFFCFF;
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    margin: 0;
  }

  p {
    color: rgba(255, 252, 255, 0.85);
    font-size: 14px;
    text-align: center;
    margin: 0;
  }

  input {
    height: 49px;
    padding: 0 22px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.08);
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #fff;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #B08D57;
      box-shadow: 0 0 0 3px rgba(176, 141, 87, 0.25);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.65);
    }
  }

  button {
    height: 49px;
    background-color: #B08D57;
    border: none;
    border-radius: 30px;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(176, 141, 87, 0.3);
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: #C29F68;
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(176, 141, 87, 0.4);
    }

    &:disabled {
      opacity: 0.7;
      cursor: wait;
    }
  }

  a {
    color: #B08D57;
    text-align: center;
    font-size: 14px;
    text-decoration: underline;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.85;
    }
  }
}
</style>
