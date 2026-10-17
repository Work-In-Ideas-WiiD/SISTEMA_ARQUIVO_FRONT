<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/services/http/api'

const siteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY || '') as string
const id = ref('')
const resposta = ref('')
const imagem = ref('')
const token = ref('')
const caixa = ref<HTMLElement | null>(null)

function dados() {
  if (siteKey) return { turnstile_token: token.value }
  return { captcha_id: id.value, captcha_resposta: resposta.value }
}

async function carregarImagem() {
  const { data } = await api.get('/captcha')
  id.value = data.id
  imagem.value = data.imagem
  resposta.value = ''
}

function desenharTurnstile() {
  const turnstile = (window as unknown as { turnstile?: { render: Function } }).turnstile
  if (!turnstile || !caixa.value) return
  caixa.value.innerHTML = ''
  turnstile.render(caixa.value, {
    sitekey: siteKey,
    theme: 'dark',
    callback: (valor: string) => {
      token.value = valor
    }
  })
}

function carregarScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as unknown as { turnstile?: unknown }).turnstile) {
      resolve()
      return
    }
    const existente = document.querySelector('script[data-turnstile]')
    if (existente) {
      existente.addEventListener('load', () => resolve())
      return
    }
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.dataset.turnstile = '1'
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

async function recarregar() {
  token.value = ''
  if (siteKey) {
    await carregarScript()
    desenharTurnstile()
    return
  }
  await carregarImagem()
}

onMounted(recarregar)

defineExpose({ dados, recarregar })
</script>

<template>
  <div class="captcha">
    <div v-if="siteKey" ref="caixa" />
    <template v-else>
      <img v-if="imagem" :src="imagem" alt="Código de verificação" width="180" height="56" />
      <button type="button" @click="recarregar">Trocar código</button>
      <input v-model="resposta" type="text" maxlength="5" autocomplete="off" placeholder="Digite o código" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.captcha {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  width: 100%;

  img {
    border-radius: 8px;
    border: 1px solid rgba(176, 141, 87, 0.4);
  }

  button {
    border: 0;
    background: transparent;
    color: #d9b77e;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;
  }

  input {
    flex: 1;
    min-width: 120px;
    border: 1px solid rgba(176, 141, 87, 0.35);
    border-radius: 10px;
    background: transparent;
    color: #fffcff;
    padding: 10px 12px;
    font: inherit;
  }
}
</style>
