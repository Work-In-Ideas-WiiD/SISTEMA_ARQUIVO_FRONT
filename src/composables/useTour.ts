import { computed, ref } from 'vue'

const ativo = ref(false)
const passo = ref(0)

/** Estado do tour da primeira entrada. Compartilhado entre o balão e os quadrados das empresas. */
export function useTour() {
  const noUltimoPasso = computed(() => ativo.value && passo.value === 3)

  function iniciar() {
    passo.value = 0
    ativo.value = true
  }

  function avancar() {
    if (passo.value < 3) {
      passo.value += 1
      return
    }
    ativo.value = false
  }

  function voltar() {
    if (passo.value > 0) passo.value -= 1
  }

  function encerrar() {
    ativo.value = false
  }

  return { ativo, passo, noUltimoPasso, iniciar, avancar, voltar, encerrar }
}
