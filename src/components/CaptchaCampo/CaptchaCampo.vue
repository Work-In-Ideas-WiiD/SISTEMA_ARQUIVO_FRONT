<script setup lang="ts">
import { onMounted, ref } from 'vue'

const siteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY || '') as string
const token = ref('')
const aviso = ref('')
const caixa = ref<HTMLElement | null>(null)
let widget = -1

type Recaptcha = {
  render: (el: HTMLElement, opcoes: Record<string, unknown>) => number
  reset: (id?: number) => void
}

function google(): Recaptcha | undefined {
  return (window as unknown as { grecaptcha?: Recaptcha }).grecaptcha
}

function dados() {
  return { recaptcha_token: token.value }
}

function exigir() {
  aviso.value = token.value ? '' : 'Confirme que você não é um robô.'
  return token.value !== ''
}

function desenhar() {
  const recaptcha = google()
  if (!recaptcha || !caixa.value || widget >= 0) return
  widget = recaptcha.render(caixa.value, {
    sitekey: siteKey,
    theme: 'dark',
    hl: 'pt-BR',
    callback: (valor: string) => {
      token.value = valor
      aviso.value = ''
    },
    'expired-callback': () => {
      token.value = ''
    },
    'error-callback': () => {
      token.value = ''
    }
  })
}

function carregarScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (google()) {
      resolve()
      return
    }
    const existente = document.querySelector('script[data-recaptcha]')
    if (existente) {
      existente.addEventListener('load', () => resolve())
      existente.addEventListener('error', () => reject())
      return
    }
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?hl=pt-BR&render=explicit'
    script.async = true
    script.dataset.recaptcha = '1'
    script.onload = () => resolve()
    script.onerror = () => reject()
    document.head.appendChild(script)
  })
}

async function recarregar() {
  token.value = ''
  if (widget >= 0) google()?.reset(widget)
}

onMounted(async () => {
  if (!siteKey) return
  try {
    await carregarScript()
    const pronto = google() as (Recaptcha & { ready?: (fn: () => void) => void }) | undefined
    if (pronto?.ready) pronto.ready(desenhar)
    else desenhar()
  } catch {
    aviso.value = 'Não foi possível carregar o captcha do Google.'
  }
})

defineExpose({ dados, recarregar, exigir })
</script>

<template>
  <div class="captcha">
    <p v-if="!siteKey" class="captcha__aviso">O captcha do Google ainda não foi configurado.</p>
    <div ref="caixa" />
    <small v-if="aviso">{{ aviso }}</small>
  </div>
</template>

<style lang="scss" scoped>
.captcha {
  width: 100%;

  small,
  &__aviso {
    display: block;
    margin-top: 6px;
    color: #e07a7a;
    font-size: 12px;
  }
}
</style>
