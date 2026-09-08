<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPlanosPublicos, type IPlanoPublico } from '@/services/http/planos'
import { saveSelectedPlan, trackEvent, getStoredUtmParams } from '@/utils/tracking'

const router = useRouter()

const billingCycle = ref<'mensal' | 'anual'>('anual')
const loading = ref(true)
const apiPlanos = ref<IPlanoPublico[]>([])

// Fallback plans if API endpoint is empty or offline
const fallbackPlanos: IPlanoPublico[] = [
  {
    id: 'plano-starter',
    nome: 'Básico',
    descricao: 'Ideal para escritórios e pequenas empresas organizarem seus primeiros arquivos e contratos.',
    valor_mensal_centavos: 8990,
    max_usuarios: 5,
    armazenamento_bytes: 20 * 1024 * 1024 * 1024
  },
  {
    id: 'plano-pro',
    nome: 'Profissional',
    descricao: 'A solução mais completa para empresas em crescimento com múltiplos setores e clientes.',
    valor_mensal_centavos: 17990,
    max_usuarios: 25,
    armazenamento_bytes: 100 * 1024 * 1024 * 1024
  },
  {
    id: 'plano-enterprise',
    nome: 'Empresarial',
    descricao: 'Para grandes demandas documentais com alta volumetria e suporte corporativo dedicado.',
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

function formatBRL(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

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
    `${gb} de Armazenamento Seguro`,
    'Gestão Centralizada de Contratos',
    'Organização por Setores e Funções',
    'Portal Exclusivo do Cliente',
    'Criptografia de Ponta a Ponta'
  ]

  if (plano.max_usuarios > 5) {
    list.push('Módulo de Assinaturas Digitais')
    list.push('Suporte Técnico Prioritário')
  }

  if (plano.max_usuarios >= 50) {
    list.push('Auditoria e Relatórios Avançados')
    list.push('SLA Garantido de Disponibilidade')
  }

  return list
}

function handleSelectPlan(plano: IPlanoPublico) {
  trackEvent('selecionar_plano', {
    plano_id: plano.id,
    plano_nome: plano.nome,
    periodicidade: billingCycle.value
  })
  trackEvent('contratar_plano', {
    plano_nome: plano.nome,
    periodicidade: billingCycle.value
  })

  saveSelectedPlan({
    id: plano.id,
    nome: plano.nome,
    valor_mensal_centavos: getCalculatedPrice(plano.valor_mensal_centavos),
    periodicidade: billingCycle.value
  })

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
            COMEÇAR AGORA
          </button>

          <div class="features_divider"></div>

          <div class="plan_features_wrap">
            <span class="features_label">O que está incluído:</span>
            <ul class="features_list">
              <li v-for="(feat, fIdx) in getFeaturesForPlan(plano)" :key="fIdx">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff00ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ feat }}</span>
              </li>
            </ul>
          </div>
        </article>
      </div>

      <div class="pricing_guarantee">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff00ff" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>
          Precisa de um plano sob medida para alta volumetria?
          <a href="mailto:contato@wi-id.com" class="guarantee_link">Fale com nossos consultores (contato@wi-id.com)</a>
          ou pelo
          <a href="https://wa.me/5562983398612" target="_blank" rel="noopener noreferrer" class="guarantee_link">WhatsApp (62) 98339-8612</a>.
        </span>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.pricing_section {
  position: relative;
  padding: 100px 24px;
  background: #212121;
  border-top: 1px solid rgba(247, 247, 247, 0.05);
}

.pricing_container {
  max-width: 1240px;
  margin: 0 auto;
}

.section_header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 56px;
}

.section_badge {
  display: inline-block;
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #ff00ff;
  letter-spacing: 1px;
  padding: 6px 14px;
  background: rgba(255, 0, 255, 0.1);
  border: 1px solid rgba(255, 0, 255, 0.25);
  border-radius: 20px;
  margin-bottom: 16px;
}

