<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/http/api'
import { getApiErrorMessage } from '@/utils/apiError'
import { useAuthStore } from '@/stores/auth'
import { dispositivoDesteNavegador } from '@/utils/acessoDireto'
import logoAkidocs from '@/assets/imgs/login/logo-akidocs-white.png'

const route = useRoute()
const auth = useAuthStore()
const mensagem = ref('Confirmando seu e-mail…')
const ok = ref(false)

onMounted(async () => {
  const token = String(route.query.token || '')
  if (!token) {
    mensagem.value = 'Link incompleto. Peça um novo e-mail de confirmação.'
    return
  }
  const dispositivo = dispositivoDesteNavegador()
  if (!dispositivo) {
    mensagem.value = 'Não foi possível abrir o acesso neste navegador. Tente de novo.'
    return
  }
  try {
    const { data } = await api.post('/email/confirmar', { token, dispositivo })
    ok.value = true
    mensagem.value = 'E-mail confirmado. Abrindo a plataforma…'
    if (data.access_token) {
      await auth.entrarPelaConfirmacao(data)
    }
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
}
</style>
