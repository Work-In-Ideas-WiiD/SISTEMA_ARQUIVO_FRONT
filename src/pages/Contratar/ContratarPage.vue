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
import { isValidCnpj, isValidCpf, maskCnpj, maskCpf } from '@/utils/formatCpfCnpj'
import { useAuthStore } from '@/stores/auth'
import { getSelectedPlan, trackBeginCheckout, trackPurchase } from '@/utils/tracking'
import { setPageSeo } from '@/utils/seo'
import logoPagbank from '@/assets/imgs/pagamento/pagbank.png'
import logoVisa from '@/assets/imgs/pagamento/visa.png'
import logoMastercard from '@/assets/imgs/pagamento/mastercard.png'
import logoElo from '@/assets/imgs/pagamento/elo.png'
import logoAmex from '@/assets/imgs/pagamento/amex.png'
import logoHipercard from '@/assets/imgs/pagamento/hipercard.png'

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

/** Segundo plano da lista é o recomendado, como na página inicial. */
function ehRecomendado(index: number) {
  return planos.value.length > 1 && index === 1
}

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
const cpf = ref('')
const cnpj = ref('')

const faltaDocumento = computed(() => {
  const docCpf = (authStore.me.cpf || '').replace(/\D/g, '')
  const docCnpj = (authStore.me.cnpj || '').replace(/\D/g, '')
  return docCpf.length !== 11 && docCnpj.length !== 14
})

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
  if (faltaDocumento.value && !isValidCpf(cpf.value) && !isValidCnpj(cnpj.value)) {
    return toast.error('Informe um CPF ou um CNPJ válido para adquirir o plano.')
  }
  if (cpf.value && !isValidCpf(cpf.value)) {
    return toast.error('CPF inválido.')
  }
  if (cnpj.value && !isValidCnpj(cnpj.value)) {
    return toast.error('CNPJ inválido.')
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
      periodicidade.value,
      faltaDocumento.value
        ? {
            cpf: cpf.value.replace(/\D/g, ''),
            cnpj: cnpj.value.replace(/\D/g, '')
          }
        : undefined
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
    <div v-if="sucesso" class="contratar_shell">
      <div class="logo_chip">
        <img class="contratar_logo" :src="logoAkidocs" alt="Logotipo AkiDocs" />
      </div>
      <div class="sucesso_card">
        <h1 class="contratar_title">Assinatura ativada</h1>
        <p class="contratar_subtitle">Seu pagamento foi aprovado. Você já pode acessar o sistema.</p>
        <button type="button" class="night_btn" @click="router.push('/')">
          IR PARA O LOGIN
        </button>
      </div>
    </div>

    <div v-else-if="planoSelecionado" class="contratar_shell contratar_shell--pay">
      <button type="button" class="back_btn" aria-label="Voltar aos planos" @click="voltarParaPlanos">
        <img class="back_btn__circle" :src="iconBackCircle" alt="Círculo do botão voltar" width="66" height="66" />
        <img class="back_btn__icon" :src="iconChevronLeft" alt="Ícone de seta para voltar" width="40" height="40" />
      </button>

      <header class="checkout_head">
        <div class="logo_chip">
          <img class="contratar_logo" :src="logoAkidocs" alt="Logotipo AkiDocs" />
        </div>
        <h1 class="contratar_title">Finalize sua compra</h1>
        <p class="contratar_subtitle">Confira os dados, pague e continue usando o AkiDocs sem interrupção.</p>
      </header>

      <form class="checkout_grid" @submit.prevent="pagar">
        <section class="checkout_card checkout_card--form" aria-label="Dados de pagamento">
          <h2 class="checkout_card__title">Seus dados</h2>

          <div class="pay_form">
            <template v-if="faltaDocumento">
              <p class="pay_form__aviso">Informe o CPF ou o CNPJ para concluir a compra. Um dos dois basta.</p>
              <div class="pay_form__row">
                <label class="night_field">
                  <span class="night_field__label">CPF</span>
                  <input
                    :value="cpf"
                    type="text"
                    inputmode="numeric"
                    maxlength="14"
                    placeholder="000.000.000-00"
                    autocomplete="off"
                    @input="cpf = maskCpf(($event.target as HTMLInputElement).value)"
                  />
                </label>
                <label class="night_field">
                  <span class="night_field__label">CNPJ</span>
                  <input
                    :value="cnpj"
                    type="text"
                    inputmode="numeric"
                    maxlength="18"
                    placeholder="00.000.000/0000-00"
                    autocomplete="off"
                    @input="cnpj = maskCnpj(($event.target as HTMLInputElement).value)"
                  />
                </label>
              </div>
            </template>
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
          </div>

          <h2 class="checkout_card__title checkout_card__title--spaced">Pagamento com cartão</h2>

          <div class="pay_form">
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
          </div>
        </section>

        <aside class="checkout_card checkout_summary" aria-label="Resumo da compra">
          <h2 class="checkout_card__title">Resumo da compra</h2>

          <div class="summary_plan">
            <div>
              <strong>{{ planoSelecionado.nome }}</strong>
              <span>{{ periodicidade === 'anual' ? 'Assinatura anual' : 'Assinatura mensal' }}</span>
            </div>
            <span v-if="periodicidade === 'anual' && descontoAnual > 0" class="summary_badge">{{ descontoAnual }}% OFF</span>
          </div>

          <ul class="summary_features">
            <li>Até {{ planoSelecionado.max_usuarios }} usuários</li>
            <li>{{ formatGB(planoSelecionado.armazenamento_bytes) }} de armazenamento</li>
          </ul>

          <dl class="summary_lines">
            <div>
              <dt>Plano</dt>
              <dd>{{ formatBRL(valorPorMes(planoSelecionado)) }}/mês</dd>
            </div>
            <div>
              <dt>Cobrança</dt>
              <dd>{{ periodicidade === 'anual' ? 'Uma vez por ano' : 'Todo mês' }}</dd>
            </div>
            <div v-if="periodicidade === 'anual'">
              <dt>Equivale a</dt>
              <dd>{{ formatBRL(valorPorMes(planoSelecionado)) }} por mês</dd>
            </div>
          </dl>

          <div class="summary_total">
            <span>Total hoje</span>
            <strong>{{ formatBRL(valorCobrado(planoSelecionado)) }}</strong>
          </div>

          <button type="submit" class="night_btn night_btn--full" :disabled="processando">
            <LoadingSpinner v-if="processando" />
            <span v-else>PAGAR {{ formatBRL(valorCobrado(planoSelecionado)) }}</span>
          </button>

          <button type="button" class="summary_change" @click="voltarParaPlanos">Trocar de plano</button>

          <div class="pagbank_banner">
            <span class="pagbank_logo">
              <img :src="logoPagbank" alt="PagBank" />
            </span>
            <div>
              <strong>Pagamento protegido pelo PagBank</strong>
              <span>Os dados do cartão são criptografados no seu navegador e não passam pelo nosso servidor.</span>
            </div>
          </div>

          <div class="card_brands" aria-label="Bandeiras aceitas">
            <span class="brand_box"><img :src="logoVisa" alt="Visa" /></span>
            <span class="brand_box"><img :src="logoMastercard" alt="Mastercard" /></span>
            <span class="brand_box brand_box--round"><img :src="logoElo" alt="Elo" /></span>
            <span class="brand_box brand_box--round"><img :src="logoAmex" alt="American Express" /></span>
            <span class="brand_box"><img :src="logoHipercard" alt="Hipercard" /></span>
          </div>
        </aside>
      </form>
    </div>

    <div v-else class="contratar_shell contratar_shell--planos">
      <button
        type="button"
        class="back_btn"
        :aria-label="emTeste ? 'Voltar ao sistema' : 'Voltar ao login'"
        @click="voltarParaLogin"
      >
        <img class="back_btn__circle" :src="iconBackCircle" alt="Círculo do botão voltar" width="66" height="66" />
        <img class="back_btn__icon" :src="iconChevronLeft" alt="Ícone de seta para voltar" width="40" height="40" />
      </button>

      <div class="logo_chip">
        <img class="contratar_logo" :src="logoAkidocs" alt="Logotipo AkiDocs" />
      </div>
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
        <article
          v-for="(plano, index) in planos"
          :key="plano.id"
          class="plano_card"
          :class="{ 'plano_card--recomendado': ehRecomendado(index) }"
        >
          <span v-if="ehRecomendado(index)" class="plano_card__tag">Recomendado</span>
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
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Até {{ plano.max_usuarios }} usuários
            </li>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
              {{ formatGB(plano.armazenamento_bytes) }} de armazenamento
            </li>
          </ul>
          <button type="button" class="night_btn" :class="{ 'night_btn--ghost': !ehRecomendado(index) }" @click="selecionarPlano(plano)">
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
  --cream: #f6f1e7;
  --cream-dark: #efe6d4;
  --paper: #fffdf8;
  --ink: #12263a;
  --muted: #5f7082;
  --line: #e3d9c3;
  --gold: #b08d57;
  --gold-dark: #94744a;
  --teal: #2f6f6d;

  min-height: 100dvh;
  background:
    radial-gradient(circle at 85% 8%, rgba(176, 141, 87, 0.16) 0%, transparent 34%),
    linear-gradient(180deg, var(--cream) 0%, #fbf8f1 100%);
  color: var(--ink);
  font-family: 'Inter', sans-serif;
}

.contratar_shell {
  position: relative;
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: clamp(28px, 5vh, 56px) 20px 64px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  &--pay {
    align-items: stretch;
  }
}

.logo_chip {
  display: inline-flex;
  padding: 12px 20px;
  margin-bottom: 22px;
  border-radius: 16px;
  background: #0b1b2b;
  box-shadow: 0 10px 24px rgba(11, 27, 43, 0.18);
}

.contratar_logo {
  width: 168px;
  height: auto;
  display: block;
  object-fit: contain;
}

.contratar_title {
  margin: 0 0 8px;
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  line-height: 1.15;
  color: var(--ink);
  text-align: center;
}

.contratar_subtitle {
  margin: 0 0 26px;
  max-width: 620px;
  font-size: 15px;
  line-height: 1.55;
  color: var(--muted);
  text-align: center;

  &--aviso {
    padding: 12px 18px;
    border: 1px solid rgba(176, 141, 87, 0.45);
    border-radius: 14px;
    background: rgba(176, 141, 87, 0.12);
    color: #7a5c2e;
    font-weight: 600;
  }
}

.contratar_loading {
  margin: 24px 0 0;
  font-size: 14px;
  color: var(--muted);
  text-align: center;
}

.sucesso_card,
.checkout_card {
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--paper);
  box-shadow: 0 16px 36px rgba(74, 58, 32, 0.1);
}

