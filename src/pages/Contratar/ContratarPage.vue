<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Cookies from 'js-cookie'
import CustomButton from '@/components/CustomButton/CustomButton.vue'
import { getPlanosPublicos, type IPlanoPublico } from '@/services/http/planos'
import { getChavePublica, postContratacao } from '@/services/http/conta'
import { getApiErrorMessage } from '@/utils/apiError'

const router = useRouter()
const toast = useToast()

const planos = ref<IPlanoPublico[]>([])
const fetching = ref(true)
const sucesso = ref(false)
const processando = ref(false)

const planoSelecionado = ref<IPlanoPublico | null>(null)

const card = ref({
  holder: '',
  number: '',
  expMonth: '',
  expYear: '',
  cvv: ''
})

const telefone = ref('')

const SDK_URL = 'https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js'

function carregarSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).PagSeguro) {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.src = SDK_URL
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Falha ao carregar o SDK de pagamento'))
    document.head.appendChild(s)
  })
}

onMounted(async () => {
  // Fluxo pós-cadastro/login em modo pagamento: precisa do token.
  if (!Cookies.get('ana_lucia.token')) {
    router.push('/cadastro')
    return
  }

  // Pré-carrega o SDK (não bloqueia a listagem).
  carregarSdk().catch((e) => console.error(e))

  try {
    const { data } = await getPlanosPublicos()
    planos.value = data
  } catch (error) {
    console.error(error)
    toast.error('Erro ao carregar os planos.')
  } finally {
    fetching.value = false
  }
})

function formatBRL(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatGB(bytes: number) {
  return `${(bytes / 1024 ** 3).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} GB`
}

function selecionarPlano(plano: IPlanoPublico) {
  planoSelecionado.value = plano
}

function limparCartao() {
  card.value = { holder: '', number: '', expMonth: '', expYear: '', cvv: '' }
}

function voltarParaPlanos() {
  planoSelecionado.value = null
  limparCartao()
}

function telefoneValido(raw: string): boolean {
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('55') && digits.length > 11) {
    digits = digits.slice(2)
  }
  return digits.length === 10 || digits.length === 11
}

async function pagar() {
  if (!planoSelecionado.value) return

  const numero = card.value.number.replace(/\D/g, '')
  if (!card.value.holder.trim()) return toast.error('Informe o nome impresso no cartão.')
  if (numero.length < 13) return toast.error('Número do cartão inválido.')
  if (!/^\d{2}$/.test(card.value.expMonth)) return toast.error('Mês de validade inválido (MM).')
  if (!/^\d{4}$/.test(card.value.expYear)) return toast.error('Ano de validade inválido (AAAA).')
  if (card.value.cvv.length < 3) return toast.error('CVV inválido.')
  if (!telefoneValido(telefone.value)) {
    return toast.error('Informe um telefone válido com DDD (ex.: 11999998888).')
  }

  try {
    processando.value = true

    await carregarSdk()
    const PagSeguro = (window as any).PagSeguro
    if (!PagSeguro?.encryptCard) throw new Error('SDK de pagamento indisponível')

    const { data: chave } = await getChavePublica()

    const encryptResult = PagSeguro.encryptCard({
      publicKey: chave.public_key,
      holder: card.value.holder.trim(),
      number: numero,
      expMonth: card.value.expMonth,
      expYear: card.value.expYear,
      securityCode: card.value.cvv
    })

    if (encryptResult.hasErrors) {
      console.error(encryptResult.errors)
      toast.error('Dados do cartão inválidos. Confira e tente novamente.')
      return
    }

    const { data } = await postContratacao(
      planoSelecionado.value.id,
      encryptResult.encryptedCard,
      telefone.value.replace(/\D/g, '')
    )

    // Limpa os dados do cartão do estado assim que possível.
    limparCartao()

    if (data.status === 'ativa') {
      sucesso.value = true
      toast.success(data.message || 'Pagamento aprovado! Assinatura ativada.')
    } else if (data.status === 'pendente') {
      toast.info(data.message || 'Assinatura criada. Aguardando confirmação do pagamento.')
    } else {
      toast.error(data.message || 'Pagamento não autorizado. Tente outro cartão.')
    }
  } catch (error: any) {
    console.error(error)
    toast.error(
      getApiErrorMessage(error, 'Não foi possível processar o pagamento. Tente novamente.')
    )
  } finally {
    processando.value = false
  }
}
</script>