.section_title {
  margin: 0 0 16px;
  font-family: 'Source Code Pro', monospace;
  font-size: clamp(26px, 2.5vw, 36px);
  font-weight: 700;
  color: #f7f7f7;
  line-height: 1.25;
}

.section_subtitle {
  margin: 0 0 32px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: rgba(247, 247, 247, 0.7);
}

/* Billing Toggle Switch */
.billing_toggle_wrap {
  display: inline-flex;
  align-items: center;
  background: rgba(121, 121, 121, 0.2);
  border: 1px solid rgba(247, 247, 247, 0.1);
  padding: 4px;
  border-radius: 40px;
  gap: 4px;
}

.toggle_btn {
  background: transparent;
  border: none;
  font-family: 'Source Code Pro', monospace;
  font-size: 13px;
  font-weight: 600;
  color: rgba(247, 247, 247, 0.7);
  padding: 8px 18px;
  border-radius: 30px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &--active {
    background: #f7f7f7;
    color: #212121;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

.discount_badge {
  font-size: 10px;
  font-weight: 800;
  background: #ff00ff;
  color: #ffffff;
  padding: 2px 6px;
  border-radius: 12px;
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
  background: rgba(121, 121, 121, 0.12);
  border: 1px solid rgba(247, 247, 247, 0.1);
  border-radius: 28px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 0, 255, 0.4);
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6);
  }

  &--popular {
    background: rgba(121, 121, 121, 0.22);
    border-color: #ff00ff;
    box-shadow: 0 0 35px rgba(255, 0, 255, 0.18);
  }
}

.popular_tag {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff00ff;
  color: #ffffff;
  font-family: 'Source Code Pro', monospace;
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
  font-family: 'Source Code Pro', monospace;
  font-size: 24px;
  font-weight: 800;
  color: #f7f7f7;
  text-transform: uppercase;
}

.plan_desc {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  color: rgba(247, 247, 247, 0.65);
  min-height: 40px;
}

.card_price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.currency {
  font-family: 'Source Code Pro', monospace;
  font-size: 18px;
  font-weight: 700;
  color: #f7f7f7;
}

.amount {
  font-family: 'Source Code Pro', monospace;
  font-size: 40px;
  font-weight: 800;
  color: #f7f7f7;
  line-height: 1;
}

.period {
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  font-weight: 500;
  color: rgba(247, 247, 247, 0.6);
}

.annual_note {
  margin: 0 0 28px;
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  color: #ff00ff;
}

.plan_cta_btn {
  width: 100%;
  padding: 14px;
  border-radius: 30px;
  border: 1px solid rgba(247, 247, 247, 0.3);
  background: transparent;
  color: #f7f7f7;
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 28px;

  &:hover {
    background: rgba(255, 0, 255, 0.15);
    border-color: #ff00ff;
    color: #ff00ff;
  }

  &--popular {
    background: #f7f7f7;
    color: #212121;
    border: none;

    &:hover {
      background: #ffffff;
      box-shadow: 0 0 20px rgba(255, 0, 255, 0.6);
      color: #212121;
    }
  }
}

.features_divider {
  height: 1px;
  background: rgba(247, 247, 247, 0.08);
  margin-bottom: 24px;
}

.plan_features_wrap {
  flex-grow: 1;
}

.features_label {
  display: block;
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(247, 247, 247, 0.55);
  margin-bottom: 14px;
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
    line-height: 1.45;
    color: rgba(247, 247, 247, 0.85);
  }
}

.pricing_guarantee {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(247, 247, 247, 0.7);
  background: rgba(121, 121, 121, 0.12);
  padding: 16px 24px;
  border-radius: 18px;
  border: 1px solid rgba(247, 247, 247, 0.06);

  .guarantee_link {
    color: #ff00ff;
    text-decoration: underline;
    font-weight: 600;

    &:hover {
      color: #ffffff;
    }
  }
}
</style>
