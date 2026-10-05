import { ref, watch, type Ref } from 'vue'
import { useToast } from 'vue-toastification'

interface DestinoEndereco {
  endereco: Ref<string>
  bairro: Ref<string>
  cidade: Ref<string>
  estado: Ref<string>
  complemento?: Ref<string>
}

interface ViaCepResposta {
  erro?: boolean | string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
}

/** Preenche o endereço sozinho quando o CEP fica completo (ViaCEP). */
export function useBuscaCep(cep: Ref<string>, destino: DestinoEndereco) {
  const toast = useToast()
  const buscandoCep = ref(false)
  let ultimoBuscado = ''

  /** Formulário de edição: o CEP já salvo não deve sobrescrever o endereço carregado. */
  function marcarCarregado(valor: string) {
    ultimoBuscado = String(valor || '').replace(/\D/g, '')
  }

  async function buscar(digitos: string) {
    buscandoCep.value = true
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${digitos}/json/`)
      const dados = (await resposta.json()) as ViaCepResposta
      if (!resposta.ok || dados.erro) {
        toast.error('CEP não encontrado. Preencha o endereço manualmente.')
        return
      }
      if (dados.logradouro) destino.endereco.value = dados.logradouro
      if (dados.bairro) destino.bairro.value = dados.bairro
      if (dados.localidade) destino.cidade.value = dados.localidade
      if (dados.uf) destino.estado.value = dados.uf
      if (destino.complemento && dados.complemento && !destino.complemento.value) {
        destino.complemento.value = dados.complemento
      }
    } catch {
      toast.error('Não foi possível buscar o CEP. Preencha o endereço manualmente.')
    } finally {
      buscandoCep.value = false
    }
  }

  watch(cep, (valor) => {
    const digitos = String(valor || '').replace(/\D/g, '')
    if (digitos.length !== 8 || digitos === ultimoBuscado) return
    ultimoBuscado = digitos
    void buscar(digitos)
  })

  return { buscandoCep, marcarCarregado }
}
