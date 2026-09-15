<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPlanosPublicos, type IPlanoPublico } from '@/services/http/planos'
import {
  saveSelectedPlan,
  trackPlanSelection,
  trackBeginCheckout,
  trackContactClick,
  getStoredUtmParams
} from '@/utils/tracking'

const router = useRouter()

const billingCycle = ref<'mensal' | 'anual'>('anual')
const loading = ref(true)
const apiPlanos = ref<IPlanoPublico[]>([])

// Fallback plans if API endpoint is empty or offline
const fallbackPlanos: IPlanoPublico[] = [
  {
    id: 'plano-starter',
    nome: 'Básico',
    descricao: 'Ideal para escritórios e pequenas empresas organizarem seus arquivos com segurança na nuvem.',
    valor_mensal_centavos: 8990,
    max_usuarios: 5,
    armazenamento_bytes: 20 * 1024 * 1024 * 1024
  },
  {
    id: 'plano-pro',
    nome: 'Profissional',
    descricao: 'A solução ideal para empresas em crescimento com múltiplos setores e clientes.',
    valor_mensal_centavos: 17990,
    max_usuarios: 25,
    armazenamento_bytes: 100 * 1024 * 1024 * 1024
  },
  {
    id: 'plano-enterprise',
    nome: 'Empresarial',
    descricao: 'Para grandes demandas de arquivos com alta volumetria e suporte corporativo dedicado.',
    valor_mensal_centavos: 34990,
    max_usuarios: 100,
    armazenamento_bytes: 500 * 1024 * 1024 * 1024
  }
]

onMounted(async () => {
  try {
    const res = await getPlanosPublicos()
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      apiPlanos.value = res.data
    }
  } catch (err) {
    console.warn('Não foi possível carregar planos da API, utilizando catálogo de referência:', err)
  } finally {
    loading.value = false
  }
})

const displayedPlanos = computed(() => {
  return apiPlanos.value.length > 0 ? apiPlanos.value : fallbackPlanos
})

function formatGB(bytes: number): string {
  const gb = bytes / 1024 ** 3
  return `${gb.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} GB`
}

function getCalculatedPrice(valorMensalCentavos: number): number {
  if (billingCycle.value === 'anual') {
    // 20% discount on annual billing
    return Math.round(valorMensalCentavos * 0.8)
  }
  return valorMensalCentavos
}

function getFeaturesForPlan(plano: IPlanoPublico): string[] {
  const gb = formatGB(plano.armazenamento_bytes)
  const users = plano.max_usuarios >= 100 ? 'Usuários Ilimitados' : `Até ${plano.max_usuarios} Usuários`

  const list = [
    users,
    `${gb} de Armazenamento Total`,
    'Limite de até 150 MB por arquivo',
    'Acessos Ilimitados para seus Clientes',
    'Organização por Setores e Funções',
    'Confirmação de Leitura de Documentos',
    'Criptografia na Infraestrutura',
    'Backups Diários Inclusos'
  ]

  if (plano.max_usuarios > 5) {
    list.push('Suporte Técnico Prioritário')
  }

  if (plano.max_usuarios >= 50) {
    list.push('Auditoria e Relatórios de Utilização')
    list.push('Compromisso de SLA 99,5%')
  }

  return list
}

function handleSelectPlan(plano: IPlanoPublico) {
  const selectedPlanData = {
    id: plano.id,
    nome: plano.nome,
    valor_mensal_centavos: getCalculatedPrice(plano.valor_mensal_centavos),
    periodicidade: billingCycle.value
  }

  trackPlanSelection(selectedPlanData)
  trackBeginCheckout(selectedPlanData)
  saveSelectedPlan(selectedPlanData)

  const utms = getStoredUtmParams()
  router.push({
    path: '/cadastro',
    query: {
      plano: plano.id,
      billing: billingCycle.value,
      ...utms
    }
  })
}

function onWhatsAppContactClick() {
  trackContactClick('whatsapp', 'pricing_custom_plan', '5562983398612')
}
</script>