<template>
  <main class="public_page">
    <!-- Sucesso -->
    <div v-if="sucesso" class="card center">
      <h1 class="card_title">Assinatura ativada 🎉</h1>
      <p class="card_subtitle">Seu pagamento foi aprovado. Você já pode acessar o sistema.</p>
      <div class="form_actions">
        <CustomButton title="IR PARA O LOGIN" type="button" @click="router.push('/')" />
      </div>
    </div>

    <!-- Pagamento (cartão) -->
    <div v-else-if="planoSelecionado" class="card">
      <div class="card_header">
        <button type="button" class="back_btn" title="Voltar aos planos" @click="voltarParaPlanos">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <h1 class="card_title">Pagamento</h1>
      </div>
      <p class="card_subtitle">
        {{ planoSelecionado.nome }} —
        <strong>{{ formatBRL(planoSelecionado.valor_mensal_centavos) }}/mês</strong>
      </p>

      <form @submit.prevent="pagar">
        <div class="form_group">
          <label for="telefone">Telefone (DDD + número) *</label>
          <input
            id="telefone"
            v-model="telefone"
            type="tel"
            inputmode="numeric"
            maxlength="15"
            placeholder="11999998888"
            autocomplete="tel"
          />
        </div>
        <div class="form_group">
          <label for="holder">Nome impresso no cartão</label>
          <input id="holder" v-model="card.holder" type="text" placeholder="Como está no cartão" autocomplete="cc-name" />
        </div>
        <div class="form_group">
          <label for="number">Número do cartão</label>
          <input id="number" v-model="card.number" type="text" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000" autocomplete="cc-number" />
        </div>
        <div class="row">
          <div class="form_group">
            <label for="expMonth">Mês (MM)</label>
            <input id="expMonth" v-model="card.expMonth" type="text" inputmode="numeric" maxlength="2" placeholder="12" />
          </div>
          <div class="form_group">
            <label for="expYear">Ano (AAAA)</label>
            <input id="expYear" v-model="card.expYear" type="text" inputmode="numeric" maxlength="4" placeholder="2030" />
          </div>
          <div class="form_group">
            <label for="cvv">CVV</label>
            <input id="cvv" v-model="card.cvv" type="text" inputmode="numeric" maxlength="4" placeholder="123" autocomplete="cc-csc" />
          </div>
        </div>

        <div class="form_actions">
          <CustomButton
            :title="`PAGAR ${formatBRL(planoSelecionado.valor_mensal_centavos)}`"
            type="submit"
            :loading="processando"
          />
        </div>
      </form>

      <p class="secure_note">
        🔒 Os dados do cartão são criptografados no seu navegador e não passam pelo nosso servidor.
      </p>
    </div>

    <!-- Lista de planos -->
    <div v-else class="content">
      <h1 class="page_title">Escolha seu plano</h1>

      <p v-if="fetching" class="loading">Carregando planos...</p>
      <p v-else-if="planos.length === 0" class="loading">Nenhum plano disponível no momento.</p>

      <div v-else class="planos_grid">
        <div v-for="plano in planos" :key="plano.id" class="plano_card">
          <h2 class="plano_nome">{{ plano.nome }}</h2>
          <p class="plano_valor">{{ formatBRL(plano.valor_mensal_centavos) }}<span>/mês</span></p>
          <p v-if="plano.descricao" class="plano_desc">{{ plano.descricao }}</p>
          <ul class="plano_features">
            <li>Até {{ plano.max_usuarios }} usuários</li>
            <li>{{ formatGB(plano.armazenamento_bytes) }} de armazenamento</li>
          </ul>
          <CustomButton title="CONTRATAR" type="button" @click="selecionarPlano(plano)" />
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.public_page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-white-300, #f8f8f8);
  padding: 40px 24px;

  .page_title {
    font-size: 1.8rem;
    color: var(--color-blue-700, #1e3f49);
    text-align: center;
    margin-bottom: 32px;
  }

  .loading {
    text-align: center;
    color: var(--color-gray-500, #707070);
  }

  .planos_grid {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;

    .plano_card {
      background: #fff;
      border-radius: 8px;
      padding: 32px;
      width: 300px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      display: flex;
      flex-direction: column;

      .plano_nome {
        font-size: 1.3rem;
        color: var(--color-blue-700, #1e3f49);
        margin-bottom: 8px;
      }

      .plano_valor {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--color-orange-600, #c7633b);
        margin-bottom: 16px;

        span {
          font-size: 0.9rem;
          font-weight: 400;
          color: var(--color-gray-500, #707070);
        }
      }

      .plano_desc {
        color: var(--color-gray-500, #707070);
        margin-bottom: 16px;
      }

      .plano_features {
        list-style: none;
        margin: 0 0 24px;
        padding: 0;
        flex: 1;

        li {
          padding: 6px 0;
          border-bottom: 1px solid #f0f0f0;
          font-size: 0.95rem;
        }
      }
    }
  }

  .card {
    width: 100%;
    max-width: 440px;
    background: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

    &.center {
      text-align: center;
    }

    .card_header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      .back_btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-orange-500, #c7633b);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }
    }

    .card_title {
      font-size: 1.6rem;
      color: var(--color-blue-700, #1e3f49);
    }

    .card_subtitle {
      color: var(--color-gray-500, #707070);
      margin-bottom: 24px;
    }

    .form_group {
      margin-bottom: 16px;
      flex: 1;

      label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        font-size: 0.875rem;
      }

      input {
        width: 100%;
        padding: 12px;
        border: 1px solid rgba(207, 198, 188, 0.6);
        border-radius: 4px;
        font-size: 14px;

        &:focus {
          outline: none;
          border-color: #c7633b;
        }
      }
    }

    .row {
      display: flex;
      gap: 12px;
    }

    .form_actions {
      display: flex;
      justify-content: center;
      margin-top: 4px;
    }

    .secure_note {
      margin-top: 18px;
      font-size: 0.8rem;
      color: var(--color-gray-500, #707070);
      text-align: center;
      line-height: 1.4;
    }
  }
}
</style>
