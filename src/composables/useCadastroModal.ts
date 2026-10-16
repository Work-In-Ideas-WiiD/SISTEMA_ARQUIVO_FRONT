import { ref } from 'vue'

const aberto = ref(false)

export function useCadastroModal() {
  function abrir() {
    aberto.value = true
  }

  function fechar() {
    aberto.value = false
  }

  return { aberto, abrir, fechar }
}
