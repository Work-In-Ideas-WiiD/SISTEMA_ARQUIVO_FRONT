<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const aberto = ref(false)
const geracao = ref(0)

function deveTravar(): boolean {
  return !!authStore.me.teste_encerrado && window.location.pathname.startsWith('/dashboard')
}

function abrir() {
  aberto.value = true
  geracao.value += 1
}

function noClique(event: Event) {
  if (!deveTravar()) return
  const alvo = event.target
  if (alvo instanceof Element && alvo.closest('[data-trial-gate]')) return
  event.preventDefault()
  event.stopPropagation()
  abrir()
}

function noEventoApi() {
  if (!window.location.pathname.startsWith('/dashboard')) return
  abrir()
  void authStore.refreshUserData()
}

function adquirir() {
  router.push('/contratar')
}

onMounted(() => {
  document.addEventListener('click', noClique, true)
  document.addEventListener('auxclick', noClique, true)
  window.addEventListener('akidocs-teste-encerrado', noEventoApi)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', noClique, true)
  document.removeEventListener('auxclick', noClique, true)
  window.removeEventListener('akidocs-teste-encerrado', noEventoApi)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="aberto" :key="geracao" class="gate" data-trial-gate role="dialog" aria-modal="true" aria-labelledby="gate-titulo">
      <div class="gate__card">
        <h2 id="gate-titulo">Período de testes encerrado</h2>
        <p>Seu teste grátis terminou. Para continuar usando o sistema, adquira um plano.</p>
        <div class="gate__acoes">
          <button type="button" class="gate__sair" @click="authStore.signOut()">Sair</button>
          <button type="button" class="gate__plano" @click="adquirir">Adquirir plano</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.gate {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(6, 12, 22, 0.72);
  font-family: 'Inter', sans-serif;
}

.gate__card {
  width: min(440px, 100%);
  padding: 28px 26px 22px;
  border-radius: 18px;
  background: #132438;
  border: 1px solid rgba(217, 183, 126, 0.55);
  color: #fffcff;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);

  h2 {
    margin: 0 0 10px;
    font-size: 22px;
  }

  p {
    margin: 0;
    font-size: 15px;
    line-height: 1.5;
    color: rgba(255, 252, 255, 0.88);
  }
}

.gate__acoes {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

.gate__sair,
.gate__plano {
  border-radius: 999px;
  padding: 10px 16px;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.gate__sair {
  border: 1px solid rgba(255, 252, 255, 0.35);
  background: transparent;
  color: #fffcff;
}

.gate__plano {
  border: 0;
  background: #b08d57;
  color: #0b1b2b;
}
</style>
