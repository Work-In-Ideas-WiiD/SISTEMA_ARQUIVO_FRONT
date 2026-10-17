<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { api } from '@/services/http/api'
import { getApiErrorMessage } from '@/utils/apiError'
import logoAkidocs from '@/assets/imgs/login/logo-akidocs-white.png'

const route = useRoute()
const mensagem = ref('Confirmando seu e-mail…')
const ok = ref(false)

onMounted(async () => {
  const token = String(route.query.token || '')
  if (!token) {
    mensagem.value = 'Link incompleto. Peça um novo e-mail de confirmação.'
    return
  }
  try {
    const { data } = await api.post('/email/confirmar', { token })
    ok.value = true
    mensagem.value = data.message || 'E-mail confirmado. Você já pode entrar.'
  } catch (error) {
    mensagem.value = getApiErrorMessage(error, 'Este link não vale mais. Peça um novo e-mail de confirmação.')
  }
})
</script>

<template>
  <main class="confirma">
    <img :src="logoAkidocs" alt="AkiDocs" width="160" />
    <h1>{{ ok ? 'E-mail confirmado' : 'Confirmação' }}</h1>
    <p>{{ mensagem }}</p>
    <RouterLink v-if="ok" to="/login">IR PARA O LOGIN</RouterLink>
  </main>
</template>

<style lang="scss" scoped>
.confirma {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  background: #0b1b2b;
  color: #fffcff;
  font-family: 'Inter', sans-serif;
  text-align: center;

  h1 {
    margin: 8px 0 0;
    font-size: 28px;
  }

  p {
    max-width: 420px;
    margin: 0;
    line-height: 1.5;
  }

  a {
    margin-top: 8px;
    background: #b08d57;
    color: #0b1b2b;
    text-decoration: none;
    font-weight: 700;
    border-radius: 999px;
    padding: 12px 18px;
  }
}
</style>