.sucesso_card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 32px;
}

/* ---------- Planos ---------- */

.periodo_toggle {
  display: inline-flex;
  gap: 4px;
  margin: 2px 0 30px;
  padding: 4px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--paper);
  box-shadow: 0 8px 20px rgba(74, 58, 32, 0.08);

  button {
    padding: 9px 20px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--muted);
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;

    small {
      margin-left: 6px;
      padding: 2px 7px;
      border-radius: 999px;
      background: rgba(47, 111, 109, 0.14);
      color: var(--teal);
      font-size: 10px;
      font-weight: 800;
    }

    &.is-ativo {
      background: #0b1b2b;
      color: #fffcff;
    }
  }
}

.planos_grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 22px;
  align-items: stretch;
}

.plano_card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 26px 28px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--paper);
  box-shadow: 0 12px 28px rgba(74, 58, 32, 0.08);
  box-sizing: border-box;
  text-align: center;

  &--recomendado {
    border: 2px solid var(--gold);
    box-shadow: 0 20px 42px rgba(146, 116, 74, 0.22);
    transform: translateY(-6px);
  }

  &__tag {
    position: absolute;
    top: -13px;
    left: 50%;
    transform: translateX(-50%);
    padding: 5px 16px;
    border-radius: 999px;
    background: var(--gold);
    color: #fff;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  &__nome {
    margin: 0 0 10px;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: var(--ink);
    text-transform: uppercase;
  }

  &__valor {
    margin: 0 0 6px;
    font-size: 30px;
    font-weight: 800;
    line-height: 1;
    color: var(--ink);

    span {
      margin-left: 4px;
      font-size: 14px;
      font-weight: 500;
      color: var(--muted);
    }
  }

  &__cobranca {
    margin: 0 0 14px;
    font-size: 12px;
    font-weight: 600;
    color: var(--teal);
  }

  &__desc {
    margin: 0 0 16px;
    font-size: 13px;
    line-height: 1.5;
    color: var(--muted);
  }

  &__features {
    width: 100%;
    flex: 1;
    margin: 0 0 24px;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 0;
      border-bottom: 1px solid #f0e8d5;
      font-size: 14px;
      color: var(--ink);

      svg {
        flex-shrink: 0;
        color: var(--gold);
      }
    }
  }
}