<template>
  <section id="planos" class="pricing_section" aria-labelledby="pricing-title">
    <div class="pricing_container">
      <div class="section_header">
        <span class="section_badge">PLANOS E INVESTIMENTO</span>
        <h2 id="pricing-title" class="section_title">
          Planos transparentes para todas as etapas do seu negócio
        </h2>
        <p class="section_subtitle">
          Escolha a capacidade ideal para o momento da sua empresa. Sem taxas ocultas, sem fidelidade forçada.
        </p>

        <!-- Commercial Conditions Bar -->
        <div class="commercial_specs_bar">
          <div class="spec_item">
            <strong>150 MB</strong>
            <span>Limite por arquivo</span>
          </div>
          <div class="spec_divider"></div>
          <div class="spec_item">
            <strong>1 TB</strong>
            <span>Banda de transferência</span>
          </div>
          <div class="spec_divider"></div>
          <div class="spec_item">
            <strong>Ilimitados</strong>
            <span>Acessos de clientes</span>
          </div>
          <div class="spec_divider"></div>
          <div class="spec_item">
            <strong>8 Dias</strong>
            <span>Teste 100% grátis</span>
          </div>
        </div>

        <!-- Billing Toggle -->
        <div class="billing_toggle_wrap" role="group" aria-label="Opções de faturamento">
          <button
            type="button"
            class="toggle_btn"
            :class="{ 'toggle_btn--active': billingCycle === 'mensal' }"
            @click="billingCycle = 'mensal'"
          >
            Faturamento Mensal
          </button>
          <button
            type="button"
            class="toggle_btn"
            :class="{ 'toggle_btn--active': billingCycle === 'anual' }"
            @click="billingCycle = 'anual'"
          >
            <span>Faturamento Anual</span>
            <span class="discount_badge">20% OFF</span>
          </button>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="pricing_grid">
        <article
          v-for="(plano, index) in displayedPlanos"
          :key="plano.id"
          class="pricing_card"
          :class="{ 'pricing_card--popular': index === 1 }"
        >
          <!-- Popular Badge for middle plan -->
          <div v-if="index === 1" class="popular_tag">MAIS ESCOLHIDO</div>

          <div class="card_header">
            <h3 class="plan_name">{{ plano.nome }}</h3>
            <p v-if="plano.descricao" class="plan_desc">{{ plano.descricao }}</p>
          </div>

          <div class="card_price">
            <span class="currency">R$</span>
            <span class="amount">
              {{ (getCalculatedPrice(plano.valor_mensal_centavos) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </span>
            <span class="period">/mês</span>
          </div>

          <p v-if="billingCycle === 'anual'" class="annual_note">
            Cobrado anualmente (economia de 20%)
          </p>
          <p v-else class="annual_note">
            Cobrança mensal sem fidelidade
          </p>

          <button
            type="button"
            class="plan_cta_btn"
            :class="{ 'plan_cta_btn--popular': index === 1 }"
            @click="handleSelectPlan(plano)"
          >
            TESTAR GRÁTIS POR 8 DIAS
          </button>

          <div class="features_divider"></div>

          <div class="plan_features_wrap">
            <span class="features_label">O que está incluído:</span>
            <ul class="features_list">
              <li v-for="(feat, fIdx) in getFeaturesForPlan(plano)" :key="fIdx">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B08D57" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ feat }}</span>
              </li>
            </ul>
          </div>
        </article>
      </div>

      <!-- Novo Bloco Sob Medida -->
      <div class="pricing_guarantee">
        <span class="custom_plan_text">Precisa de um plano sob medida para demanda?</span>
        <a
          href="https://wa.me/5562983398612"
          target="_blank"
          rel="noopener noreferrer"
          class="custom_plan_btn"
          @click="onWhatsAppContactClick"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span>Chame a gente no WhatsApp</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.pricing_section {
  position: relative;
  padding: 100px 24px;
  background: #0B1B2B;
  border-top: 1px solid rgba(255, 252, 255, 0.08);
}

.pricing_container {
  max-width: 1240px;
  margin: 0 auto;
}

.section_header {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 56px;
}

.section_badge {
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #B08D57;
  letter-spacing: 1px;
  padding: 6px 14px;
  background: rgba(176, 141, 87, 0.15);
  border: 1px solid rgba(176, 141, 87, 0.35);
  border-radius: 20px;
  margin-bottom: 16px;
}

.section_title {
  margin: 0 0 16px;
  font-family: 'Inter', sans-serif;
  font-size: clamp(26px, 2.5vw, 36px);
  font-weight: 700;
  color: #FFFCFF;
  line-height: 1.25;
}

.section_subtitle {
  margin: 0 0 24px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: rgba(255, 252, 255, 0.7);
}

.commercial_specs_bar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  background: rgba(11, 27, 43, 0.85);
  border: 1px solid rgba(255, 252, 255, 0.15);
  border-radius: 40px;
  padding: 12px 28px;
  margin-bottom: 32px;
}

.spec_item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  strong {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #B08D57;
  }

  span {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    color: rgba(255, 252, 255, 0.75);
  }
}

.spec_divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 252, 255, 0.15);

  @media (max-width: 600px) {
    display: none;
  }
}

