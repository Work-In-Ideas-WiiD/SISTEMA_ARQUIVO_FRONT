<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/http/api'
import { useAuthStore } from '@/stores/auth'
import { useTour } from '@/composables/useTour'

const PASSOS = [
  {
    alvo: 'menu-arquivos',
    titulo: 'Envie arquivos',
    texto:
      'É aqui que a maioria das suas operações acontece. Envie arquivos para o sistema, crie pastas, mova arquivos e controle permissões.'
  },
  {
    alvo: 'empresa-principal',
    titulo: 'Empresas',
    texto:
      'Gerencie sua própria empresa ou crie novas empresas para seus clientes. Assim os arquivos ficam separados da maneira correta.'
  },
  {
    alvo: 'menu-controle',
    titulo: 'Mais controle?',
    texto:
      'Cadastre todas as subdivisões do seu negócio e dos seus clientes. Assim, cada nível acessa somente os arquivos que precisa.'
  },
  {
    alvo: 'empresa-principal',
    titulo: 'Vamos começar?',
    texto: 'Clique duas vezes aqui e faça seu primeiro upload.'
  }
]

const route = useRoute()
const authStore = useAuthStore()
const tour = useTour()

const rect = ref<{ top: number; left: number; width: number; height: number } | null>(null)
let medindo = 0

const passoAtual = computed(() => PASSOS[tour.passo.value] || PASSOS[0])
const ultimo = computed(() => tour.passo.value === PASSOS.length - 1)

function medir() {
  const alvo = passoAtual.value.alvo
  const nos = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour="${alvo}"]`))
  if (!nos.length) {
    rect.value = null
    return
  }
  const caixas = nos.map((el) => el.getBoundingClientRect())
  const top = Math.min(...caixas.map((c) => c.top))
  const left = Math.min(...caixas.map((c) => c.left))
  const right = Math.max(...caixas.map((c) => c.right))
  const bottom = Math.max(...caixas.map((c) => c.bottom))
  const margem = 8
  rect.value = {
    top: Math.max(8, top - margem),
    left: Math.max(8, left - margem),
    width: right - left + margem * 2,
    height: bottom - top + margem * 2
  }
}

function loop() {
  medir()
  medindo = window.requestAnimationFrame(loop)
}

const balao = computed(() => {
  const r = rect.value
  if (!r) return { top: '120px', left: '420px' }
  const largura = 340
  let left = r.left + r.width + 18
  if (left + largura > window.innerWidth - 16) {
    left = Math.max(16, r.left - largura - 18)
  }
  let top = r.top
  const alturaEstimada = 210
  if (top + alturaEstimada > window.innerHeight - 16) {
    top = Math.max(16, window.innerHeight - alturaEstimada - 16)
  }
  return { top: `${top}px`, left: `${left}px` }
})

async function marcarVisto() {
  try {
    await api.post('/auth/tour')
    authStore.me.tour_pendente = false
  } catch {
    authStore.me.tour_pendente = false
  }
}

onMounted(async () => {
  if (!authStore.me.tour_pendente) return
  if (!route.path.startsWith('/dashboard/arquivos')) return
  if (window.innerWidth <= 900) return
  tour.iniciar()
  await nextTick()
  mostrarAlvo()
  medir()
  medindo = window.requestAnimationFrame(loop)
  void marcarVisto()
})

function mostrarAlvo() {
  const alvo = passoAtual.value.alvo
  document.querySelector<HTMLElement>(`[data-tour="${alvo}"]`)?.scrollIntoView({
    block: 'nearest',
    inline: 'nearest'
  })
}

watch(
  () => tour.passo.value,
  async () => {
    await nextTick()
    mostrarAlvo()
    medir()
  }
)

onBeforeUnmount(() => {
  if (medindo) cancelAnimationFrame(medindo)
  tour.encerrar()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="tour.ativo.value" class="tour">
      <div class="tour__faixa" :style="{ top: '0', left: '0', right: '0', height: `${rect?.top ?? 0}px` }" />
      <div
        class="tour__faixa"
        :style="{
          top: `${rect?.top ?? 0}px`,
          left: '0',
          width: `${rect?.left ?? 0}px`,
          height: `${rect?.height ?? 0}px`
        }"
      />
      <div
        class="tour__faixa"
        :style="{
          top: `${rect?.top ?? 0}px`,
          left: `${(rect?.left ?? 0) + (rect?.width ?? 0)}px`,
          right: '0',
          height: `${rect?.height ?? 0}px`
        }"
      />
      <div
        class="tour__faixa"
        :style="{
          top: `${(rect?.top ?? 0) + (rect?.height ?? 0)}px`,
          left: '0',
          right: '0',
          bottom: '0'
        }"
      />
      <div
        v-if="!ultimo"
        class="tour__faixa"
        :style="{
          top: `${rect?.top ?? 0}px`,
          left: `${rect?.left ?? 0}px`,
          width: `${rect?.width ?? 0}px`,
          height: `${rect?.height ?? 0}px`
        }"
      />
      <div
        v-if="rect"
        class="tour__destaque"
        :style="{
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`
        }"
      />
      <div
        class="tour__balao"
        role="dialog"
        aria-modal="true"
        :aria-label="passoAtual.titulo"
        :style="balao"
      >
        <p class="tour__passo">{{ tour.passo.value + 1 }} de {{ PASSOS.length }}</p>
        <h2>{{ passoAtual.titulo }}</h2>
        <p>{{ passoAtual.texto }}</p>
        <div class="tour__acoes">
          <button type="button" :disabled="tour.passo.value === 0" aria-label="Passo anterior" @click="tour.voltar()">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button type="button" :aria-label="ultimo ? 'Concluir' : 'Próximo passo'" @click="tour.avancar()">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.tour__faixa {
  position: fixed;
  z-index: 100;
  background: rgba(6, 12, 22, 0.72);
}

.tour__destaque {
  position: fixed;
  z-index: 101;
  border-radius: 14px;
  border: 2px solid #d9b77e;
  box-shadow: 0 0 0 4px rgba(217, 183, 126, 0.25);
  pointer-events: none;
}

.tour__balao {
  position: fixed;
  z-index: 102;
  width: 340px;
  max-width: calc(100vw - 32px);
  padding: 18px 18px 14px;
  border-radius: 16px;
  background: #132438;
  border: 1px solid rgba(217, 183, 126, 0.55);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  color: #fffcff;
  font-family: 'Inter', sans-serif;

  h2 {
    margin: 4px 0 8px;
    font-size: 18px;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.45;
    color: rgba(255, 252, 255, 0.88);
  }
}

.tour__passo {
  color: #d9b77e !important;
  font-size: 12px !important;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.tour__acoes {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;

  button {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    border: 1px solid rgba(217, 183, 126, 0.7);
    background: transparent;
    color: #d9b77e;
    cursor: pointer;

    &:disabled {
      opacity: 0.35;
      cursor: default;
    }

    &:not(:disabled):hover {
      background: rgba(217, 183, 126, 0.16);
    }
  }
}
</style>