/* ---------- Aquisição ---------- */

.checkout_head {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 6px;
}

.checkout_grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(300px, 1fr);
  gap: 24px;
  align-items: start;
  width: 100%;
}

.checkout_card {
  padding: 28px;

  &__title {
    margin: 0 0 18px;
    font-size: 17px;
    font-weight: 800;
    color: var(--ink);

    &--spaced {
      margin-top: 28px;
    }
  }
}

.checkout_summary {
  position: sticky;
  top: 24px;
}

.summary_plan {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);

  strong {
    display: block;
    font-size: 18px;
    font-weight: 800;
    color: var(--ink);
  }

  span {
    display: block;
    margin-top: 3px;
    font-size: 13px;
    color: var(--muted);
  }
}

.summary_badge {
  flex-shrink: 0;
  margin-top: 0 !important;
  padding: 4px 9px;
  border-radius: 999px;
  background: rgba(47, 111, 109, 0.14);
  color: var(--teal) !important;
  font-size: 11px !important;
  font-weight: 800;
}

.summary_features {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;

  li {
    padding: 7px 0;
    font-size: 14px;
    color: var(--ink);
  }
}

.summary_lines {
  margin: 14px 0 0;
  padding-top: 8px;
  border-top: 1px solid var(--line);

  div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 7px 0;
    font-size: 14px;
  }

  dt {
    color: var(--muted);
  }

  dd {
    margin: 0;
    font-weight: 600;
    color: var(--ink);
    text-align: right;
  }
}