/* Billing Toggle Switch */
.billing_toggle_wrap {
  display: inline-flex;
  align-items: center;
  background: #1F2933;
  border: 1px solid rgba(255, 252, 255, 0.12);
  padding: 4px;
  border-radius: 40px;
  gap: 4px;
}

.toggle_btn {
  background: transparent;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 252, 255, 0.7);
  padding: 8px 18px;
  border-radius: 30px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &--active {
    background: #FFFCFF;
    color: #0B1B2B;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(11, 27, 43, 0.5);
  }
}

.discount_badge {
  font-size: 10px;
  font-weight: 700;
  background: #2F6F6D;
  color: #FFFCFF;
  padding: 2px 6px;
  border-radius: 10px;
}

/* Pricing Grid */
.pricing_grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  align-items: stretch;
  margin-bottom: 48px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 460px;
    margin-left: auto;
    margin-right: auto;
  }
}

.pricing_card {
  position: relative;
  background: #1F2933;
  border: 1px solid rgba(255, 252, 255, 0.1);
  border-radius: 24px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
  box-shadow: 0 12px 30px rgba(11, 27, 43, 0.5);

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(176, 141, 87, 0.4);
    box-shadow: 0 20px 45px rgba(11, 27, 43, 0.8);
  }

  &--popular {
    background: #1F2933;
    border-color: #B08D57;
    box-shadow: 0 0 35px rgba(31, 58, 95, 0.5), 0 12px 30px rgba(11, 27, 43, 0.6);
  }
}

.popular_tag {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #B08D57;
  color: #0B1B2B;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  padding: 4px 16px;
  border-radius: 20px;
  white-space: nowrap;
}

.card_header {
  margin-bottom: 24px;
}

.plan_name {
  margin: 0 0 8px;
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #FFFCFF;
  text-transform: uppercase;
}

.plan_desc {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: rgba(255, 252, 255, 0.65);
  min-height: 40px;
}

.card_price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.currency {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #B08D57;
}

.amount {
  font-family: 'Inter', sans-serif;
  font-size: 38px;
  font-weight: 800;
  color: #FFFCFF;
  letter-spacing: -1px;
}

.period {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(255, 252, 255, 0.6);
}

.annual_note {
  margin: 0 0 28px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #2F6F6D;
  font-weight: 600;
}

.plan_cta_btn {
  width: 100%;
  padding: 14px;
  border-radius: 30px;
  border: 1px solid rgba(255, 252, 255, 0.25);
  background: transparent;
  color: #FFFCFF;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 28px;

  &:hover {
    background: rgba(31, 58, 95, 0.4);
    border-color: #B08D57;
    color: #B08D57;
  }

  &--popular {
    background: #B08D57;
    color: #FFFFFF;
    border: none;

    &:hover {
      background: #FFFCFF;
      color: #0B1B2B;
      box-shadow: 0 0 20px rgba(176, 141, 87, 0.5);
    }
  }
}

.features_divider {
  height: 1px;
  background: rgba(255, 252, 255, 0.08);
  margin-bottom: 24px;
}

.plan_features_wrap {
  flex-grow: 1;
}

.features_label {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 252, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 16px;
}

.features_list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: rgba(255, 252, 255, 0.85);
    line-height: 1.4;

    svg {
      flex-shrink: 0;
      margin-top: 2px;
    }
  }
}

/* Novo Bloco Sob Medida */
.pricing_guarantee {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  text-align: center;
  background: #1F2933;
  padding: 18px 28px;
  border-radius: 20px;
  border: 1px solid #B08D57;
  box-shadow: 0 10px 30px rgba(11, 27, 43, 0.6);
  flex-wrap: wrap;
}

.custom_plan_text {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #FFFCFF;
}

.custom_plan_btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #25D366;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 22px;
  border-radius: 30px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);

  &:hover {
    background: #20BA5A;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.45);
  }
}
</style>
