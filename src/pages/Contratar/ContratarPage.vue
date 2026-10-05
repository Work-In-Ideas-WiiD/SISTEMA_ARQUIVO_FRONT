<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import Cookies from 'js-cookie'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import logoAkidocs from '@/assets/imgs/login/logo-akidocs-white.png'
import iconBackCircle from '@/assets/imgs/login/icon-back-circle.svg'
import iconChevronLeft from '@/assets/imgs/login/icon-chevron-left.svg'
import { getPlanosPublicos, descontoAnualDosPlanos, type IPlanoPublico, type TPeriodicidade } from '@/services/http/planos'
import { getChavePublica, postContratacao } from '@/services/http/conta'
import { getApiErrorMessage } from '@/utils/apiError'
import { maskPhone, stripDigits } from '@/utils/formatPhone'
import { useAuthStore } from '@/stores/auth'
import { getSelectedPlan, trackBeginCheckout, trackPurchase } from '@/utils/tracking'
import { setPageSeo } from '@/utils/seo'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const planos = ref<IPlanoPublico[]>([])
const descontoAnual = computed(() => descontoAnualDosPlanos(planos.value))
const fetching = ref(true)
const sucesso = ref(false)
const processando = ref(false)

const planoSelecionado = ref<IPlanoPublico | null>(null)
const periodicidade = ref<TPeriodicidade>(getSelectedPlan()?.periodicidade === 'anual' ? 'anual' : 'mensal')

function valorPorMes(plano: IPlanoPublico): number {
  return periodicidade.value === 'anual'
    ? (plano.valor_mensal_no_anual_centavos ?? plano.valor_mensal_centavos)
    : plano.valor_mensal_centavos
}

function valorCobrado(plano: IPlanoPublico): number {
  return periodicidade.value === 'anual'
    ? (plano.valor_anual_centavos ?? plano.valor_mensal_centavos * 12)
    : plano.valor_mensal_centavos
}