.summary_total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
  padding: 16px 0 20px;
  border-top: 1px solid var(--line);

  span {
    font-size: 14px;
    color: var(--muted);
  }

  strong {
    font-size: 26px;
    font-weight: 800;
    color: var(--ink);
    white-space: nowrap;
  }
}

.summary_change {
  display: block;
  margin: 12px auto 0;
  padding: 4px 8px;
  border: 0;
  background: transparent;
  color: var(--gold-dark);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

.pagbank_banner {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 22px;
  padding: 16px;
  border-radius: 14px;
  background: #0b1b2b;
  color: #fffcff;

  strong {
    display: block;
    font-size: 14px;
    line-height: 1.35;
  }

  div span {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.5;
    color: rgba(255, 252, 255, 0.78);
  }
}

.pagbank_logo {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 10px;
  background: #fff;

  img {
    display: block;
    width: 92px;
    height: auto;
  }
}

.card_brands {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.brand_box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 5px 10px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: #fff;
  box-sizing: border-box;

  img {
    display: block;
    width: auto;
    max-width: 76px;
    height: 22px;
    object-fit: contain;
  }

  &--round img {
    height: 28px;
  }
}

/* ---------- Formulário ---------- */

.pay_form {
  display: flex;
  flex-direction: column;
  gap: 15px;

  &__row {
    display: flex;
    gap: 12px;
  }

  &__aviso {
    margin: 0;
    padding: 12px 14px;
    border: 1px solid rgba(176, 141, 87, 0.45);
    border-radius: 12px;
    background: rgba(176, 141, 87, 0.1);
    color: #7a5c2e;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.45;
  }
}

.night_field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  cursor: text;

  &__label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--muted);
    text-transform: uppercase;
  }

  input {
    width: 100%;
    height: 48px;
    padding: 0 16px;
    border: 1px solid #d9cfb6;
    border-radius: 12px;
    background: #fff;
    outline: none;
    color: var(--ink);
    font: inherit;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(176, 141, 87, 0.22);
    }

    &::placeholder {
      color: #9aa8b5;
    }

    @include login-input-autofill(#12263a);
  }
}

.night_btn {
  min-width: 190px;
  min-height: 49px;
  padding: 0 26px;
  border: none;
  border-radius: 999px;
  background: var(--gold);
  color: #fff;
  box-shadow: 0 8px 20px rgba(176, 141, 87, 0.35);
  font: inherit;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--gold-dark);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  &--ghost {
    border: 1px solid #0b1b2b;
    background: transparent;
    color: #0b1b2b;
    box-shadow: none;

    &:hover:not(:disabled) {
      background: #0b1b2b;
      color: #fffcff;
    }
  }

  &--full {
    width: 100%;
  }
}

.back_btn {
  position: absolute;
  z-index: 10;
  top: 22px;
  left: 20px;
  width: 52px;
  height: 52px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: #0b1b2b;
  box-shadow: 0 8px 20px rgba(11, 27, 43, 0.22);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &__circle {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__icon {
    position: relative;
    width: 30px;
    height: 30px;
    transform: rotate(90deg);
    object-fit: contain;
  }
}

@media (max-width: 900px) {
  .checkout_grid {
    grid-template-columns: 1fr;
  }

  .checkout_summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .contratar_shell {
    padding: 84px 16px 48px;
  }

  .plano_card--recomendado {
    transform: none;
  }

  .pay_form__row {
    flex-direction: column;
  }

  .checkout_card {
    padding: 22px 18px;
  }
}
</style>