function dadosTracking(plano: IPlanoPublico) {
  return {
    id: plano.id,
    nome: plano.nome,
    valor_mensal_centavos: valorPorMes(plano),
    periodicidade: periodicidade.value
  }
}

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
  setPageSeo({
    title: 'Contratar — AkiDocs | Planos de Gestão de Documentos',
    description: 'Escolha seu plano e comece a gerenciar arquivos na nuvem com o AkiDocs.',
    canonicalUrl: 'https://akidocs.com.br/contratar'
  })

  // Fluxo pós-cadastro/login em modo pagamento: precisa do token.
  if (!Cookies.get('ana_lucia.token')) {
    router.push('/cadastro')
    return
  }

  authStore.checkAuth()

  // Pré-carrega o SDK (não bloqueia a listagem).
  carregarSdk().catch((e) => console.error(e))

  try {
    const { data } = await getPlanosPublicos()
    planos.value = data

    // Pré-seleciona o plano se veio da Landing Page
    const prePlano = getSelectedPlan()
    const queryId = (router.currentRoute.value.query.plano as string) || prePlano?.id
    if (queryId && Array.isArray(data)) {
      const match = data.find((p) => p.id === queryId)
      if (match) {
        selecionarPlano(match)
      }
    }
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

function maskCardNumber(value: string): string {
  const digits = stripDigits(value).slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function onTelefoneInput(event: Event) {
  telefone.value = maskPhone((event.target as HTMLInputElement).value)
}

function onCardNumberInput(event: Event) {
  card.value.number = maskCardNumber((event.target as HTMLInputElement).value)
}

function selecionarPlano(plano: IPlanoPublico) {
  planoSelecionado.value = plano
  trackBeginCheckout(dadosTracking(plano))
}

function limparCartao() {
  card.value = { holder: '', number: '', expMonth: '', expYear: '', cvv: '' }
}

function voltarParaPlanos() {
  planoSelecionado.value = null
  limparCartao()
}

const emTeste = computed(() => !!authStore.me.teste_gratis)

function voltarParaLogin() {
  if (emTeste.value) {
    router.push('/dashboard/arquivos')
    return
  }
  authStore.signOut()
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
      card.value.cvv,
      telefone.value.replace(/\D/g, ''),
      periodicidade.value
    )

    // Limpa os dados do cartão do estado assim que possível.
    limparCartao()

    if (data.status === 'ativa') {
      sucesso.value = true
      toast.success(data.message || 'Pagamento aprovado! Assinatura ativada.')
      trackPurchase({
        transactionId: data.pagamento?.id || data.assinatura?.id,
        plano: dadosTracking(planoSelecionado.value)
      })
    } else if (data.status === 'pendente') {
      toast.info(data.message || 'Assinatura criada. Aguardando confirmação do pagamento.')
      trackPurchase({
        transactionId: data.pagamento?.id || data.assinatura?.id,
        plano: dadosTracking(planoSelecionado.value)
      })
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
  <main class="contratar_page">
    <p class="contratar_page__watermark" aria-hidden="true">&lt;/DOC</p>

    <div v-if="sucesso" class="contratar_shell">
      <img class="contratar_logo" :src="logoAkidocs" alt="Logotipo AkiDocs" />
      <h1 class="contratar_title">Assinatura ativada</h1>
      <p class="contratar_subtitle">Seu pagamento foi aprovado. Você já pode acessar o sistema.</p>
      <button type="button" class="night_btn" @click="router.push('/')">
        IR PARA O LOGIN
      </button>
    </div>

    <div v-else-if="planoSelecionado" class="contratar_shell contratar_shell--pay">
      <button type="button" class="back_btn" aria-label="Voltar aos planos" @click="voltarParaPlanos">
        <img class="back_btn__circle" :src="iconBackCircle" alt="Círculo do botão voltar" width="66" height="66" />
        <img class="back_btn__icon" :src="iconChevronLeft" alt="Ícone de seta para voltar" width="40" height="40" />
      </button>

      <img class="contratar_logo" :src="logoAkidocs" alt="Logotipo AkiDocs" />
      <h1 class="contratar_title">Pagamento</h1>
      <p class="contratar_subtitle">
        {{ planoSelecionado.nome }} —
        <span v-if="periodicidade === 'anual'">{{ formatBRL(valorCobrado(planoSelecionado)) }}/ano</span>
        <span v-else>{{ formatBRL(planoSelecionado.valor_mensal_centavos) }}/mês</span>
        <template v-if="periodicidade === 'anual'">
          <br />Cobrança única por ano, equivale a {{ formatBRL(valorPorMes(planoSelecionado)) }}/mês.
        </template>
      </p>

      <form class="pay_form" @submit.prevent="pagar">
        <label class="night_field">
          <span class="night_field__label">Telefone</span>
          <input
            v-model="telefone"
            type="tel"
            inputmode="numeric"
            maxlength="15"
            placeholder="(11) 99999-8888"
            autocomplete="tel"
            @input="onTelefoneInput"
          />
        </label>
        <label class="night_field">
          <span class="night_field__label">Nome no cartão</span>
          <input
            v-model="card.holder"
            type="text"
            placeholder="Como está no cartão"
            autocomplete="cc-name"
          />
        </label>
        <label class="night_field">
          <span class="night_field__label">Número do cartão</span>
          <input
            v-model="card.number"
            type="text"
            inputmode="numeric"
            maxlength="19"
            placeholder="0000 0000 0000 0000"
            autocomplete="cc-number"
            @input="onCardNumberInput"
          />
        </label>
        <div class="pay_form__row">
          <label class="night_field">
            <span class="night_field__label">Mês</span>
            <input v-model="card.expMonth" type="text" inputmode="numeric" maxlength="2" placeholder="MM" />
          </label>
          <label class="night_field">
            <span class="night_field__label">Ano</span>
            <input v-model="card.expYear" type="text" inputmode="numeric" maxlength="4" placeholder="AAAA" />
          </label>
          <label class="night_field">
            <span class="night_field__label">CVV</span>
            <input
              v-model="card.cvv"
              type="text"
              inputmode="numeric"
              maxlength="4"
              placeholder="123"
              autocomplete="cc-csc"
            />
          </label>
        </div>

        <button type="submit" class="night_btn" :disabled="processando">
          <LoadingSpinner v-if="processando" />
          <span v-else>PAGAR {{ formatBRL(valorCobrado(planoSelecionado)) }}</span>
        </button>
      </form>

      <p class="secure_note">
        Os dados do cartão são criptografados no seu navegador e não passam pelo nosso servidor.
      </p>
    </div>

    <div v-else class="contratar_shell">
      <button
        type="button"
        class="back_btn"
        :aria-label="emTeste ? 'Voltar ao sistema' : 'Voltar ao login'"
        @click="voltarParaLogin"
      >
        <img class="back_btn__circle" :src="iconBackCircle" alt="Círculo do botão voltar" width="66" height="66" />
        <img class="back_btn__icon" :src="iconChevronLeft" alt="Ícone de seta para voltar" width="40" height="40" />
      </button>

      <img class="contratar_logo" :src="logoAkidocs" alt="Logotipo AkiDocs" />
      <h1 class="contratar_title">Escolha seu plano</h1>
      <p v-if="authStore.me.teste_encerrado" class="contratar_subtitle contratar_subtitle--aviso">
        Seu teste grátis terminou. Escolha um plano para continuar usando o AkiDocs.
      </p>
      <p v-else-if="authStore.me.teste_gratis" class="contratar_subtitle contratar_subtitle--aviso">
        Você está no teste grátis. Contrate agora e continue sem interrupção.
      </p>

      <div v-if="!fetching && planos.length" class="periodo_toggle" role="group" aria-label="Forma de cobrança">
        <button
          type="button"
          :class="{ 'is-ativo': periodicidade === 'mensal' }"
          :aria-pressed="periodicidade === 'mensal'"
          @click="periodicidade = 'mensal'"
        >
          Mensal
        </button>
        <button
          type="button"
          :class="{ 'is-ativo': periodicidade === 'anual' }"
          :aria-pressed="periodicidade === 'anual'"
          @click="periodicidade = 'anual'"
        >
          Anual <small v-if="descontoAnual > 0">{{ descontoAnual }}% OFF</small>
        </button>
      </div>

      <p v-if="fetching" class="contratar_loading">Carregando planos...</p>
      <p v-else-if="planos.length === 0" class="contratar_loading">Nenhum plano disponível no momento.</p>

      <div v-else class="planos_grid">
        <article v-for="plano in planos" :key="plano.id" class="plano_card">
          <h2 class="plano_card__nome">{{ plano.nome }}</h2>
          <p class="plano_card__valor">
            {{ formatBRL(valorPorMes(plano)) }}<span>/mês</span>
          </p>
          <p class="plano_card__cobranca">
            {{
              periodicidade === 'anual'
                ? `${formatBRL(valorCobrado(plano))} cobrado por ano`
                : 'Cobrança mensal sem fidelidade'
            }}
          </p>
          <p v-if="plano.descricao" class="plano_card__desc">{{ plano.descricao }}</p>
          <ul class="plano_card__features">
            <li>Até {{ plano.max_usuarios }} usuários</li>
            <li>{{ formatGB(plano.armazenamento_bytes) }} de armazenamento</li>
          </ul>
          <button type="button" class="night_btn" @click="selecionarPlano(plano)">
            CONTRATAR
          </button>
        </article>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@import '@/styles/login-night-mobile.scss';

.contratar_page {
  --login-black: #0B1B2B;
  --login-navy: #1F3A5F;
  --login-gold: #B08D57;
  --login-gray: #FFFCFF;

  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(circle at 85% 15%, rgba(176, 141, 87, 0.12) 0%, transparent 40%), linear-gradient(135deg, #0B1B2B 0%, #1F3A5F 100%);
  font-family: 'Inter', sans-serif;

  @include login-mobile-gradient;
  @include login-mobile-shell;

  &__watermark {
    position: absolute;
    z-index: 0;
    top: 80.28vh;
    right: -1.82vw;
    bottom: auto;
    margin: 0;
    font-size: clamp(90px, 24.07vh, 260px);
    font-weight: 700;
    line-height: 0.9;
    color: rgba(255, 252, 255, 0.05);
    pointer-events: none;
    user-select: none;
    white-space: nowrap;

    @include login-mobile-watermark-hidden;
  }
}

.contratar_shell {
  position: relative;
  z-index: 2;
  width: min(100%, 940px);
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(24px, 4vh, 48px) 18px;
  box-sizing: border-box;
  overflow-y: auto;
  scrollbar-width: none;

  &--pay {
    width: min(100%, 358px);
    max-height: 100dvh;
    padding-bottom: clamp(32px, 5vh, 48px);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

.contratar_logo {
  width: clamp(160px, 18vw, 200px);
  height: auto;
  margin-bottom: 24px;
  object-fit: contain;
}

.contratar_title {
  margin: 0 0 8px;
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  color: #f7f7f7;
  text-align: center;
}

.contratar_subtitle {
  margin: 0 0 28px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #f7f7f7;
  text-align: center;

  span {
    font-weight: 700;
    color: #f7f7f7;
  }

  &--aviso {
    max-width: 520px;
    margin-bottom: 20px;
    color: #d9b77e;
  }
}

.contratar_loading {
  margin: 24px 0 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #f7f7f7;
  opacity: 0.7;
  text-align: center;
}

.periodo_toggle {
  display: inline-flex;
  gap: 4px;
  margin: 4px 0 20px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);

  button {
    padding: 8px 18px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: rgba(255, 252, 255, 0.75);
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;

    small {
      margin-left: 6px;
      padding: 2px 6px;
      border-radius: 999px;
      background: rgba(127, 200, 169, 0.2);
      color: #7fc8a9;
      font-size: 10px;
      font-weight: 700;
    }

    &.is-ativo {
      background: #fffcff;
      color: #0b1b2b;
    }
  }
}

.planos_grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.plano_card {
  width: 270px;
  max-width: 100%;
  padding: 28px 24px;
  border-radius: 24px;
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.18));
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  &__nome {
    margin: 0 0 10px;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #f7f7f7;
    text-align: center;
    text-transform: uppercase;
  }

  &__valor {
    margin: 0 0 16px;
    font-family: 'Inter', sans-serif;
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    color: #f7f7f7;
    text-align: center;

    span {
      margin-left: 4px;
      font-size: 14px;
      font-weight: 400;
      color: #f7f7f7;
      opacity: 0.7;
    }
  }

  &__cobranca {
    margin: -8px 0 14px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: #7fc8a9;
    text-align: center;
  }

  &__desc {
    margin: 0 0 16px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 400;
    color: rgba(255, 252, 255, 0.75);
    text-align: center;
  }

  &__features {
    list-style: none;
    width: 100%;
    margin: 0 0 24px;
    padding: 0;
    flex: 1;

    li {
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #FFFCFF;
      text-align: center;
    }
  }
}

.night_btn {
  width: auto;
  min-width: 168px;
  max-width: 100%;
  min-height: 49px;
  padding: 0 24px;
  border: none;
  border-radius: 30px;
  background: #B08D57;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(176, 141, 87, 0.3);
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #C29F68;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(176, 141, 87, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
}

.back_btn {
  position: fixed;
  z-index: 10;
  top: clamp(24px, 3.5vh, 48px);
  left: clamp(16px, 3vw, 48px);
  width: 66px;
  height: 66px;
  padding: 0;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.15s ease;

  @include login-mobile-back-btn;

  &:hover {
    opacity: 0.85;
  }

  &__circle {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__icon {
    position: relative;
    width: 40px;
    height: 40px;
    transform: rotate(90deg);
    object-fit: contain;

    @include login-mobile-back-btn-icon;
  }
}

.pay_form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  &__row {
    width: 100%;
    display: flex;
    gap: 10px;
  }
}

.night_field {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
  cursor: text;

  &__label {
    padding-left: 20px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 252, 255, 0.85);
    text-transform: uppercase;
  }

  input {
    width: 100%;
    height: 49px;
    padding: 0 22px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.08);
    outline: none;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 400;
    box-sizing: border-box;
    transition: all 0.2s ease;

    &:focus {
      border-color: #B08D57;
      box-shadow: 0 0 0 3px rgba(176, 141, 87, 0.25);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.65);
    }

    @include login-input-autofill(#fff);
  }
}

.secure_note {
  margin: 20px 0 0;
  padding: 0 8px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: rgba(255, 252, 255, 0.8);
  text-align: center;
}

@media (max-width: 768px) {
  .contratar_shell {
    width: 100%;
    max-width: 358px;
    min-height: 100dvh;
    margin: 0 auto;
    padding: 90px 18px 40px;
  }

  .contratar_logo {
    width: 168px;
    margin-bottom: 32px;
  }

  .plano_card {
    width: 100%;
  }

  .pay_form__row {
    flex-direction: column;
  }
}
</style>
